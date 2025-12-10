const SkeletonCard = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-800 bg-card">
      <div className="h-64 bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-800" />
        <div className="flex space-x-2">
          <div className="h-8 w-full rounded bg-slate-800" />
          <div className="h-8 w-full rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

