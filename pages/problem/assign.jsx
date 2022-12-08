import Head from "next/head";
import Image from "next/image";
import PageHeader from "../../components/problems/ProblemHeader";
import ProblemTables from "components/problems/ProblemTables";
import { EyeIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import format from "date-fns/format";
import {
  PriorityArrow,
  SourcePill,
} from "../../components/problems/ProblemBadge";
import { StatusPill } from "components/problems/ProblemBadge";
import withSession from "../../lib/session";
import { LayoutRoot } from "components/layout/layout-root";
import { CustomToaster } from "components/ui/notifications/custom-toast";
import { LayoutSidebar } from "components/layout/layout-sidebar";
import { LayoutNav } from "components/layout/layout-nav";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const assignProblem = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/needAssign`
  );
  const getAssign = await assignProblem.json();

  if (assignProblem.status === 200) {
    return {
      props: {
        user: user,
        assign: getAssign.data,
      },
    };
  } else {
    return {
      props: {
        user: user,
        assign: null,
      },
    };
  }
});

export default function AssignList({ user, assign }) {
  const { formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  // begin of define column
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        Cell: (row) => {
          return <div>{Number(row.row.id) + 1}</div>;
        },
      },
      {
        Header: "Priority and Source",
        accessor: "mapping and source",
        Cell: (props) => {
          return (
            <>
              <div style={{ textAlign: "-webkit-center" }} className="w-100">
                <PriorityArrow
                  value={props.row.original.priorityMatrix.mapping}
                />
                <SourcePill value={props.row.original.problemSource.label} />
              </div>
            </>
          );
        },
        disableSortBy: true,
      },
      {
        Header: "Problem Name",
        accessor: "problemName",
        Cell: (props) => {
          return (
            <>
              <div className="text-sm text-gray-500">
                {props.row.original.incidents.length == 0
                  ? "Problem Non Incident"
                  : props.row.original.multipleIncident == "N"
                  ? props.row.original.incidents.map((incident) => {
                      return incident.incidentNumber;
                    })
                  : "Multiple Incident"}{" "}
                |
                <text className="text-gray-600 hover:text-gray-900">
                  {props.row.original.problemNumber != null
                    ? ` ${props.row.original.problemNumber}`
                    : " -"}
                </text>
              </div>
              <div className="text-base text-gray-900">
                <a
                  href={`/problem/${props.row.original.id}`}
                  className="bg-gray-100 text-gray-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.row.original.problemName}
                </a>
              </div>
              <div className="text-xs text-gray-500">
                {format(
                  new Date(props.row.original.createdAt),
                  "d LLLL yyyy HH:mm",
                  "id-ID"
                )}
              </div>
            </>
          );
        },
      },
      {
        Header: "Status",
        Cell: (props) => {
          return (
            <div>
              {props.row.original.problemStatus.label ? (
                <StatusPill value={props.row.original.problemStatus.label} />
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        Header: "Application",
        Cell: (props) => {
          return (
            <div className="text-base text-gray-900">
              {props.row.original.app.subname}
            </div>
          );
        },
      },
      {
        Header: "Detail",
        Cell: (props) => {
          return (
            <>
              {/* <form onSubmit={handleSubmit(hitUpdateAssign)}> */}
              <div style={{ textAlign: "-webkit-center" }}>
                <a
                  href={`/problem/${props.row.original.id}`}
                  className="bg-gray-100 text-gray-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
              {/* </form> */}
            </>
          );
        },
      },
    ],
    []
  );
  // end of define column

  return (
    <>
      <LayoutRoot>
        <Head>
          <title>Need Assign List</title>
          <meta
            name="description"
            content="Shield is incident and problem management application developed by SDK and AES Team APP Division. Inspired by SHIELD on the MCU which taking care of every single problem."
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="robots" content="noindex,nofollow" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <CustomToaster />
        <LayoutSidebar session={user} />
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <LayoutNav session={user} searchNotif={false} />
          <section id="problem-list-section">
            {/* Page title & actions */}
            <PageHeader title="Need Assign List"></PageHeader>

            {/* Problem Tables table (small breakpoint and up) */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                {assign ? (
                  <ProblemTables columns={columns} data={assign} />
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        width={400}
                        height={400}
                        src="/search-engines-rafiki.svg"
                        alt="Workstation"
                      />
                    </div>
                    <div className="mt-4 mb-3 max-w-3xl mx-auto text-center">
                      Seems Like Problem is Empty, nothing to be Assigned
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </LayoutRoot>
    </>
  );
}
