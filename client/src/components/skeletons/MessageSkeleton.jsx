const MessageSkeleton = () => {
  // Create 6 skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="flex items-start gap-2 max-w-[80%]">
            {idx % 2 === 0 && <div className="size-10 rounded-full bg-slate-800 animate-pulse" />}
            <div className="space-y-2">
              <div className={`h-[60px] w-[200px] sm:w-[300px] bg-slate-800 rounded-2xl animate-pulse ${idx % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"}`} />
              <div className={`h-3 w-16 bg-slate-800 rounded animate-pulse ${idx % 2 === 0 ? "ml-1" : "ml-auto mr-1"}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
