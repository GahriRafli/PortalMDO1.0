import { Transition, Dialog } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";

export const ModalMain = ({ children, position }) => {
  switch (position) {
    case "top":
      position = "sm:align-top";
      break;
    case "middle":
      position = "sm:align-middle";
      break;
    default:
      position = "sm:align-middle";
  }

  return (
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      {/* This element is to trick the browser into centering the modal contents. */}
      <span
        className={clsx("hidden sm:inline-block sm:h-screen", position)}
        aria-hidden="true"
      >
        &#8203;
      </span>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        {children}
      </Transition.Child>
    </div>
  );
};
