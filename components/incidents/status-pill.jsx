import { BadgesWithDot } from "../ui/badges";
import { format, addMinutes } from "date-fns";

const StatusPill = ({ value }) => {
  const priority = value ? value.toLowerCase() : "-";

  return priority.startsWith("low") ? (
    <p className="mt-2 flex items-center text-sm text-gray-500">
      <img
        src="/icon-priority/low.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      Low
    </p>
  ) : priority.startsWith("medium") ? (
    <p className="mt-2 flex items-center text-sm text-gray-500">
      <img
        src="/icon-priority/medium.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      Medium
    </p>
  ) : priority.startsWith("high") ? (
    <p className="mt-2 flex items-center text-sm text-gray-500">
      <img
        src="/icon-priority/high.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      High
    </p>
  ) : priority.startsWith("critical") ? (
    <p className="mt-2 flex items-center text-sm text-gray-500">
      <img
        src="/icon-priority/highest.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      Critical
    </p>
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

  function getTargetTime() {
    let targetTime; // RTO
    if (row.original.paramApps.criticalityApp == 'Critical') {
      targetTime = 1 * 60;
    }
    else if (row.original.paramApps.criticalityApp == 'Very High') {
      targetTime = 2 * 60;
    }
    else if (row.original.paramApps.criticalityApp == 'High') {
      targetTime = 3 * 60;
    }
    else if (row.original.paramApps.criticalityApp == 'Medium') {
      targetTime = 18 * 60;
    }
    else if (row.original.paramApps.criticalityApp == 'Low') {
      targetTime = 32 * 60;
    }
    return targetTime;
  }

  function getDeadlineTime() {
    return addMinutes(new Date(row.original.logStartTime), getTargetTime())
  }

  return row.original.idApps ? (
    <div>
      <div className="text-xs text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 capitalize">{criticality}</div>
      <div className="text-xs text-gray-500">RTO: {getTargetTime()} minutes</div>
      {/* <div className="text-xs text-gray-500">{`RTO : ${format(
        getDeadlineTime(),
        "dd MMM yyyy HH:mm",
        "id-ID"
      )}`}</div> */}
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
            : status.startsWith("investigate")
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
      }
      dotColor={
        status.startsWith("open")
          ? "text-red-400"
          : status.startsWith("resolved")
            ? "text-green-400"
            : status.startsWith("investigate")
              ? "text-blue-400"
              : "text-gray-400"
      }
    />
  );
};

export { StatusPill, StatusText, StatusIncident };
