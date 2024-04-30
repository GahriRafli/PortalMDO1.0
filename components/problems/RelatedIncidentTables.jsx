import Link from "next/link";
import format from "date-fns/format";

const RelatedIncidentTables = ({ problem }) => {
  return problem.incidents.length > 0 ? (
    <>
      <h1 className="text-2xl font-bold text-gray-400">Related Incident</h1>
      <section aria-labelledby="incident-table">
        <div className="bg-white shadow sm:rounded-lg">
          <table className="min-w-full" role="table">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  Number
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  Incident Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  Root Cause
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  Reported at
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {problem.incidents.map((incident) => (
                <>
                  <tr key={`${incident.incidentNumber}`}>
                    <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                      <Link href={`/incidents/${incident.id}`} passHref>
                        <a
                          className="text-blue-500 hover:text-blue-900"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {incident.incidentNumber}
                        </a>
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                      {incident.incidentName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                      {incident.rootCause ? incident.rootCause : null}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                      {format(
                        new Date(incident.createdAt),
                        "d LLLL yyyy HH:mm",
                        "id-ID"
                      )}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  ) : null;
};

export default RelatedIncidentTables;
