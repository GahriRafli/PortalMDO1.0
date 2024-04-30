const PageHeader = ({ title, children }) => {
  return (
    <>
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="inline-block py-1 text-3xl font-bold text-gray-500 sm:truncate">
            {title}
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0 sm:ml-4">{children}</div>
      </div>
    </>
  );
};

export default PageHeader;
