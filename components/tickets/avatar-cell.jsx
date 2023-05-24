import { UserCircleIcon } from "@heroicons/react/solid";
import { formatDistanceToNowStrict } from "date-fns";

function AvatarCell({ value, row }) {
  const createdAt = row.original.createdAt
    ? new Date(row.original.createdAt)
    : "";

  if (row.original.paramTicketOwner) {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-7 w-7">
          <img
            className="h-6 w-6 rounded-full"
            loading="lazy"
            src={row.original.paramTicketOwner.photo}
            alt="Profile Picture"
          />
        </div>
        <div className="ml-2">
          <div className="text-xs text-gray-900">
            {value ? value : row.original.paramTicketOwner.fullname}
          </div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNowStrict(createdAt)} ago
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-7 w-7">
          <UserCircleIcon className="h-7 w-7" />
        </div>
        <div className="ml-2">
          <div className="text-xs text-gray-900">No Owner</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNowStrict(createdAt)} ago
          </div>
        </div>
      </div>
    );
  }
}

export default AvatarCell;
