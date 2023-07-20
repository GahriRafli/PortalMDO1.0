import Link from "next/link";
import { useMemo } from "react";
import PageHeader from "../../components/problems/ProblemHeader";
import format from "date-fns/format";
import ProblemTables from "components/problems/ProblemTables";
import {
  PriorityArrow,
  SourcePill,
  StatusPill,
} from "components/problems/ProblemBadge";
import withSession from "../../lib/session";
import { PlusSmIcon, BanIcon, EyeIcon } from "@heroicons/react/outline";
import { PrimaryAnchorButton } from "components/ui/button/primary-anchor-button";
import * as ProblemHelper from "components/problems/ProblemHelper";
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
    // ini nanti di cocokin sama DB
  } else if (!ProblemHelper.checkMemberAES(user)) {
    return {
      redirect: {
        destination: "/problem/list",
        permanent: false,
      },
    };
  }
  const getTask = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/task/get?userSession=${user.id}`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const taskData = await getTask.json();

  if (taskData.status === 200) {
    return {
      props: {
        user: user,
        data: taskData.data,
      },
    };
  } else if (taskData.status === 202) {
    return {
      props: {
        user: user,
        data: taskData.data,
      },
    };
  } else {
    return {
      props: {
        user: user,
        data: null,
      },
    };
  }
});

export default function TaskList({ user, data }) {
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
              <div style={{ textAlign: "-webkit-center" }}>
                <PriorityArrow
                  value={props.row.original.priorityMatrix.mapping}
                />
                <SourcePill
                  value={
                    props.row.original.problemSource.label.startsWith("Nota")
                      ? props.row.original.problemSource.label.slice(13)
                      : props.row.original.problemSource.label
                  }
                />
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
                <span className="text-gray-600 hover:text-gray-900">
                  {` ${props.row.original.problemNumber}`}
                </span>
              </div>
              <div className="text-base text-gray-900 font-medium">
                <a
                  href={`/problem/${props.row.original.id}`}
                  className="text-gray-900"
                  target="_self"
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
        accessor: "problemStatus.label",
        Cell: (props) => {
          return (
            <div>
              <StatusPill value={props.row.original.problemStatus.label} />
              <br />
              {props.row.original.jiraProblem !== null ? (
                props.row.original.jiraProblem !== "" ? (
                  <a
                    href={props.row.original.jiraProblem}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="px-2 text-xs font-semibold rounded-full bg-blue-500 text-white">
                      JIRA
                    </span>
                  </a>
                ) : null
              ) : null}
            </div>
          );
        },
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.userName",
        Cell: (props) => {
          return (
            <div className="text-sm text-gray-900">
              {props.row.original.assigned_to ? (
                props.row.original.assigned_to.fullName
              ) : (
                <>
                  <div className="inline-flex">
                    Not Yet Assigned
                    <BanIcon className="pl-1 h-5 w-5" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          );
        },
      },
      {
        Header: "Follow Up Plan",
        Cell: (props) => {
          return (
            <>
              <div className="text-sm">
                {props.row.original.followUp
                  ? props.row.original.followUp.label
                  : "-"}
              </div>
              <div>
                {props.row.original.followupCM !== null ? (
                  props.row.original.followupCM !== "" ? (
                    <a
                      href={props.row.original.followupCM}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="px-2 text-xs font-semibold rounded-full bg-blue-700 text-white">
                        Confluence
                      </span>
                    </a>
                  ) : null
                ) : null}
              </div>
            </>
          );
        },
      },
      {
        Header: "Detail",
        Cell: (props) => {
          return (
            <>
              <div style={{ textAlign: "-webkit-center", cursor: "pointer" }}>
                <Link href={`/problem/${props.row.original.id}`} passHref>
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Link>
              </div>
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
      <LayoutPage session={user} pageTitle="My Task" isShowNotif={false}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="problem-list-section">
            <PageHeader title="My Task">
              <Link href="/problem/create" passHref>
                <PrimaryAnchorButton>
                  <PlusSmIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Problem Non-Incident
                </PrimaryAnchorButton>
              </Link>
            </PageHeader>

            {/* Problem Tables on Going */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <p className="text-2xl font-medium text-gray-900">Ongoing</p>
                <ProblemTables
                  columns={columns}
                  data={data.filter((task) => task.idStatus !== 4)}
                />
              </div>
            </div>

            {/* Problem Tables Done */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <p className="text-2xl font-medium text-gray-900">Done</p>
                <ProblemTables
                  columns={columns}
                  data={data.filter((done) => done.idStatus === 4)}
                />
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
