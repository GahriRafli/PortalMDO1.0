const ProblemInfoPanel = ({ problem }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-gray-900">Problem Detail</h2>
      <ul className="mt-2 leading-8">
        <li className="inline">
          <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
            <div className="absolute flex-shrink-0 flex items-center justify-center">
              <span
                className="h-1.5 w-1.5 rounded-full bg-rose-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3.5 text-sm font-medium text-gray-900">
              Problem Priority : {problem.priorityMatrix.mapping}
            </div>
          </div>{" "}
        </li>
        <li className="inline">
          <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
            <div className="absolute flex-shrink-0 flex items-center justify-center">
              <span
                className="h-1.5 w-1.5 rounded-full bg-yellow-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3.5 text-sm font-medium text-gray-900">
              Problem Type : {problem.paramType.type}
            </div>
          </div>{" "}
        </li>
        <li className="inline">
          <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
            <div className="absolute flex-shrink-0 flex items-center justify-center">
              <span
                className="h-1.5 w-1.5 rounded-full bg-gray-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3.5 text-sm font-medium text-gray-900">
              Follow Up : {problem.followUp ? problem.followUp.label : null}
            </div>
          </div>{" "}
        </li>
      </ul>
    </div>
  );
};

export default ProblemInfoPanel;
