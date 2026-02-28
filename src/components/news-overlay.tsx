"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Newspaper, RefreshCw, ArrowLeft, BookOpen } from "lucide-react";
import { useNewsStore } from "@/stores/news-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/app/api/rss/route";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Module-level cache so feeds don't re-fetch on every open
const feedCache = {
  items: [] as NewsItem[],
  fetchedAt: 0,
  urlsKey: "",
};

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

  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [articleParagraphs, setArticleParagraphs] = useState<string[] | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);

  const detailRef = useRef<HTMLDivElement>(null);

  const fetchFeeds = useCallback(async (force = false) => {
    if (rssUrls.length === 0) return;
    const urlsKey = rssUrls.join("|");
    const isStale = Date.now() - feedCache.fetchedAt > CACHE_TTL;
    const urlsChanged = feedCache.urlsKey !== urlsKey;

    if (!force && !isStale && !urlsChanged && feedCache.items.length > 0) {
      setItems(feedCache.items);
      return;
    }

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
      all.sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return db - da;
      });

      feedCache.items = all;
      feedCache.fetchedAt = Date.now();
      feedCache.urlsKey = urlsKey;

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

  // Reset selection when closing
  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
      setArticleParagraphs(null);
      setArticleError(null);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) { setSelected(null); setArticleParagraphs(null); }
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, selected]);

  function selectArticle(item: NewsItem) {
    setSelected(item);
    setArticleParagraphs(null);
    setArticleError(null);
    // Scroll detail panel to top
    setTimeout(() => detailRef.current?.scrollTo({ top: 0 }), 0);
  }

  async function loadFullArticle() {
    if (!selected) return;
    setArticleLoading(true);
    setArticleError(null);
    try {
      const res = await fetch(`/api/article?url=${encodeURIComponent(selected.link)}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed");
      const paragraphs: string[] = data.paragraphs ?? [];
      if (paragraphs.length === 0) {
        setArticleError(t("news.noContent"));
      } else {
        setArticleParagraphs(paragraphs);
      }
    } catch {
      setArticleError(t("news.fullArticleError"));
    } finally {
      setArticleLoading(false);
    }
  }

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
      <div className="relative z-10 w-full max-w-5xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            {selected ? (
              <button
                type="button"
                onClick={() => { setSelected(null); setArticleParagraphs(null); }}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors sm:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("news.back")}
              </button>
            ) : null}
            <Newspaper className="h-4 w-4 text-gray-500 dark:text-white/50 hidden sm:block" aria-hidden />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white hidden sm:block">{t("news.title")}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fetchFeeds(true)}
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

        {/* Body: two panels */}
        <div className="flex flex-1 min-h-0">

          {/* Left panel: article list */}
          <div
            className={cn(
              "shrink-0 w-full sm:w-2/5 sm:border-r border-gray-200 dark:border-white/10 overflow-y-auto",
              // On mobile: hide list when article is selected
              selected ? "hidden sm:block" : "block"
            )}
          >
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 dark:border-white/20 border-t-gray-700 dark:border-t-white/70" />
              </div>
            ) : error && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">{error}</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">{t("news.noItems")}</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item, i) => (
                  <li key={`${item.link}-${i}`}>
                    <button
                      type="button"
                      onClick={() => selectArticle(item)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 px-4 py-3.5 transition-colors",
                        selected?.link === item.link
                          ? "bg-indigo-50 dark:bg-indigo-950/40"
                          : "hover:bg-gray-50 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium leading-snug line-clamp-2 transition-colors",
                          selected?.link === item.link
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-gray-900 dark:text-white"
                        )}>
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
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right panel: article detail */}
          <div
            ref={detailRef}
            className={cn(
              "flex-1 overflow-y-auto",
              // On mobile: only show when article is selected
              selected ? "block" : "hidden sm:flex sm:items-center sm:justify-center"
            )}
          >
            {selected ? (
              <div className="p-5 space-y-4">
                {/* Article header */}
                <div>
                  <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">
                    {selected.source}
                    {selected.pubDate && ` · ${relativeTime(selected.pubDate)}`}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                    {selected.title}
                  </h3>
                  {selected.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selected.description}
                    </p>
                  )}
                </div>

                <hr className="border-gray-200 dark:border-white/10" />

                {/* Full article content */}
                {articleParagraphs ? (
                  <div className="space-y-3">
                    {articleParagraphs.map((para, i) => (
                      <p key={i} className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : articleError ? (
                  <p className="text-sm text-amber-600 dark:text-amber-400">{articleError}</p>
                ) : (
                  <button
                    type="button"
                    onClick={loadFullArticle}
                    disabled={articleLoading}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    {articleLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 dark:border-white/20 border-t-gray-600 dark:border-t-white/70" />
                        {t("news.readingFull")}
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        {t("news.readFull")}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-white/30 py-12">
                <Newspaper className="h-8 w-8 opacity-30" />
                <p className="text-sm">{t("news.selectArticle")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
