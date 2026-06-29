interface Props {
  viewMode?: 'grid' | 'list';
}

export default function LoadingSkeleton({ viewMode = 'grid' }: Props) {
  if (viewMode === 'list') {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl aspect-[4/5]" />
      ))}
    </div>
  );
}
