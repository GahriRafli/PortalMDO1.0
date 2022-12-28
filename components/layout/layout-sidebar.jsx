import { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { navigation } from "lib/layout/sidebar-data";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import { useLayoutStore } from "lib/layout/layout-store";
import { DisclosureOpen, DisclosureDefault } from "./accordion/index";

export function LayoutSidebar({ session }) {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useLayoutStore((state) => state);
  const initialFocusItem = useRef(null);

  useEffect(() => {
    const handleBeforeHistoryChange = () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    router.events.on("beforeHistoryChange", handleBeforeHistoryChange);

    return () => {
      router.events.off("beforeHistoryChange", handleBeforeHistoryChange);
    };
  }, [router.events, sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile version sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
          initialFocus={initialFocusItem}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-12 w-auto"
                  src="/shield-logo-white.png"
                  alt="Shield logo"
                />
              </div>
              <nav
                className="mt-5 flex-shrink-0 h-full divide-y divide-gray-900 overflow-y-auto"
                aria-label="Sidebar"
              >
                {/* isi konten sidebar mobile */}
              </nav>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* =================== Static sidebar for desktop =================== */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="h-12 w-auto"
                src="/shield-logo-new-circle.png"
                alt="Shield logo"
              />
            </div>
            <nav
              className="mt-5 flex-1 flex flex-col divide-y divide-cyan-800 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = router.pathname === item.href;

                  if (!item.children)
                    return (
                      <Link key={item.name} href={item.href}>
                        <a
                          className={clsx(
                            isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon
                            className="mr-4 flex-shrink-0 h-6 w-6 text-gray-500"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    );
                  // Bukan best practice, suatu saat mungkin ada bug 10-2022
                  else
                    return router.pathname.includes(item.href) ? (
                      <DisclosureOpen
                        item={item}
                        router={router}
                        key={Math.random()}
                      />
                    ) : (
                      <DisclosureDefault item={item} key={Math.random()} />
                    );
                })}
              </div>
            </nav>
          </div>
          {/* Sidebar Profile Start */}
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <a href="#" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon
                    className="w-9 h-9 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {" "}
                    {session.fullname
                      ? session.fullname.split(" ").slice(0, -1).join(" ")
                      : session.username}
                  </p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    {session.username}
                  </p>
                </div>
              </div>
            </a>
          </div>
          {/* Sidebar Profile End */}
        </div>
      </div>
    </>
  );
}
