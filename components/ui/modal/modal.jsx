import { ModalRoot } from "./modal-root";
import { ModalMain } from "./modal-main";
import clsx from "clsx";

export const Modal = ({ children, show, onClose, size, position }) => {
  const defautlSize = "sm:max-w-lg";
  let customSize;

  switch (size) {
    case "medium":
      customSize = "sm:max-w-xl";
      break;
    case "large":
      customSize = "sm:max-w-2xl";
      break;
    case "x-large":
      customSize = "sm:max-w-3xl";
      break;
    default:
      customSize = defautlSize;
  }

  return (
    <ModalRoot show={show} onClose={onClose}>
      <ModalMain position={position}>
        <div
          className={clsx(
            "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full",
            customSize
          )}
        >
          {children}
        </div>
      </ModalMain>
    </ModalRoot>
  );
};
