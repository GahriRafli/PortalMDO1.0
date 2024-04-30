const CardContent = ({ children }) => {
  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {children}
      </dl>
    </div>
  );
};

export { CardContent };
