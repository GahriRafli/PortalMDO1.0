import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

export const ModalRoot = ({ children, show, onClose }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        // initialFocus={cancelButtonRef}
        open={show}
        onClose={onClose}
      >
        {children}
      </Dialog>
    </Transition.Root>
  );
};
