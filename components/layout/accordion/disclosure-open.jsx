import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import clsx from "clsx";

export function DisclosureOpen({ item, router }) {
  return (
    <Disclosure
      as="div"
      key={item.name.concat(Math.random())}
      className="space-y-1"
      defaultOpen
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="text-gray-300 hover:bg-gray-700 hover:text-white roup w-full flex items-center pl-2 pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <item.icon
              className="mr-4 flex-shrink-0 h-6 w-6 text-gray-200"
              aria-hidden="true"
            />
            <span className="flex-1">{item.name}</span>
            <ChevronDownIcon
              className={clsx(
                open ? "-rotate-180" : "rotate-0",
                "h-5 w-5 transform"
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="space-y-1">
              {item.children.map((subItem) => {
                const isSubmenuActive = router.pathname === subItem.href;

                return (
                  <Link
                    key={subItem.name.concat(Math.random())}
                    href={subItem.href}
                  >
                    <a
                      className={clsx(
                        isSubmenuActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex items-center pl-12 px-2 py-2 text-sm leading-6 font-medium rounded-md"
                      )}
                    >
                      {subItem.name}
                    </a>
                  </Link>
                );
              })}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
