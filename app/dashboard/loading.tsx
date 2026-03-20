const Loading = () => {
  return (
    <div className="flex justify-center mt-32">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl px-8 py-6 w-48 h-32 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
export default Loading;
