import clsx from "clsx";

export const Container = ({ children, className, ...rest }) => {
  return (
    <div className={clsx("w-full max-w-full mx-auto", className)} {...rest}>
      {children}
    </div>
  );
};

Container.displayName = "Container";
