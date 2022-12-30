import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import withSession from "lib/session";
import DateRangeFilter from "components/incidents/daterange-filter";
import { PrimaryButton } from "components/ui/button";
import { SecondaryButton } from "components/ui/button";
import { components } from "react-select";
import { ReactSelect } from "components/ui/forms";
import { toast } from "react-toastify";
import format from "date-fns/format";
import palette from "google-palette";
import Table from "components/ui/table";
import { Spinner } from "components/ui/svg/spinner";
import { classNames } from "components/utils";
import { Spin } from "antd";
import { useReactToPrint } from "react-to-print";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageContent,
} from "components/layout/index";

export default function ThirdParty({ user }) {
  const [portalTarget, setPortalTarget] = useState("");
  const [partner, setPartner] = useState("");
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [statsData, setStatsData] = useState({
    availability: "-",
    availabilityColor: null,
    transactionSucess: null,
    totalInq: null,
    totalPay: null,
    successRateInq: null,
    successRatePay: null,
    salesVolume: null,
    partner: null,
    partnerLogo: null,
    startTime: null,
    endTime: null,
  });
  const initialChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  const config = {
    data: [],
    smooth: true,
    xField: "metric",
    yField: "value",
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  const config2 = {
    data: [],
    smooth: true,
    xField: "metric",
    yField: "value",
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  const [incidentChartData, setIncidentChartData] = useState(config);
  // const [downtimeChartData, setDowntimeChartData] = useState(initialChartData);
  const [downtimeChartData, setDowntimeChartData] = useState(config2);
  //console.log(downtimeChartData);

  const stats = [
    {
      id: 1,
      name: "Availability",
      stat: statsData.availability,
      color: statsData.availabilityColor,
      icon: "Clock.png",
    },
    {
      id: 2,
      name: "Transaction Success",
      stat: {
        totalInq: statsData.totalInq,
        totalPay: statsData.totalPay,
        color: "",
      },
      color: "",
      icon: "Tick.png",
    },
    {
      id: 3,
      name: "Success Rate (%)",
      stat: {
        totalInq: statsData.successRateInq,
        totalPay: statsData.successRatePay,
        color: "",
      },
      color: "",
      icon: "Discount.png",
    },
    {
      id: 4,
      name: "Sales Volume",
      stat: statsData.salesVolume,
      color: "",
      icon: "Wallet.png",
    },
  ];

  const [tableData, setTableData] = useState([]);
  const componentRef = useRef(null);

  const hanldePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Third_Party_Report_${statsData.partner}`,
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

  // Get partner options
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reports/thirdparty?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.thirdPartyName,
        }));
        setPartnerOptions(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  const handlePartnerChange = (event) => {
    if (event == null) {
      setPartner("");
    } else {
      setPartner(event.value);
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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${partner}/thirdparty?startDate=${startTime}&endDate=${endTime}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      const data = res.data;

      // Change stats dashboard
      setStatsData((statsData) => ({
        ...statsData,
        availability: data.systemAvailabilityData.availability,
        availabilityColor: data.systemAvailabilityData.displayColor,
        partner: data.data.thirdPartyName,
        partnerLogo: data.data.thirdPartyLogo,
        startTime: startTime,
        endTime: endTime,
        totalInq: data.transactionSummary.totalInquiry.startsWith("0.00")
          ? null
          : data.transactionSummary.totalInquiry,
        totalPay: data.transactionSummary.totalPayment,
        successRateInq: data.transactionSummary.successRateInquiry.startsWith(
          "0.00"
        )
          ? null
          : data.transactionSummary.successRateInquiry.slice(0, -1),
        successRatePay: data.transactionSummary.sucessRatePayment.slice(0, -1),
        salesVolume: data.transactionSummary.totalSalesVolume,
      }));

      // Set chart label & colour (sumbu x)
      const chartLabels = data.incidentSummaryData.map((d) => d.incidentDate);
      const chartBgColor = palette("tol-rainbow", chartLabels.length).map(
        function (hex) {
          return "#" + hex;
        }
      );

      setIncidentChartData((incidentChartData) => ({
        ...incidentChartData,
        labels: chartLabels,
        data: data.incidentSummaryData.map((d) => ({
          metric: d.incidentDate,
          value: d.numberOfIncident,
        })),
      }));

      setDowntimeChartData((downtimeChartData) => ({
        ...downtimeChartData,
        data: data.incidentSummaryData.map((d) => ({
          metric: d.incidentDate,
          value: d.totalDowntime,
        })),
      }));

      setTableData(data.incidentDetailData);
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const Input = (props) => (
    <components.Input
      {...props}
      inputClassName="outline-none border-none shadow-none focus:ring-transparent"
    />
  );

  // Table column variable
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "startDatetime",
        Cell: (props) => format(new Date(props.value), "dd MMM yyyy"),
      },
      {
        Header: "Time",
        accessor: "endDatetime",
        Cell: (props) =>
          `${format(
            new Date(props.row.original.startDatetime),
            "HH:mm"
          )} - ${format(new Date(props.value), "HH:mm")}`,
      },
      {
        Header: "Downtime",
        accessor: "downtimeDuration",
      },
      {
        Header: "Description",
        accessor: "incidentName",
        disableSortBy: true,
        style: "w-1/3",
      },
      {
        Header: "Root Cause",
        accessor: "rootCause",
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <LayoutPage session={user} pageTitle={"Third Party Report - Shield"}>
      <LayoutPageHeader variant="alternate" pageTitle={"Third Party Report"} />
      <LayoutPageContent>
        <div className="mt-5 mb-5 md:mt-0 md:col-span-2">
          <form>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="thirdPartyName"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Partner
                    </label>
                    <ReactSelect
                      isClearable
                      className="text-sm block w-full"
                      menuPortalTarget={portalTarget}
                      id="thirdPartyName"
                      instanceId={"thirdPartyName"}
                      options={partnerOptions}
                      onChange={handlePartnerChange}
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
                        onClick={hanldePrint}
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
              {/* Stats */}
              <div className="mb-5">
                <h2 className="mb-3 text-lg leading-6 font-medium text-gray-900">
                  Summary Dashboard
                </h2>

                <dl className="grid grid-cols-2 gap-5 print:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((item) => (
                    <div
                      key={item.id}
                      className="relative bg-white pt-5 px-4 m:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                    >
                      <dt>
                        <img
                          src={`/Iconly/Glass/${item.icon}`}
                          alt="btc logo"
                          className="h-24 w-24 rounded-full absolute opacity-50 -top-6 -right-6 md:-right-4"
                        />
                        <p className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </p>
                      </dt>
                      <dd className="pb-6 flex items-baseline sm:pb-7">
                        {item.id == 2 || item.id == 3 ? (
                          item.stat.totalInq !== null ? (
                            <>
                              <div className="bg-blue-100 rounded px-1 py-0">
                                <span className="text-blue-700 text-xs">
                                  inq
                                </span>
                              </div>
                              <p
                                className={classNames(
                                  "ml-2 mr-2 text-lg font-semibold",
                                  item.color
                                )}
                              >
                                {item.stat.totalInq}
                              </p>
                              <div className="bg-blue-100 rounded px-1 py-0">
                                <span className="text-blue-700 text-xs">
                                  pay
                                </span>
                              </div>
                              <p
                                className={classNames(
                                  "ml-2 text-lg font-semibold",
                                  item.color
                                )}
                              >
                                {item.stat.totalPay}
                              </p>
                            </>
                          ) : (
                            <p
                              className={classNames(
                                "text-2xl font-semibold",
                                item.color
                              )}
                            >
                              {item.stat.totalPay}
                            </p>
                          )
                        ) : (
                          <p
                            className={classNames(
                              "text-2xl font-semibold",
                              item.color
                            )}
                          >
                            {item.stat}
                          </p>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              {/* End of Stats */}

              {/* Card */}

              {/* End of Card */}

              <div className="grid grid-cols-6 gap-6 print:grid-cols-1">
                <div className="col-span-3 print:col-span-1">
                  {/* New Card */}
                  <div className="mb-5 bg-white shadow overfow-hidden sm:rounded-lg">
                    <div className="flex justify-between items-baseline flex-wrap sm:flex-nowrap">
                      <div className="px-1 py-2 sm:px-6 sm:flex-1">
                        <h2 className="text-sm leading-6 font-medium text-gray-900">
                          Total Incident
                        </h2>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-7 sm:px-6">
                      {/* <Area {...incidentChartData} /> */}
                      <div className="flex flex-1 justify-center space-x-2">
                        <ShieldExclamationIcon className="h-5 w-5 text-gray-300" />
                        <span>Sorry! Chart is under construction.</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 print:col-span-1">
                  {/* New Card */}
                  <div className="mb-5 bg-white shadow overfow-hidden sm:rounded-lg">
                    <div className="flex justify-between items-baseline flex-wrap sm:flex-nowrap">
                      <div className="px-1 py-2 sm:px-6 sm:flex-1">
                        <h2 className="text-sm leading-6 font-medium text-gray-900">
                          Total Downtime (minutes)
                        </h2>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-7 sm:px-6">
                      {/* <Area {...downtimeChartData} /> */}
                      <div className="flex flex-1 justify-center space-x-2">
                        <ShieldExclamationIcon className="h-5 w-5 text-gray-300" />
                        <span>Sorry! Chart is under construction.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Table */}
              <div className="mt-6 print:mt-96">
                <h2 className="mb-3 text-lg leading-6 font-medium text-gray-900">
                  Timeout Incident Details
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
        )}
      </LayoutPageContent>
    </LayoutPage>
  );
}

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
