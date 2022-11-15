import clsx from "clsx";

export const SectionCard = ({ className, children, ...rest }) => {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-300 -mx-4 sm:-mx-6 md:mx-0 md:rounded-md p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

SectionCard.displayName = "SectionCard";
