import { Tooltip as TooltipTag } from "antd";
import { Input as InputTag } from "antd";
import DateRangeFilter from "components/incidents/daterange-filter";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import AvatarCell from "../../components/incidents/avatar-cell";
import PageHeader from "../../components/incidents/page-header";
import Table from "../../components/incidents/table";
import {
  SelectColumnFilter,
  StatusFilter,
} from "../../components/incidents/dropdown-filter";
import axios from "axios";
import withSession from "../../lib/session";
import format from "date-fns/format";
import { useMemo } from "react";
import {
  StatusPill,
  StatusText,
  StatusIncident,
} from "../../components/incidents/status-pill";
import {
  PlusSmIcon,
  SearchIcon,
  DocumentSearchIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { PrimaryAnchorButton } from "components/ui/button/primary-anchor-button";
import { SecondaryAnchorButton } from "components/ui/button/secondary-anchor-button";
import { ReactSelect } from "components/ui/forms";
import AsyncSelect from "react-select/async";
import { styledReactSelect, createParam } from "components/utils";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime";

import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/incidents`);

  const page = query.page || 1;
  const perPage = query.perPage || "";
  const apps = query.idApps || "";
  const incidentType = query.idIncidentType || "";
  const incidentStatus = query.incidentStatus || "";
  const startTime = query.filterStartTime || "";
  const endTime = query.filterEndTime || "";
  const irNumber = query.incidentNumber || "";

  if (
    query.page ||
    query.perPage ||
    query.idApps ||
    query.idIncidentType ||
    query.incidentStatus ||
    query.filterStartTime ||
    query.filterEndTime ||
    query.incidentNumber
  ) {
    url.searchParams.append("page", page);
    url.searchParams.append("perPage", perPage);
    url.searchParams.append("idApps", apps);
    url.searchParams.append("idIncidentType", incidentType);
    url.searchParams.append("incidentStatus", incidentStatus);
    url.searchParams.append("filterStartTime", startTime);
    url.searchParams.append("filterEndTime", endTime);
    url.searchParams.append("incidentNumber", irNumber);
  } else {
    url.searchParams.append("page", page);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: user,
        data: data.data,
        totalCount: data.incidentPaging.totalData,
        pageCount: Math.ceil(
          data.incidentPaging.totalData / data.incidentPaging.perPage
        ),
        currentPage: data.incidentPaging.page,
        perPage: data.incidentPaging.perPage,
        isLoading: false,
      },
    };
  } else if (res.status === 401) {
    if (data.code === 999) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    } else if (data.code === 401) {
      return {
        user: user,
        search: data.code,
        isLoading: false,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});

function IncidentList(props) {
  const [tableData, setTableData] = useState([]);
  const [irNumber, setIRNumber] = useState("");
  const [apps, setApps] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [IncidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [incidentStatus, setIncidentStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //  nambah
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const router = useRouter();

  //Nambah Pagination
  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  const paginationHandler = (page) => {
    const currentPath = router.pathname; // '/incidents/search'
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    setSelectedPage(currentQuery.page);

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  const incidentStatusOptions = [
    { value: "Open", label: "Open" },
    { value: "Resolved", label: "Resolved" },
    { value: "Investigate", label: "Investigate" },
  ];

  // Get data aplikai async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${value}&status=A`
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

  // Get data incident type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/incidenttype?isActive=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.incidentType,
        }));
        setIncidentTypeOptions(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  // to hanlde if clearable button clicked
  const handleIRNumChange = (value) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value === "") {
      let param = new URLSearchParams(currentQuery);
      param.delete("incidentNumber");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      currentQuery.incidentNumber = value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  const handleAppChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.idApps = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("idApps");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  const handleIncidentTypeChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.idIncidentType = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("idIncidentType");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  const handleIncidentStatusChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.incidentStatus = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("incidentStatus");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  const handleDateChange = (value, dateString) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value == null) {
      let param = new URLSearchParams(currentQuery);
      param.delete("filterStartTime");
      param.delete("filterEndTime");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      currentQuery.filterStartTime = dateString[0];
      currentQuery.filterEndTime = dateString[1];
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  const tableInstance = useRef(null);
  const count = tableData.length;
  const [value, setValue] = useState(""); // tableInstance.current.state.globalFilter
  const handleGlobalChange = useAsyncDebounce((value) => {
    tableInstance.current.setGlobalFilter(value || undefined);
  }, 1000);

  const columns = useMemo(
    () => [
      {
        Header: "Incident Name",
        accessor: "incidentName",
        Cell: (props) => {
          return (
            <div>
              <Link href={`/incidents/${props.row.original.id}`}>
                {/* <a className="text-blue-500 hover:text-blue-900"> */}
                <a className="no-underline hover:underline visited:text-purple-600">
                  {props.value}
                </a>
              </Link>
              <p className="flex items-center mt-1 text-xs text-gray-500 ">
                {props.row.original.incidentNumber
                  ? `${props.row.original.incidentNumber}`
                  : ""}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Application",
        accessor: "paramApps.subName",
        Filter: SelectColumnFilter,
        filter: "includes",
        Cell: StatusText,
      },
      {
        Header: "Priority",
        accessor: "paramPriorityMatrix.mapping",
        Cell: StatusPill,
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "incidentStatus",
        Cell: StatusIncident,
        Filter: StatusFilter,
        filter: "includes",
        disableSortBy: true,
      },
      {
        Header: "Started At",
        accessor: "logStartTime",
        // Filter: DateRangeFilter,
        Cell: (props) => {
          return (
            <div>
              <div className="text-xs text-gray-900">
                {format(
                  new Date(props.row.original.logStartTime),
                  "dd MMM yyyy HH:mm"
                )}
              </div>
              <div className="text-xs text-gray-500">
                {props.row.original.resolvedIntervals ? (
                  <span className="text-xs">
                    {props.row.original.resolvedIntervals} minutes
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Reporter",
        accessor: "paramCreatedBy.fullname",
        Cell: AvatarCell,
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <>
      <Layout session={props.user}>
        <Head>
          <title>Incident Report</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Incident Report">
            <Link href="/incidents/search" passHref>
              <SecondaryAnchorButton>
                <DocumentSearchIcon
                  className="w-5 h-5 mr-2 -ml-1"
                  aria-hidden="true"
                />
                Incident Matching
              </SecondaryAnchorButton>
            </Link>
            <Link href="/incidents/add" passHref>
              <PrimaryAnchorButton>
                <PlusSmIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                New Incident
              </PrimaryAnchorButton>
            </Link>
          </PageHeader>
          <div className="hidden mt-3 sm:block">
            <div className="max-w-full px-4 mx-auto sm:px-6 lg:px-12">
              <div className="flex gap-x-2">
                <div>
                  <label
                    htmlFor="search"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Search
                  </label>
                  <InputTag
                    allowClear
                    value={value || ""}
                    onChange={(e) => {
                      setValue(e.target.value);
                      handleGlobalChange(e.target.value);
                    }}
                    placeholder={`${count} records...`}
                    prefix={
                      <SearchIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    }
                    style={{
                      borderRadius: "0.375rem",
                      width: "100%",
                      height: "38px",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="incidentNumber"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    IR Number
                  </label>
                  <InputTag
                    allowClear
                    onPressEnter={(e) => handleIRNumChange(e.target.value)}
                    onChange={(e) => handleIRNumChange(e.target.value)}
                    placeholder="IR-____-______"
                    suffix={
                      <TooltipTag title="Press Enter to Search">
                        <InformationCircleIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </TooltipTag>
                    }
                    style={{
                      borderRadius: "0.375rem",
                      width: "11rem",
                      height: "38px",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="application"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Application
                  </label>
                  <AsyncSelect
                    isClearable
                    id="application"
                    instanceId={"application"}
                    defaultValue={""}
                    loadOptions={loadApplications}
                    styles={styledReactSelect}
                    className="text-sm focus:ring-blue-300 focus:border-blue-300 w-60 md:w-40 lg:w-40"
                    placeholder="Search App"
                    onChange={handleAppChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="IncidentTypeOptions"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Incident Type
                  </label>
                  <ReactSelect
                    id="IncidentTypeOptions"
                    instanceId={"IncidentTypeOptions"}
                    defaultValue={""}
                    options={IncidentTypeOptions}
                    isClearable
                    className="block w-auto lg:w-40"
                    onChange={handleIncidentTypeChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="IncidentStatus"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <ReactSelect
                    id="IncidentStatus"
                    instanceId={"IncidentStatus"}
                    defaultValue={""}
                    options={incidentStatusOptions}
                    isClearable
                    className="block w-auto lg:w-32"
                    onChange={handleIncidentStatusChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="date-filter"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <DateRangeFilter onChange={handleDateChange} />
                </div>
              </div>
              <Table columns={columns} data={props.data} ref={tableInstance} />
              {/* Awal coba pagination */}
              <div className="hidden mt-3 sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{props.currentPage}</span> to{" "}
                    <span className="font-medium">{props.pageCount}</span> of{" "}
                    <span className="font-medium">{props.totalCount}</span>{" "}
                    results
                  </p>
                </div>
                <div className="mb-5">
                  <ReactPaginate
                    initialPage={props.currentPage - 1}
                    pageCount={props.pageCount} //page count
                    previousLabel={"Prev"}
                    onPageChange={paginationHandler}
                    containerClassName={
                      "relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    }
                    pageLinkClassName={
                      "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    }
                    previousLinkClassName={
                      "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    }
                    nextLinkClassName={
                      "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    }
                    breakLabel={"..."}
                    breakLinkClassName={
                      "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    }
                    activeLinkClassName={
                      "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    }
                  />
                </div>
              </div>
              {/* Akhir coba pagination */}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default IncidentList;
