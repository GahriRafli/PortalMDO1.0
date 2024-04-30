import {
  UserCircleIcon as UserCircleIconSolid,
  LockOpenIcon,
  LockClosedIcon,
  CalendarIcon,
  ChatAltIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { getCriticalityIcon } from "components/utils";
import { format } from "date-fns";

export const TicketRightSection = ({
  children,
  ticketStatus,
  totalReply = 0,
  createdAt = new Date(),
  escalatedRole,
  ticketOwner,
  ticketOwnerPhoto,
  priority,
  ticketType = null,
  apps = null,
  ...rest
}) => {
  return (
    <div>
      <h2 className="sr-only">Details</h2>
      <div className="space-y-5">
        <div className="flex items-center space-x-2">
          {ticketStatus == "Open" ? (
            <>
              <LockOpenIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
              <span className="text-red-700 text-sm font-medium">
                {ticketStatus} Issue
              </span>
            </>
          ) : (
            <>
              <LockClosedIcon
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
              <span className="text-green-700 text-sm font-medium">
                {ticketStatus} Issue
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className="text-gray-900 text-sm font-medium">
            {totalReply} reply
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className="text-gray-900 text-sm font-medium">
            Created on{" "}
            <time>{format(new Date(createdAt), "dd MMM yyyy, HH:mm")}</time>
          </span>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
        {/* Ticket owner Start */}
        <div>
          <h2 className="text-sm font-medium text-gray-500">Ticket Owner</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex justify-start">
              <a href="#" className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {ticketOwnerPhoto && (
                    <img
                      className="h-5 w-5 rounded-full"
                      src={ticketOwnerPhoto}
                      alt=""
                    />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {ticketOwner ? ticketOwner : "No Owner"}
                </div>
              </a>
            </li>
          </ul>
        </div>
        {/* Ticket owner End */}

        {/* Assignees Section Start*/}
        <div>
          <h2 className="text-sm font-medium text-gray-500">Assignees</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex justify-start">
              <a href="#" className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {escalatedRole}
                </div>
              </a>
            </li>
          </ul>
        </div>
        {/* Assignees Section End */}

        {/* Priority Section Start*/}
        <div>
          <h2 className="text-sm font-medium text-gray-500">Priority</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex justify-start">
              <a href="#" className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {priority && (
                    <img
                      src={getCriticalityIcon(priority.toLowerCase())}
                      className="h-5 w-5"
                    />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {priority ? priority : "None"}
                </div>
              </a>
            </li>
          </ul>
        </div>
        {/* Priority Section End */}

        <div>
          <h2 className="text-sm font-medium text-gray-500">Category</h2>
          <ul className="mt-2 leading-8">
            <li className="inline">
              <a
                href="#"
                className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
              >
                <div className="absolute flex-shrink-0 flex items-center justify-center">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-rose-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3.5 text-sm font-medium text-gray-900">
                  {ticketType ? ticketType : "None"}
                </div>
              </a>{" "}
            </li>
            {apps && (
              <li className="inline">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                >
                  <div className="absolute flex-shrink-0 flex items-center justify-center">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                    {apps}
                  </div>
                </a>{" "}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

TicketRightSection.displayName = "TicketRightSection";
