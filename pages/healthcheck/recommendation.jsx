import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        user: user,
      },
    };
  }
});

export default function Recommendation({ user }) {
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

  return (
    <>
      <LayoutPage session={user} pageTitle="Recommendation" isShowNotif={false}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="recommendation-list-section">
            {/* Page title & actions */}
            <PageHeader title="Recommendation"></PageHeader>

            {/* Recommendation Tables table (small breakpoint and up) */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <h2>Blah Blah Blah Recommendasi</h2>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
