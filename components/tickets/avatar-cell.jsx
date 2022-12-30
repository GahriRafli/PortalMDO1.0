import { UserCircleIcon } from "@heroicons/react/solid";
import { formatDistance, formatDistanceToNowStrict } from "date-fns";

function AvatarCell({ value, row }) {
    const createdAt = row.original.createdAt ? new Date(row.original.createdAt) : '';

    return (
        <div className="flex items-center">
            <div className="flex-shrink-0 h-7 w-7">
                {/* <img
            className="h-10 w-10 rounded-full"
            src={row.original[column.imgAccessor]}
            alt=""
          /> */}
                <UserCircleIcon className="h-7 w-7" />
            </div>
            <div className="ml-2">
                <div className="text-xs text-gray-900">{value ? value : row.original.paramTicketCreatedBy.fullname}</div>
                <div className="text-xs text-gray-500">{formatDistanceToNowStrict(createdAt)} ago</div>
            </div>
        </div>
    );
}

export default AvatarCell;