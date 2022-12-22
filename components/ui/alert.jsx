import {
  InformationCircleIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
import { useState } from "react";

export const CustomAlert = ({
  children,
  className,
  title,
  type,
  dismissButton = false,
  autoClose = false,
}) => {
  const [close, setClose] = useState(false);

  if (autoClose)
    setTimeout(function () {
      setClose(true);
    }, 5000);

  let colour = {
    bg: "",
    icon: "",
    iconBg: "",
    text: "",
    subText: "",
    closeBtn: "",
  };

  switch (type) {
    case "info":
      colour.bg = "bg-blue-50";
      colour.icon = InformationCircleIcon;
      colour.iconBg = "text-blue-400";
      colour.text = "text-blue-700";
      colour.subText = "text-blue-600";
      colour.closeBtn = "text-blue-500";
      break;
    case "danger":
      colour.bg = "bg-red-50";
      colour.icon = XCircleIcon;
      colour.iconBg = "text-red-400";
      colour.text = "text-red-800";
      colour.subText = "text-red-700";
      colour.closeBtn = "text-red-500";
      break;
    default:
      colour.bg = "bg-blue-50";
      colour.icon = InformationCircleIcon;
      colour.iconBg = "text-blue-400";
      colour.text = "text-blue-700";
      colour.subText = "text-blue-600";
      colour.closeBtn = "text-blue-500";
  }

  return (
    <div
      className={clsx(
        "rounded-md p-4",
        colour.bg,
        className,
        close && "hidden"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <colour.icon
            className={clsx("h-5 w-5", colour.iconBg)}
            aria-hidden="true"
          />
        </div>
        {title ? (
          <div className="ml-3">
            <h3 className={clsx("text-sm font-medium", colour.text)}>
              {title}
            </h3>
            <div className={clsx("mt-2 text-sm", colour.subText)}>
              {children}
            </div>
          </div>
        ) : (
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <div className={clsx("text-sm", colour.text)}>{children}</div>
          </div>
        )}
        {dismissButton && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={clsx(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  colour.bg,
                  colour.closeBtn
                )}
                onClick={() => setClose(true)}
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
