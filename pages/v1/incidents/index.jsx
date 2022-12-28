import { Input as InputTag, Tooltip as TooltipTag, Space } from "antd";
import DateRangeFilter from "components/incidents/daterange-filter";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/layout";
import AvatarCell from "../../../components/incidents/avatar-cell";
import PageHeader from "../../../components/incidents/page-header";
import Table from "../../../components/incidents/table";
import {
  SelectColumnFilter,
  StatusFilter,
} from "../../../components/incidents/dropdown-filter";
import axios from "axios";
import withSession from "../../../lib/session";
import format from "date-fns/format";
import { useMemo } from "react";
import {
  StatusPill,
  StatusText,
  StatusIncident,
} from "../../../components/incidents/status-pill";
import {
  PlusSmIcon,
  SearchIcon,
  DocumentSearchIcon,
  InformationCircleIcon,
  AdjustmentsIcon,
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
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { classNames } from "components/utils";

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
  const incidentName = query.incidentName || "";

  if (
    query.page ||
    query.perPage ||
    query.idApps ||
    query.idIncidentType ||
    query.incidentStatus ||
    query.filterStartTime ||
    query.filterEndTime ||
    query.incidentNumber ||
    query.incidentName
  ) {
    url.searchParams.append("page", page);
    url.searchParams.append("perPage", perPage);
    url.searchParams.append("idApps", apps);
    url.searchParams.append("idIncidentType", incidentType);
    url.searchParams.append("incidentStatus", incidentStatus);
    url.searchParams.append("filterStartTime", startTime);
    url.searchParams.append("filterEndTime", endTime);
    url.searchParams.append("incidentNumber", irNumber);
    url.searchParams.append("incidentName", incidentName);
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
  const [IncidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [portalTarget, setPortalTarget] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const router = useRouter();

  // Handle react-select dropdown position
  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      setPortalTarget(document.querySelector("body"));
    }
  }, []);

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

  const perPageOptions = [
    { value: "10", label: "Showing 10" },
    { value: "25", label: "Showing 25" },
    { value: "50", label: "Showing 50" },
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

  const handleSearchChange = (value) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value === "") {
      let param = new URLSearchParams(currentQuery);
      param.delete("incidentName");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else if (value.length >= 3) {
      currentQuery.incidentName = value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else {
      return false;
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

  const handleperPageChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.perPage = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("perPage");
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
              {/* Start Filter Panel */}
              <section
                aria-labelledby="filter-incident"
                className="mb-5 lg:col-start-3 lg:col-span-1"
              >
                <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:px-6">
                  <Disclosure as="div">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-start justify-between w-full text-base text-left text-gray-400">
                          <Space>
                            <SearchIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="text-base font-normal">
                              Search in Incident
                            </span>
                          </Space>
                          <span className="flex items-center ml-6 h-7">
                            <AdjustmentsIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-3">
                          <hr className="mb-3 divide-y divide-gray-200" />
                          <div className="grid grid-cols-6 gap-4 ">
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="search"
                                className="block mb-1 text-sm font-medium text-gray-700"
                              >
                                Name
                              </label>
                              <InputTag
                                allowClear
                                onChange={(e) =>
                                  handleSearchChange(e.target.value)
                                }
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
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="date-filter"
                                className="block mb-1 text-sm font-medium text-gray-700"
                              >
                                IR Number
                              </label>
                              <InputTag
                                allowClear
                                onPressEnter={(e) =>
                                  handleIRNumChange(e.target.value)
                                }
                                onChange={(e) =>
                                  handleIRNumChange(e.target.value)
                                }
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
                                  height: "38px",
                                }}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="date-filter"
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
                                className="text-sm focus:ring-blue-300 focus:border-blue-300"
                                onChange={handleAppChange}
                                menuPortalTarget={portalTarget}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="date-filter"
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
                                onChange={handleIncidentTypeChange}
                                menuPortalTarget={portalTarget}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="date-filter"
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
                                onChange={handleIncidentStatusChange}
                                menuPortalTarget={portalTarget}
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                              <label
                                htmlFor="date-filter"
                                className="block mb-1 text-sm font-medium text-gray-700"
                              >
                                Date
                              </label>
                              <DateRangeFilter onChange={handleDateChange} />
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </section>
              {/* End of Filter Panel */}

              <Table columns={columns} data={props.data} ref={tableInstance} />

              {/* Awal pagination */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm ">
                    {/* Showing{" "} */}
                    <div className="flex gap-x-1">
                      <div>
                        <ReactSelect
                          id="perPage"
                          instanceId={"perPage"}
                          defaultValue={10}
                          options={perPageOptions}
                          placeholder="Shows"
                          className="ml-1 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={handleperPageChange}
                        />
                      </div>
                      <div className="mt-2 ml-2">
                        <span className="font-medium">
                          Page {props.currentPage}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">{props.pageCount}</span>{" "}
                        of{" "}
                        <span className="font-medium">{props.totalCount}</span>{" "}
                        results
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 mb-5">
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
              {/* Akhir pagination */}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default IncidentList;
