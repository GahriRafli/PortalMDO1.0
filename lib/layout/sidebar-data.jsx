import {
  DocumentReportIcon,
  HomeIcon,
  ShieldCheckIcon,
  FireIcon,
  ClipboardCheckIcon,
  ChatAlt2Icon,
  ViewGridIcon,
} from "@heroicons/react/solid";

export const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "ESB",
    href: "#",
    icon: ShieldCheckIcon,
    children: [
      {
        name: "Cache",
        href: "#",
      },
      {
        name: "Service",
        href: "/ESB/service",
      },
    ],
  },
  {
    name: "BI-Fast",
    icon: FireIcon,
    href: "#",
    children: [
      {
        name: "Alert",
        href: "#",
        // permission: "all",
      },
    ],
  },
  {
    name: "Audit Trail",
    icon: ClipboardCheckIcon,
    href: "#",
    children: [
      {
        name: "Audit Log",
        href: "#",
        // permission: "all",
      },
    ],
  },
  {
    name: "Proswitching",
    icon: ChatAlt2Icon,
    href: "#",
    children: [
      {
        name: "Connection",
        href: "#",
        // permission: "all",
      },
    ],
  },
  {
    name: "Other",
    icon: DocumentReportIcon,
    href: "#",
    children: [
      {
        name: "Hourly Report MDO",
        href: "#",
      },
    ],
  },
  {
    name: "User Management",
    icon: ViewGridIcon,
    href: "/usermanagement",
  },
];
