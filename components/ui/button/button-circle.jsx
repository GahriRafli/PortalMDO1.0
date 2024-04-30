import { classNames } from "../../utils";

const ButtonCircle = ({ action, className, children, ...rest }) => {
  return (
    <button
      type="button"
      onClick={action}
      className={classNames(
        "inline-flex items-center p-1 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export { ButtonCircle };
