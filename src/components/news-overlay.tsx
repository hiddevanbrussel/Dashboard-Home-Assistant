"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { useNewsStore } from "@/stores/news-store";
import { useTranslation } from "@/hooks/use-translation";
import type { NewsItem } from "@/app/api/rss/route";

function relativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}u`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

type Props = { isOpen: boolean; onClose: () => void };

export function NewsOverlay({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const { rssUrls } = useNewsStore();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    if (rssUrls.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        rssUrls.map((url) =>
          fetch(`/api/rss?url=${encodeURIComponent(url)}`).then((r) =>
            r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))
          )
        )
      );
      const all: NewsItem[] = [];
      let anyError = false;
      for (const result of results) {
        if (result.status === "fulfilled") {
          const data = result.value as { items?: NewsItem[] };
          if (Array.isArray(data.items)) all.push(...data.items);
        } else {
          anyError = true;
        }
      }
      // Sort by date descending
      all.sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return db - da;
      });
      setItems(all);
      if (anyError && all.length === 0) setError(t("news.error"));
    } catch {
      setError(t("news.error"));
    } finally {
      setLoading(false);
    }
  }, [rssUrls, t]);

  useEffect(() => {
    if (!isOpen) return;
    fetchFeeds();
  }, [isOpen, fetchFeeds]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("news.title")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-gray-500 dark:text-white/50" aria-hidden />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t("news.title")}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={fetchFeeds}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 transition-colors"
              aria-label={t("news.refresh")}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label={t("news.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 dark:border-white/20 border-t-gray-700 dark:border-t-white/70" aria-hidden />
            </div>
          ) : error && items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">{error}</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">{t("news.noItems")}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-white/5">
              {items.map((item, i) => (
                <li key={`${item.link}-${i}`}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                    aria-label={t("news.openArticle")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-white/30">
                        {item.source}
                        {item.pubDate && ` · ${relativeTime(item.pubDate)}`}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-white/20 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mt-0.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
