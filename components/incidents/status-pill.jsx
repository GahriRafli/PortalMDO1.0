<<<<<<< HEAD
import { ChevronDownIcon, MenuAlt4Icon, ChevronUpIcon, ChevronDoubleUpIcon } from "@heroicons/react/solid";
import { BadgesWithDot } from "../ui/badges";

const StatusPill = ({ value }) => {
    const priority = value ? value.toLowerCase() : "-";

    return (
        priority.startsWith("low") ?
            <p className="mt-2 flex items-center text-sm text-gray-500">
                <ChevronDownIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-blue-500" />
                Low
            </p> :
            priority.startsWith("medium") ?
                <p className="mt-2 flex items-center text-sm text-gray-500">
                    <MenuAlt4Icon className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-500" />
                    Medium
                </p> :
                priority.startsWith("high") ?
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                        <ChevronUpIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-500" />
                        High
                    </p> :
                    priority.startsWith("critical") ?
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                            <ChevronDoubleUpIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-500" />
                            Critical
                        </p> : '-'

    );
}

const StatusText = ({ value, row }) => {
    const criticality = row.original.idApps ? (row.original.paramApps.criticalityApp ? row.original.paramApps.criticalityApp.toLowerCase() : "-") : "-";

    return (
        row.original.idApps ?
            <div>
                <div className="text-xs text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 capitalize">{criticality}</div>
            </div>
            : criticality
    )
}

const StatusIncident = ({ value }) => {
    const status = value ? value.toLowerCase() : '';

    return (
        <BadgesWithDot
            text={status}
            className={status.startsWith("open") ? "bg-red-100 text-red-800" : status.startsWith("resolved") ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            dotColor={status.startsWith("open") ? "text-red-400" : status.startsWith("resolved") ? "text-green-400" : "text-gray-400"}
        />
    )
}

export { StatusPill, StatusText, StatusIncident };
=======
import {
  ChevronDownIcon,
  MenuAlt4Icon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/solid";
import { Tooltip } from "antd";
import { BadgesWithDot } from "../ui/badges";

const StatusPill = ({ value }) => {
  const priority = value ? value.toLowerCase() : "-";

  return priority.startsWith("low") ? (
    <Tooltip title="Low">
      <ChevronDownIcon className="h-5 w-5 text-blue-500" />
    </Tooltip>
  ) : priority.startsWith("medium") ? (
    <Tooltip title="Medium">
      <MenuAlt4Icon className="h-5 w-5 text-yellow-500" />
    </Tooltip>
  ) : priority.startsWith("high") ? (
    <Tooltip title="High">
      <ChevronUpIcon className="h-5 w-5 text-red-500" />
    </Tooltip>
  ) : priority.startsWith("critical") ? (
    <Tooltip title="Critical">
      <ChevronDoubleUpIcon className="h-5 w-5 text-red-500" />
    </Tooltip>
  ) : (
    "-"
  );
};

const StatusText = ({ value, row }) => {
  const criticality = row.original.idApps
    ? row.original.paramApps.criticalityApp
      ? row.original.paramApps.criticalityApp.toLowerCase()
      : "-"
    : "-";

  return row.original.idApps ? (
    <div>
      <div className="text-xs text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 capitalize">{criticality}</div>
    </div>
  ) : (
    criticality
  );
};

const StatusIncident = ({ value }) => {
  const status = value ? value.toLowerCase() : "";

  return (
    <BadgesWithDot
      text={status}
      className={
        status.startsWith("open")
          ? "bg-red-100 text-red-800"
          : status.startsWith("resolved")
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
      }
      dotColor={
        status.startsWith("open")
          ? "text-red-400"
          : status.startsWith("resolved")
          ? "text-green-400"
          : "text-gray-400"
      }
    />
  );
};

export { StatusPill, StatusText, StatusIncident };
>>>>>>> origin/main
