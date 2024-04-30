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
  ShieldCheckIcon,
  ClipboardCheckIcon,
  DocumentSearchIcon,
  DocumentReportIcon,
  FireIcon,
  ChatAlt2Icon,
  ViewGridIcon,
  FolderIcon,
} from "@heroicons/react/outline";

const navigation = [
  { key: 1, name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    key: 2,
    name: "ESB",
    href: "/",
    children: [
      {
        name: "Cache",
        href: "/ESB/cache",
        // permission: "all",
      },
      {
        name: "Service",
        href: "/ESB/service",
        // permission: "member",
      },
    ],
    icon: ShieldCheckIcon,
  },
  {
    key: 3,
    name: "BI-Fast",
    href: "/",
    children: [
      {
        name: "Alert",
        href: "/bi-fast/alert",
        // permission: "all",
      },
    ],
    icon: FireIcon,
  },
  {
    key: 4,
    name: "Audit Trail",
    href: "/",
    children: [
      {
        name: "Audit-Log",
        href: "/audit-log/audit-trail",
        // permission: "all",
      },
    ],
    icon: ClipboardCheckIcon,
  },
  {
    key: 5,
    name: "Proswitching",
    href: "/",
    children: [
      {
        name: "Connection",
        href: "/Proswitching/koneksi",
        // permission: "all",
      },
    ],
    icon: ChatAlt2Icon,
  },
  {
    key: 6,
    name: "Other",
    href: "/",
    children: [
      {
        name: "Hourly Report MDO",
        href: "/other/hourly",
        // permission: "all",
      },
    ],
    icon: DocumentReportIcon,
  },
  {
    key: 7,
    name: "User Management",
    href: "/usermanagement",
    icon: ViewGridIcon,
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
