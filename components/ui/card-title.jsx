const CardTitle = ({ title, subtitle, children }) => {
  return (
    <div className="flex justify-between items-baseline flex-wrap sm:flex-nowrap">
      <div className="px-4 py-5 sm:px-6 sm:flex-1">
        <h2
          id="card-title"
          className="text-lg leading-6 font-medium text-gray-900"
        >
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-red-700">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export { CardTitle };
