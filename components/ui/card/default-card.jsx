import clsx from "clsx";

export const DefaultCard = ({
  className,
  children,
  title,
  subtitle,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        className,
        "mb-5 bg-white shadow overflow-hidden sm:rounded-lg"
      )}
    >
      {/* Card header start */}
      {title && (
        <div className="flex justify-between items-baseline flex-wrap sm:flex-nowrap">
          <div className="px-1 py-2 sm:px-6 sm:flex-1">
            <h2
              id="card-title"
              className="text-base leading-6 font-medium text-gray-900"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="max-w-2xl text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {/* Card header end */}
      <div
        className={clsx(
          title && "border-t border-gray-200",
          "px-4 py-5 sm:px-6"
        )}
      >
        {children}
      </div>
    </div>
  );
};

DefaultCard.displayName = "DefaultCard";
