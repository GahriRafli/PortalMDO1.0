import {
  DocumentReportIcon,
  HomeIcon,
  ShieldCheckIcon,
  FireIcon,
  CheckCircleIcon,
  ChatAlt2Icon,
  ViewGridIcon,
} from "@heroicons/react/solid";

export const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ShieldCheckIcon,
    children: [
      {
        name: "Incident List",
        href: "/incidents",
      },
      {
        name: "Incident Matching",
        href: "/incidents/search",
      },
    ],
  },
  {
    name: "Problems",
    icon: FireIcon,
    href: "/problem",
    children: [
      {
        name: "Monitoring",
        href: "/problem/monitoring",
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
        href: "/problem/knownerror",
        permission: "all",
      },
    ],
  },
  {
    name: "Health Check",
    icon: CheckCircleIcon,
    href: "/healthcheck",
    children: [
      {
        name: "Report",
        href: "/healthcheck",
        permission: "all",
      },
      {
        name: "Recommendation",
        href: "/healthcheck/recommendation",
        permission: "all",
      },
    ],
  },
  {
    name: "Tickets",
    icon: ChatAlt2Icon,
    href: "/tickets",
    children: [
      {
        name: "Ticket List",
        href: "/tickets",
        permission: "all",
      },
    ],
  },
  {
    name: "Report",
    icon: DocumentReportIcon,
    href: "/report",
    children: [
      {
        name: "Third Party",
        href: "/report/third-party",
      },
      {
        name: "Incidents",
        href: "/report/incident",
      },
    ],
  },
  {
    name: "SDK Tools",
    icon: ViewGridIcon,
    href: "/tools",
    children: [
      {
        name: "Courtesy",
        href: "/tools/courtesy",
      },
    ],
  },
];
