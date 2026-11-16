function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/9] bg-stone-200 dark:bg-stone-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-full" />
        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
      </div>
    </div>
  );
}

export default SkeletonCard;
