// filtered by responsible team tambah info total incident

import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import withSession from "lib/session";
import DateRangeFilter from "components/incidents/daterange-filter";
import { PrimaryButton } from "components/ui/button";
import { SecondaryButton } from "components/ui/button";
import { ReactSelect } from "components/ui/forms";
import { toast } from "react-toastify";
import format from "date-fns/format";
import Table from "components/ui/table";
import { Spinner } from "components/ui/svg/spinner";
import { Spin } from "antd";
import { useReactToPrint } from "react-to-print";
import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageContent,
} from "components/layout/index";
import { DefaultCard } from "components/ui/card/default-card";
import { AreaChart } from "@tremor/react";

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

  return {
    props: {
      user: req.session.get("user"),
    },
  };
});

export default function IncidentByTeam({ user }) {
  const [portalTarget, setPortalTarget] = useState("");
  const [fungsi, setFungsi] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [statsData, setStatsData] = useState({
    startTime: null,
    endTime: null,
  });

  const [chartData, setChartData] = useState([]);

  const [tableData, setTableData] = useState([]);
  const componentRef = useRef(null);

  // buat export
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Responsible_Team_Report_${statsData.fungsi}`,
    pageStyle: `
      @media all {
        .page-break {
          display: none;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: auto;
        }
      }
      
      @page {
        size: landscape;
        margin: 10mm;
      }
    `,
  });

  // Handle react-select dropdown position
  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      setPortalTarget(document.querySelector("body"));
    }
  }, []);

  // get responsible team
  const [teamOptions, setTeamOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/group?isActive=Y&division=APP`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.prefix,
          label: item.prefix,
        }));
        setTeamOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get teams list: ${error.response.data.message}`
        )
      );
  }, []);

  const handleFungsiChange = (event) => {
    if (event == null) {
      setFungsi("");
    } else {
      setFungsi(event.value);
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

  // Handle on search filter
  const handleSearch = async () => {
    setShowDashboard(true);
    setIsLoading(true);

    try {
      const res = await axios.get( // dasbor start
        `${process.env.NEXT_PUBLIC_API_URL_V2}/dashboards/test-alifa-1?startTime=${startTime}&endTime=${endTime}&divisionName=${fungsi}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const data = res.data.data;
      setChartData(data);
      console.log(data); //dasbor end

      const resSum = await axios.get( // report start
        `${process.env.NEXT_PUBLIC_API_URL_V2}/dashboards/test-alifa-2?startTime=${startTime}&endTime=${endTime}&divisionName=${fungsi}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const datSum = resSum.data.data;
      setTableData(datSum);
      console.log(datSum); //report end

      console.log(datSum.length);

    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Table column variable
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "DATE",
        Cell: (props) => format(new Date(props.value), "dd MMM yyyy"),
      },
      {
        Header: "Time",
        accessor: "TIME",
        Cell: (props) => format(new Date(props.value), "HH:mm"),
      },
      {
        Header: "Recover",
        accessor: "RECOVER",
      },
      {
        Header: "Description",
        accessor: "DESCRIPTION",
        disableSortBy: true,
        style: "w-1/3",
      },
      {
        Header: "Root Cause",
        accessor: "ROOT_CAUSE",
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <LayoutPage session={user} pageTitle={"Incident by Team Report - Shield"}>
      <LayoutPageHeader
        variant="alternate"
        pageTitle={"Incident by Team Report"}
      />
      <LayoutPageContent>
        {/* Form Filter Start */}
        <div className="mt-5 mb-5 md:mt-0 md:col-span-2">
          <form>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="teamOption"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Responsible Team
                    </label>
                    <ReactSelect
                      isClearable
                      className="text-sm block w-full"
                      menuPortalTarget={portalTarget}
                      id="teamOption"
                      instanceId={"teamOption"}
                      options={teamOptions}
                      onChange={handleFungsiChange}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="date-filter"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <DateRangeFilter onChange={handleDateChange} />
                  </div>
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="search"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      &nbsp;
                    </label>
                    <PrimaryButton
                      type="button"
                      onClick={handleSearch}
                      className={
                        isLoading
                          ? "disabled:opacity-50 cursor-not-allowed"
                          : ""
                      }
                      disabled={isLoading}
                    >
                      {isLoading && <Spinner />}
                      Search
                    </PrimaryButton>
                    {showDashboard && isLoading == false && (
                      <SecondaryButton
                        type="button"
                        onClick={handlePrint}
                        className="ml-3"
                      >
                        Export
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Form Filter End */}

        {showDashboard && (
          <div ref={componentRef} className="print:a4-screen-sized">
            <Spin size="large" spinning={isLoading} tip="Loading...">
              <div className="grid grid-cols-6 gap-6 print:grid-cols-1">
                <div className="col-span-3">
                  <DefaultCard title={tableData.length + " Total Incident"} subtitle={"  "}>
                    <AreaChart
                      className="h-72 mt-4"
                      data={chartData}
                      dataKey="incidentDate"
                      categories={["numberOfIncident"]}
                      colors={["indigo"]}
                    />
                  </DefaultCard>
                </div>
                <div className="col-span-3">
                  <DefaultCard title={"Total Downtime"} subtitle={"in minutes"}>
                    <AreaChart
                      className="h-72 mt-4"
                      data={chartData}
                      dataKey="incidentDate"
                      categories={["totalSolvedIntervals"]}
                      colors={["cyan"]}
                    />
                  </DefaultCard>
                </div>
              </div>
              {/* Start Table */}
              <div className="mt-0 print:mt-96">
                <h2 className="mb-3 text-lg leading-6 font-medium text-gray-900">
                  Incident Details
                </h2>
                <Table
                  columns={columns}
                  data={tableData}
                  initialPageSize={500}
                />
              </div>
              {/* End of Table */}
            </Spin>
          </div>
        )
        }
      </LayoutPageContent >
    </LayoutPage >
  );
}
