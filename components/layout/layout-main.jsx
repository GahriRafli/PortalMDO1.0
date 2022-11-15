import clsx from "clsx";

export const LayoutMain = ({ className, children, ...rest }) => {
  return (
    // old : flex-1 relative pb-8 z-0 overflow-y-auto
    <main
      className={clsx(
        "relative z-0 flex-1 overflow-y-auto focus:outline-none",
        className
      )}
      {...rest}
    >
      <div>{children}</div>
    </main>
  );
};

LayoutMain.displayName = "LayoutContent";
