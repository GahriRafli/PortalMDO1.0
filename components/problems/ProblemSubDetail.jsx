import format from "date-fns/format";
import { StatusPill } from "components/problems/ProblemBadge";
import { CalendarIcon } from "@heroicons/react/solid";

const ProblemSubDetail = ({ problem }) => {
  return (
    <>
      <dt className="my-1 text-sm font-medium text-gray-500">
        Criticality Application : {problem.app.criticalityApp}
      </dt>
      <dt className="my-1 text-sm font-medium text-gray-500">
        Status :{" "}
        {problem.problemStatus.label ? (
          <StatusPill value={problem.problemStatus.label} />
        ) : (
          "Not defined yet"
        )}
      </dt>
      {problem.problemStatus.id === 4 ? (
        <dt className="my-1 text-sm font-medium text-gray-500 flex items-center space-x-2">
          <CalendarIcon
            className="h-5 w-5 text-emerald-600"
            aria-hidden="true"
          />
          <span>
            Solved on{" "}
            <time
              dateTime={format(
                new Date(problem.updatedAt),
                "d LLLL yyyy HH:mm",
                "id-ID"
              )}
            >
              {` ${format(
                new Date(problem.updatedAt),
                "d LLLL yyyy HH:mm",
                "id-ID"
              )}`}
            </time>
          </span>
        </dt>
      ) : null}
    </>
  );
};

export default ProblemSubDetail;
