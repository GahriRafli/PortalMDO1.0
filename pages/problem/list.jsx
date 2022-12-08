import { Input } from "antd";
import Link from "next/link";
import Head from "next/head";
import PageHeader from "../../components/problems/ProblemHeader";
import ProblemStats from "components/problems/ProblemStats";
import ProblemTables from "components/problems/ProblemTables";
import { EyeIcon } from "@heroicons/react/outline";
import { useEffect, useState, useMemo, useRef } from "react";
import format from "date-fns/format";
import { toast } from "react-toastify";
import {
  PriorityArrow,
  SourcePill,
  StatusPill,
} from "../../components/problems/ProblemBadge";
import axios from "axios";
import { useAsyncDebounce } from "react-table";
import withSession from "../../lib/session";
import {
  SearchIcon,
  DocumentAddIcon,
  DocumentSearchIcon,
  PuzzleIcon,
  SparklesIcon,
  BadgeCheckIcon,
  BanIcon,
} from "@heroicons/react/outline";
import AsyncSelect from "react-select/async";
import { ReactSelect } from "components/ui/forms";
import { styledReactSelectAdd } from "components/utils";
import { SecondaryAnchorButton } from "components/ui/button/secondary-anchor-button";
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

  const allJoin = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/alljoin`
  );
  const problems = await allJoin.json();

  const assignProblem = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/needAssign`
  );
  const getAssign = await assignProblem.json();

  if (allJoin.status >= 200) {
    return {
      props: {
        user: user,
        problems: problems.data,
        countAssign: getAssign.data.length,
      },
    };
  }
});

export default function ProblemList({ user, problems, countAssign }) {
  const [tableData, setTableData] = useState([]);
  const [idApps, setIdApps] = useState("");
  const [problemName] = useState("");

  const [sourceProblem, setSourceProblem] = useState("");
  const [sourceProblemOptions, setSourceProblemOptions] = useState([]);

  const [statusProblem, setStatusProblem] = useState("");
  const [statusProblemOptions, setStatusProblemOptions] = useState([]);

  const tableInstance = useRef(null);
  const [value, setValue] = useState(""); // tableInstance.current.state.globalFilter
  const handleGlobalChange = useAsyncDebounce((value) => {
    tableInstance.current.setGlobalFilter(value || undefined);
  }, 1000);

  // Get Data Aplikasi Async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${value}`
        )
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: d.subName,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  // Get Source Problem
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/source/all`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setSourceProblemOptions(data);
      })
      .catch((err) => toast.error(`Source ${err}`));
  }, []);

  // Get Status Problem
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/status/all`)
      .then((response) => {
        const data = response.data.data
          .filter((data) => data.id !== 1)
          .map((d) => ({
            value: d.id,
            label: d.label,
          }));
        setStatusProblemOptions(data);
      })
      .catch((err) => toast.error(`Status ${err}`));
  }, []);

  // Hit to Filter Problem
  useEffect(() => {
    let emptyColumns;
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/filtersapujagat/all?idApps=${idApps}&idSource=${sourceProblem}&idStatus=${statusProblem}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const result = await response.data.data;
      if (!result) {
        setHiddenColumns(emptyColumns);
      } else {
        setTableData(result);
      }
    };
    if (idApps || sourceProblem || statusProblem) {
      fetchData();
    } else {
      setTableData(problems);
    }
  }, [
    idApps,
    problemName,
    sourceProblem,
    statusProblem,
    problems,
    user.accessToken,
  ]);

  const handleAppChange = (event) => {
    if (event == null) {
      setIdApps("");
    } else {
      setIdApps(event.value);
    }
  };

  const handleSourceProblemChange = (event) => {
    if (event == null) {
      setSourceProblem("");
    } else {
      setSourceProblem(event.value);
    }
  };

  const handleStatusProblemChange = (event) => {
    if (event == null) {
      setStatusProblem("");
    } else {
      setStatusProblem(event.value);
    }
  };

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
                <text className="text-gray-600 hover:text-gray-900">
                  {props.row.original.problemNumber != null
                    ? ` ${props.row.original.problemNumber}`
                    : " -"}
                </text>
              </div>
              <div className="text-base text-gray-900 font-medium">
                <a
                  href={`/problem/${props.row.original.id}`}
                  className="bg-gray-100 text-gray-900"
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
              {props.row.original.assigned_to &&
              props.row.original.idStatus < 7 ? (
                props.row.original.assigned_to.fullName
              ) : (
                <>
                  <div className="inline-flex">
                    Rejected
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
          <title>All Problem List</title>
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
            <PageHeader title="Problem List">
              <Link href="/problem/search" passHref>
                <SecondaryAnchorButton>
                  {/* <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> */}
                  <DocumentSearchIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  Problem Matching
                </SecondaryAnchorButton>
              </Link>
              {/* <span className="relative inline-flex">
              <Link href="/problem/assign" passHref>
                <SecondaryAnchorButton>
                  {countAssign} :: Need Assign
                  <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                </SecondaryAnchorButton>
              </Link>
            </span> */}
            </PageHeader>

            {/* Cards */}
            <div className="px-4 sm:px-6 lg:px-8">
              <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
                <ProblemStats
                  id="1"
                  bgColor="bg-red-400"
                  initials={<DocumentAddIcon className="w-6 h-6" />}
                  title="Draft and Unassigned"
                  desc={`${
                    problems.filter(
                      (data) => data.problemStatus.label === "Draft"
                    ).length
                  } Draft | ${countAssign} Unassigned`}
                />
                <ProblemStats
                  id="2"
                  bgColor="bg-gray-400"
                  initials={<PuzzleIcon className="w-6 h-6" />}
                  title="Review"
                  desc={`${
                    problems.filter(
                      (data) =>
                        data.problemStatus.label === "Waiting for Review"
                    ).length
                  } Waiting for Review`}
                />
                <ProblemStats
                  id="3"
                  bgColor="bg-blue-400"
                  initials={<SparklesIcon className="w-6 h-6" />}
                  title="Ongoing"
                  desc={`${
                    problems.filter(
                      (data) => data.problemStatus.label === "Ongoing at JIRA"
                    ).length
                  } Ongoing at JIRA`}
                />
                <ProblemStats
                  id="4"
                  bgColor="bg-green-400"
                  initials={<BadgeCheckIcon className="w-6 h-6" />}
                  title="Done"
                  desc={`${
                    problems.filter(
                      (data) => data.problemStatus.label === "Need Acknowledged"
                    ).length
                  } Acknowledged | ${
                    problems.filter(
                      (data) => data.problemStatus.label === "Done"
                    ).length
                  } Resolved`}
                />
              </ul>
            </div>

            {/* Problem Tables table (small breakpoint and up) */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <div className="flex gap-x-2">
                  {/* Search Component */}
                  <div className="flex-auto">
                    <label
                      htmlFor="search"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Search
                    </label>
                    <Input
                      disabled={false}
                      allowClear
                      value={value || ""}
                      onChange={(e) => {
                        setValue(e.target.value);
                        handleGlobalChange(e.target.value);
                      }}
                      placeholder={
                        tableData
                          ? `${
                              tableData.filter(
                                (data) => data.problemStatus.id !== 1
                              ).length
                            } records...`
                          : `0 records...`
                      }
                      prefix={
                        <SearchIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      }
                      style={{
                        borderRadius: "0.375rem",
                        height: "38px",
                      }}
                    />
                  </div>

                  {/* Application Filter */}
                  <div>
                    <label
                      htmlFor="application"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Application
                    </label>
                    <AsyncSelect
                      isDisabled={false}
                      isClearable
                      loadOptions={loadApplications}
                      styles={styledReactSelectAdd}
                      className="text-sm focus:ring-blue-300 focus:border-blue-300 w-80"
                      placeholder="Search App"
                      onChange={handleAppChange}
                    />
                  </div>

                  {/* Source Problem Filter */}
                  <div className="flex-intitial">
                    <label
                      htmlFor="SourceProblemOptions"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Source Problem
                    </label>
                    <ReactSelect
                      isDisabled={false}
                      options={sourceProblemOptions}
                      isClearable
                      className="block w-60"
                      onChange={handleSourceProblemChange}
                    />
                  </div>

                  {/* Problem Status Filter */}
                  <div>
                    <label
                      htmlFor="ProblemStatus"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Status Problem
                    </label>
                    <ReactSelect
                      isDisabled={false}
                      options={statusProblemOptions}
                      isClearable
                      className="block w-60"
                      onChange={handleStatusProblemChange}
                    />
                  </div>
                </div>
                <ProblemTables
                  columns={columns}
                  data={tableData.filter((data) => data.idStatus !== 1)}
                  ref={tableInstance}
                />
              </div>
            </div>
          </section>
        </div>
      </LayoutRoot>
    </>
  );
}
