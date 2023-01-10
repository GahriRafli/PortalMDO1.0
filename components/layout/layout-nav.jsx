import { Fragment } from "react";
import router from "next/router";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { BellIcon, MenuAlt1Icon } from "@heroicons/react/outline";
import {
  ChevronDownIcon,
  SearchIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import { useLayoutStore } from "lib/layout/layout-store";
import fetchJson from "lib/fetchJson";
import { getNickName } from "components/utils";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export function LayoutNav({ session, isShowNotif }) {
  const setSidebarOpen = useLayoutStore((state) => state.setSidebarOpen);

  async function logout() {
    try {
      const response = await fetchJson("/api/logout");
      if (response.status === 200) {
        router.push("/auth");
      }
    } catch (error) {
      alert(`${error}`);
    }
  }

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
      <button
        className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Search bar */}
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-full lg:mx-auto lg:px-8">
        <div className="flex-1 flex">
          {/* <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div
                className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                aria-hidden="true"
              >
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                name="search-field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </form> */}
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification dropdown */}
          {isShowNotif ? (
            <>
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={clsx(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              You don't have notifications yet
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </>
          ) : (
            ""
          )}

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                    <UserCircleIcon
                      className="w-9 h-9 text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                      <span className="sr-only">Open user menu for </span>
                      {session.fullname
                        ? getNickName(session.fullname)
                        : session.username}
                    </span>
                    <ChevronDownIcon
                      className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) =>
                          item.name.toLowerCase() === "sign out" ? (
                            <a
                              href="#"
                              className={clsx(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() => logout()}
                            >
                              {item.name}
                            </a>
                          ) : (
                            <a
                              className={clsx(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              href={item.href}
                            >
                              {item.name}
                            </a>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
