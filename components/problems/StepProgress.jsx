const StepProgress = ({ problem }) => {
  let steps = [];
  if (problem.problemStatus.id) {
    for (let loop = 1; loop <= 4; loop++) {
      if (loop < problem.problemStatus.id) {
        steps.push({ name: `Step ${loop}`, status: "complete" });
      } else if (loop == problem.problemStatus.id) {
        steps.push({ name: `Step ${loop}`, status: "current" });
      } else if (loop > problem.problemStatus.id) {
        steps.push({ name: `Step ${loop}`, status: "upcoming" });
      } else {
      }
    }
  }

  return (
    <ol className="ml-8 flex items-center space-x-5">
      {steps.map((step) => (
        <li key={step.name}>
          {step.status === "complete" ? (
            <div className="block w-2.5 h-2.5 bg-indigo-600 rounded-full hover:bg-indigo-900">
              <span className="sr-only">{step.name}</span>
            </div>
          ) : step.status === "current" ? (
            <div
              className="relative flex items-center justify-center"
              aria-current="step"
            >
              <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                <span className="w-full h-full rounded-full bg-indigo-200" />
              </span>
              <span
                className="relative block w-2.5 h-2.5 bg-indigo-600 rounded-full"
                aria-hidden="true"
              />
              <span className="sr-only">{step.name}</span>
            </div>
          ) : (
            <div className="block w-2.5 h-2.5 bg-gray-200 rounded-full">
              <span className="sr-only">{step.name}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
};

export default StepProgress;
