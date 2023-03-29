import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  const fetchHC = await fetch(`${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/all`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const getHC = await fetchHC.json();
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  if (getHC.status === 200) {
    return {
      props: {
        user: user,
        hc: getHC.data,
      },
    };
  } else if (getHC.status === 202) {
    return {
      props: {
        user: user,
        hc: getHC.data,
      },
    };
  } else {
    return {
      props: {
        user: user,
        hc: null,
      },
    };
  }
});

export default function HCReport({ user, hc }) {
  // begin of define column
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "No.",
  //       Cell: (row) => {
  //         return <div>{Number(row.row.id) + 1}</div>;
  //       },
  //     },
  //     {
  //       Header: "Priority and Source",
  //       accessor: "mapping and source",
  //       Cell: (props) => {
  //         return (
  //           <>
  //             <div style={{ textAlign: "-webkit-center" }} className="w-100">
  //               <PriorityArrow
  //                 value={props.row.original.priorityMatrix.mapping}
  //               />
  //               <SourcePill value={props.row.original.problemSource.label} />
  //             </div>
  //           </>
  //         );
  //       },
  //       disableSortBy: true,
  //     },
  //     {
  //       Header: "Problem Name",
  //       accessor: "problemName",
  //       Cell: (props) => {
  //         return (
  //           <>
  //             <div className="text-sm text-gray-500">
  //               {props.row.original.incidents.length == 0
  //                 ? "Problem Non Incident"
  //                 : props.row.original.multipleIncident == "N"
  //                 ? props.row.original.incidents.map((incident) => {
  //                     return incident.incidentNumber;
  //                   })
  //                 : "Multiple Incident"}{" "}
  //               |
  //               <text className="text-gray-600 hover:text-gray-900">
  //                 {props.row.original.problemNumber != null
  //                   ? ` ${props.row.original.problemNumber}`
  //                   : " -"}
  //               </text>
  //             </div>
  //             <div className="text-base text-gray-900">
  //               <a
  //                 href={`/problem/${props.row.original.id}`}
  //                 className="bg-gray-100 text-gray-900"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 {props.row.original.problemName}
  //               </a>
  //             </div>
  //             <div className="text-xs text-gray-500">
  //               {format(
  //                 new Date(props.row.original.createdAt),
  //                 "d LLLL yyyy HH:mm",
  //                 "id-ID"
  //               )}
  //             </div>
  //           </>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Status",
  //       Cell: (props) => {
  //         return (
  //           <div>
  //             {props.row.original.problemStatus.label ? (
  //               <StatusPill value={props.row.original.problemStatus.label} />
  //             ) : (
  //               "-"
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Application",
  //       Cell: (props) => {
  //         return (
  //           <div className="text-base text-gray-900">
  //             {props.row.original.app.subname}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Detail",
  //       Cell: (props) => {
  //         return (
  //           <>
  //             {/* <form onSubmit={handleSubmit(hitUpdateAssign)}> */}
  //             <div style={{ textAlign: "-webkit-center" }}>
  //               <a
  //                 href={`/problem/${props.row.original.id}`}
  //                 className="bg-gray-100 text-gray-900"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 <EyeIcon
  //                   className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
  //                   aria-hidden="true"
  //                 />
  //               </a>
  //             </div>
  //             {/* </form> */}
  //           </>
  //         );
  //       },
  //     },
  //   ],
  //   []
  // );
  // end of define column

  const styleHead =
    "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";
  const styleData = "px-6 py-3 text-sm text-gray-500 font-normal";

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Health Check Report"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="report-list-section">
            {/* Page title & actions */}
            <PageHeader title="Health Check Report"></PageHeader>

            {/* Recommendation Tables table (small breakpoint and up) */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <table className="table-fixed">
                  <thead>
                    <tr className="border-t border-gray-200">
                      <th className={styleHead}>No</th>
                      <th className={styleHead}>Report Number</th>
                      <th className={styleHead}>Application</th>
                      <th className={styleHead}>Criticality</th>
                      <th className={styleHead}>Function</th>
                      <th className={styleHead}>Maker</th>
                      <th className={styleHead}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {hc.map((data) => {
                      return (
                        <tr key={`hc-data-${data.id}`}>
                          <td className={styleData}>{data.id}</td>
                          <td className={styleData}>
                            {data.healthcheckNumber}
                          </td>
                          <td className={styleData}>{data.app.subName}</td>
                          <td className={styleData}>
                            {data.app.criticalityApp}
                          </td>
                          <td className={styleData}>
                            {data.userGroup.groupName}
                          </td>
                          <td className={styleData}>
                            {data.created_by.fullName}
                          </td>
                          <td className={styleData}>{data.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
