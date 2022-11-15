import { SourcePill } from "./ProblemBadge";

const ProblemDetailPanel = ({ problem }) => {
  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Application</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {problem.app.subname ? problem.app.subname : "Not defined yet"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Link JIRA PM</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {problem.problemStatus.label.includes("Agile") ||
            problem.problemStatus.label.includes("OPA") ? (
              `Refer to JIRA Agile/OPA`
            ) : problem.jiraProblem ? (
              <a
                href={problem.jiraProblem}
                target="_blank"
                rel="noopener noreferrer"
                style={{ wordBreak: "break-word" }}
              >
                {problem.jiraProblem}
              </a>
            ) : (
              "Not Defined Yet"
            )}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Urgency</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {problem.urgency.urgency
              ? problem.urgency.urgency
              : "Not defined yet"}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Impact</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {problem.impact.impact ? problem.impact.impact : "Not defined yet"}
          </dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Source</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {problem.problemSource.label ? (
              <SourcePill value={problem.problemSource.label} />
            ) : (
              "Not defined yet"
            )}
          </dd>
        </div>

        {problem.problemStatus.id === 4 &&
        problem.followUp.label.includes("CM") ? (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Link Change Management
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {problem.followupCM ? (
                <a
                  href={problem.followupCM}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: "break-word" }}
                >
                  {problem.followupCM}
                </a>
              ) : (
                "Not Defined Yet"
              )}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
};

export default ProblemDetailPanel;
