import clsx from "clsx";
import React from "react";

export const SecondaryButton = React.forwardRef(
  ({ onClick, children, className, type, color, ...rest }, ref) => {
    return (
      <button
        type={type}
        onClick={onClick}
        ref={ref}
        className={clsx(
          "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "text-blue-700 bg-blue-100 hover:bg-blue-200 border-transparent",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
