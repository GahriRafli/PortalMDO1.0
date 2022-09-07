const RootCauseCard = ({ rootcause }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-400">Known Error</h1>
      <section aria-labelledby="final-rootcause">
        <div className="bg-white shadow sm:rounded-lg">
          {/* Inside Card */}
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 text-justify">
                {rootcause.description
                  ? rootcause.description
                  : "Not defined yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Impacted System</dt>
              <dd className="mt-1 text-sm text-gray-900 text-justify">
                {rootcause.impactSystem
                  ? rootcause.impactSystem
                  : "Not defined yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Root Cause Analysis</dt>
              <dd className="mt-1 text-sm text-gray-900 text-justify">
                {rootcause.rca
                  ? rootcause.rca
                  : "Not defined yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Resolution</dt>
              <dd className="mt-1 text-sm text-gray-900 text-justify">
                {rootcause.resolution
                  ? rootcause.resolution
                  : "Not defined yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Lesson Learned</dt>
              <dd className="mt-1 text-sm text-gray-900 text-justify">
                {rootcause.lessonLearned
                  ? rootcause.lessonLearned
                  : "Not defined yet"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
};

export default RootCauseCard;
