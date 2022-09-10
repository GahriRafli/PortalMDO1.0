import Link from "next/link";
import { Transition, Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { checkMemberAES } from "./problems/ProblemHelper";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const styledReactSelect = {
  input: (base) => ({
    ...base,
    "input:focus": {
      boxShadow: "none",
    },
  }),

  menu: (base) => ({
    ...base,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  }),
};

const styledReactSelectAdd = {
  input: (base) => ({
    ...base,
    "input:focus": {
      boxShadow: "none",
    },
  }),
  menuList: (styles) => {
    return {
      ...styles,
      maxHeight: 150,
    };
  },
};

function createParam(queryParam) {
  const newParam = JSON.parse('{"' + decodeURI(queryParam).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  return newParam;
}

const DisclosureOpen = ({ item, router, session }) => {
  return (
    <Disclosure as="div" defaultOpen key={item.name} className="space-y-1">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              router.pathname.includes(item.href)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            )}
            aria-current={item.current ? "page" : undefined}
          >
            <item.icon
              className={classNames(
                router.pathname.includes(item.href)
                  ? "text-gray-500"
                  : "text-gray-400 group-hover:text-gray-500",
                "mr-3 flex-shrink-0 h-6 w-6"
              )}
              aria-hidden="true"
            />
            {item.name}
            <ChevronRightIcon
              className={classNames(
                open
                  ? "text-gray-400 rotate-90 transition-transform ease-in-out duration-250"
                  : "text-gray-300 transition-transform ease-in-out duration-250",
                "ml-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-250"
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
              {checkMemberAES(session)
                ? item.children.map((subItem) => (
                    <Link key={subItem.name} href={subItem.href}>
                      <a
                        className={classNames(
                          router.pathname == subItem.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                          "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                        )}
                        aria-current={subItem.current ? "page" : undefined}
                      >
                        {subItem.name}
                      </a>
                    </Link>
                  ))
                : item.children
                    .filter((check) => check.permission == "all")
                    .map((subItem) => {
                      return (
                        <Link key={subItem.name} href={subItem.href}>
                          <a
                            className={classNames(
                              router.pathname == subItem.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                              "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                            )}
                            aria-current={subItem.current ? "page" : undefined}
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
};

const DisclosureDefault = ({ item, router, session }) => {
  return (
    <Disclosure as="div" key={item.name} className="space-y-1">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              router.pathname.includes(item.href)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            )}
            aria-current={item.current ? "page" : undefined}
          >
            <item.icon
              className={classNames(
                router.pathname.includes(item.href)
                  ? "text-gray-500"
                  : "text-gray-400 group-hover:text-gray-500",
                "mr-3 flex-shrink-0 h-6 w-6"
              )}
              aria-hidden="true"
            />
            {item.name}
            <ChevronRightIcon
              className={classNames(
                open
                  ? "text-gray-400 rotate-90 transition-transform ease-in-out duration-250"
                  : "text-gray-300 transition-transform ease-in-out duration-250",
                "ml-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-250"
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
              {checkMemberAES(session)
                ? item.children.map((subItem) => (
                    <Link key={subItem.name} href={subItem.href}>
                      <a
                        className={classNames(
                          router.pathname == subItem.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                          "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                        )}
                        aria-current={subItem.current ? "page" : undefined}
                      >
                        {subItem.name}
                      </a>
                    </Link>
                  ))
                : item.children
                    .filter((check) => check.permission == "all")
                    .map((subItem) => {
                      return (
                        <Link key={subItem.name} href={subItem.href}>
                          <a
                            className={classNames(
                              router.pathname == subItem.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                              "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                            )}
                            aria-current={subItem.current ? "page" : undefined}
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
};

export { classNames, styledReactSelect, styledReactSelectAdd, DisclosureOpen, DisclosureDefault, createParam };
