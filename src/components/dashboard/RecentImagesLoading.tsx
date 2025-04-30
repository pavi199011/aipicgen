
const RecentImagesLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array(4).fill(null).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden animate-pulse bg-white dark:bg-gray-800 shadow-sm">
          <div className="bg-gray-200 dark:bg-gray-700 w-full h-48 rounded-t-xl" />
          <div className="p-4">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentImagesLoading;
