import clsx from "clsx";
import { classNames } from "../utils";

const Badges = ({ text, bgColor, textColor, variant }) => {
  let size;
  switch (variant) {
    case "basic":
      size = "px-2.5";
      break;
    case "large":
      size = "px-3";
      break;
    default:
      break;
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center py-0.5 rounded-full text-sm font-medium",
        size,
        bgColor,
        textColor
      )}
    >
      {text}
    </span>
  );
};

const BadgesWithDot = ({ text, className, dotColor, ...rest }) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
        className
      )}
      {...rest}
    >
      <svg
        className={classNames("mr-1.5 h-2 w-2", dotColor)}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx={4} cy={4} r={3} />
      </svg>
      {text}
    </span>
  );
};

export { Badges, BadgesWithDot };
