import clsx from "clsx";

export const LayoutRoot = ({ children, className, ...rest }) => {
  return (
    <div
      className={clsx(
        "relative",
        "h-screen flex overflow-hidden bg-gray-100",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

LayoutRoot.displayName = "LayoutRoot";
