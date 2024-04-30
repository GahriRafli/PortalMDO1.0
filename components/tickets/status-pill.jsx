import { Badges, BadgesWithDot } from "../ui/badges";

const StatusPill = ({ value }) => {
  const priority = value ? value.toLowerCase() : "-";

  return priority.startsWith("low") ? (
    <p className="flex items-center mt-2 text-sm text-gray-500">
      <img
        src="/icon-priority/low.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      Low
    </p>
  ) : priority.startsWith("medium") ? (
    <p className="flex items-center mt-2 text-sm text-gray-500">
      <img
        src="/icon-priority/medium.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      Medium
    </p>
  ) : priority.startsWith("high") ? (
    <p className="flex items-center mt-2 text-sm text-gray-500">
      <img
        src="/icon-priority/high.svg"
        alt=""
        className="flex-shrink-0 mr-1.5 h-5 w-5"
      />
      High
    </p>
  ) : priority.startsWith("critical") ? (
    <p className="flex items-center mt-2 text-sm text-gray-500">
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
    ? row.original.paramTicketApps.criticalityApp
      ? row.original.paramTicketApps.criticalityApp.toLowerCase()
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

const StatusTicket = ({ value }) => {
  const status = value ? value.toLowerCase() : "";

  if (status === "open") {
    return (
      <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
        Open
      </span>
    );
  } else {
    return (
      <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Close
      </span>
    );
  }
};

export { StatusPill, StatusText, StatusTicket };
