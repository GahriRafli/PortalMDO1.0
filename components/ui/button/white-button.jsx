import clsx from "clsx";
import React from "react";

export const WhiteButton = React.forwardRef(
  ({ onClick, children, className, type, ...rest }, ref) => {
    return (
      <button
        type={type}
        onClick={onClick}
        ref={ref}
        className={clsx(
          "inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
