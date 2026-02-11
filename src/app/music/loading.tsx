export default function MusicLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
        aria-hidden
      />
    </div>
  );
}
