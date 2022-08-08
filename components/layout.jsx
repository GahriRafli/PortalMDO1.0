import Meta from "components/meta";
import SidebarOverlay from "./sidebar-overlay";
import Sidebar from "./sidebar";
import MobileHeader from "./mobile-header";
import router from "next/router";
import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  HomeIcon,
  DocumentSearchIcon,
  FireIcon,
  ChatAlt2Icon,
  FolderIcon,
} from "@heroicons/react/outline";

const navigation = [
  { key: 1, name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { key: 2, name: "Incidents", href: "/incidents", icon: DocumentSearchIcon },
  {
    key: 3,
    name: "Problems",
    href: "/problem",
    children: [
      {
        name: "Report",
        href: "#",
        permission: "all",
      },
      {
        name: "My Task",
        href: "/problem",
        permission: "member",
      },
      {
        name: "Search",
        href: "/problem/search",
        permission: "all",
      },
      {
        name: "List",
        href: "/problem/list",
        permission: "all",
      },
      {
        name: "Need Assign",
        href: "/problem/assign",
        permission: "all",
      },
      {
        name: "Known Error",
        href: "#",
        permission: "all",
      },
    ],
    icon: FireIcon,
  },
  { key: 4, name: "Tickets", href: "/tickets", icon: ChatAlt2Icon },
  {
    key: 5,
    name: "Report",
    href: "/report",
    children: [
      {
        name: "Third Party",
        href: "/report/third-party",
        permission: "all",
      },
    ],
    icon: FolderIcon,
  },
];

async function logout() {
  try {
    const response = await fetchJson("/api/logout");
    if (response.status === 200) {
      router.push("/auth");
    }
  } catch (error) {
    toast.error(`${error}`);
  }
}

export default function Layout({ children, session }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Meta />
      <div className="relative flex h-screen overflow-hidden bg-gray-100">
        {/* Set sidebar overlay when on mobile screen */}
        <SidebarOverlay
          navigation={navigation}
          router={router}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Static sidebar for desktop */}
        <Sidebar
          navigation={navigation}
          router={router}
          session={session}
          action={logout}
        />
        {/* Main column */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Mobile header */}
          <MobileHeader setSidebarOpen={setSidebarOpen} action={logout} />
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
