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
import { styledReactSelect } from "components/utils";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime";

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

  res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: req.session.get("user"),
        data: data.data,
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
        notFound: true,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});

function IncidentList({ user, data }) {
  const [tableData, setTableData] = useState([]);
  const [irNumber, setIRNumber] = useState("");
  const [apps, setApps] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [IncidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [incidentStatus, setIncidentStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  // Get filter
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents?idApps=${apps}&idIncidentType=${incidentType}&incidentStatus=${incidentStatus}&filterStartTime=${startTime}&filterEndTime=${endTime}&incidentNumber=${irNumber}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const result = await response.data.data;
      setTableData(result);
    };

    if (
      irNumber ||
      apps ||
      incidentType ||
      incidentStatus ||
      startTime ||
      endTime
    ) {
      fetchData();
    } else {
      setTableData(data);
    }
  }, [irNumber, apps, incidentType, incidentStatus, startTime, endTime, data]);

  // to hanlde if clearable button clicked
  const handleIRNumChange = (value) => {
    if (value === "") {
      setIRNumber("");
    }
  };

  const handleIRNumEnter = (value) => {
    setIRNumber(value);
  };

  const handleAppChange = (event) => {
    if (event == null) {
      setApps("");
    } else {
      setApps(event.value);
    }
  };

  const handleIncidentTypeChange = (event) => {
    if (event == null) {
      setIncidentType("");
    } else {
      setIncidentType(event.value);
    }
  };

  const handleIncidentStatusChange = (event) => {
    if (event == null) {
      setIncidentStatus("");
    } else {
      setIncidentStatus(event.value);
    }
  };

  const handleDateChange = (value, dateString) => {
    if (value == null) {
      setStartTime("");
      setEndTime("");
    } else {
      setStartTime(dateString[0]);
      setEndTime(dateString[1]);
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
      <Layout session={user}>
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
                    onPressEnter={(e) => handleIRNumEnter(e.target.value)}
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
              <Table columns={columns} data={tableData} ref={tableInstance} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default IncidentList;
