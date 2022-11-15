import {
  DocumentReportIcon,
  HomeIcon,
  ScaleIcon,
  ShieldCheckIcon,
  FireIcon,
  ChatAlt2Icon,
  ViewGridIcon,
} from "@heroicons/react/solid";

export const navigation = [
  { name: "Home", href: "#", icon: HomeIcon },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ShieldCheckIcon,
  },
  {
    name: "Problems",
    icon: FireIcon,
    children: [
      {
        name: "Report",
        href: "/problem/report",
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
      {
        name: "Ticket Report",
        href: "/tickets/dashboard",
        permission: "member",
      },
    ],
  },
  {
    name: "Report",
    icon: DocumentReportIcon,
    children: [
      {
        name: "Third Party",
        href: "/report/third-party",
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
      {
        name: "IB Data",
        href: "#",
      },
    ],
  },
];

export const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];

export const transactions = [
  {
    id: 1,
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  },
  // More transactions...
];

export const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};
