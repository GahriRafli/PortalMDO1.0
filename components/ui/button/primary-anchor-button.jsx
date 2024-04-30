import React from "react";
import { classNames } from "../../utils";

export const PrimaryAnchorButton = React.forwardRef(
  ({ onClick, href, children, className, ...rest }, ref) => {
    return (
      <a
        href={href}
        onClick={onClick}
        ref={ref}
        className={classNames(
          "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          className
        )}
        {...rest}
      >
        {children}
      </a>
    );
  }
);
