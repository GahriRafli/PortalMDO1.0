import clsx from "clsx";
import { Container } from "components/ui/container";

const PageHeader = ({ className, children, title, ...rest }) => {
  return (
    <>
      {title ? (
        <div className="px-4 py-4 sm:px-6 md:px-8 sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 pt-5">
              {title}
            </h1>
          </div>
          <div className="flex space-x-3 sm:mt-0 sm:ml-4">{children}</div>
        </div>
      ) : (
        <div className="px-4 py-4 sm:px-6 md:px-8 sm:flex sm:items-center sm:justify-between">
          {children}
        </div>
      )}
    </>
  );
};

export default PageHeader;
