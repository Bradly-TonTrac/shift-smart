const Loading = () => {
  return (
    <div className="max-w-5xl mx-auto px-10 mt-20">
      <div className="bg-gray-100 rounded-2xl h-10 w-48 animate-pulse mb-6" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-16 animate-pulse" />
        ))}
      </div>
    </div>
  );
};
export default Loading;
