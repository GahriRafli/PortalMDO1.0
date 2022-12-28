import DateRangeFilter from "components/incidents/daterange-filter";
import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";
import withSession from "lib/session";
import {
  OfficeBuildingIcon,
  DocumentSearchIcon,
  FireIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";
import { ReactSelect } from "components/ui/forms";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { PrimaryButton } from "components/ui/button/primary-button";
import AsyncSelect from "react-select/async";
import { styledReactSelectAdd } from "components/utils";
import { ShowChart } from "components/chart";
import palette from "google-palette";
import { toast } from "react-toastify";

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

  res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/1/report`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  // const getProblems = await fetch(
  // `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/count`
  // );

  const data = await res.json();
  // const problems = await getProblems.json();

  const groupBy = "Periodic";
  const today = new Date();
  const tahun = today.getFullYear().toString();
  let bulan = today.getMonth() + 1;
  if (bulan.toString().length < 2) {
    bulan = `0${bulan}`;
  }
  let tanggal = today.getDate().toString();
  if (today.getDate().toString().length < 2) {
    tanggal = "0" + today.getDate().toString();
  }
  const periodeAwal = today.getFullYear().toString() + "-01-01";
  const periodeAkhir = tahun + "-" + bulan.toString() + "-" + tanggal;

  const dashboardIncident = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboards/5/report?groupBy=${groupBy}&periodeAwal=${periodeAwal}&periodeAkhir=${periodeAkhir}&PIC=&CriticalApp=&AppName=`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  const dataDashboardIncident = await dashboardIncident.json();

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: req.session.get("user"),
        incidents: data,
        problems: 0,
        dashboardIncident: dataDashboardIncident,
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
      return { notFound: true };
    }
  } else if (res.status === 404) {
    return { notFound: true };
  } else {
    return { notFound: true };
  }
});

function Home({ user, incidents, problems, dashboardIncident }) {
  const cards = [
    {
      name: "Incidents Open",
      href: "/incidents",
      icon: DocumentSearchIcon,
      total: incidents.data.jumlah,
    },
    {
      name: "Problem Management",
      href: "/problem",
      icon: FireIcon,
      total: 0,
    },
    {
      name: "Ticket Open",
      href: "#",
      icon: ChatAlt2Icon,
      total: 0,
    },
  ];
  const [Periode1Options, setPeriode1Options] = useState([]);
  const [Periode2Options, setPeriode2Options] = useState([]);
  const [GroupByOptions, setGroupByOptions] = useState([]);
  const [CriticalityOption, setCriticalityOption] = useState([]);
  const [PICOption, setPICOption] = useState([]);
  const [Filter, setFilter] = useState(0);
  const [SelectedGroupBy, setSelectedGroupBy] = useState("Periode");

  // Get List PIC
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/7/report`)
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.prefix,
          label: d.prefix,
        }));
        setPICOption(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  // Get List Criticality
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/8/report`)
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.criticality_app,
          label: d.criticality_app_desc,
        }));
        setCriticalityOption(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

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

  // Set Group by
  const listGroupBy = [
    { value: "Periodic", label: "Periode" },
    { value: "CritApps", label: "Criticality" },
    { value: "RootCause", label: "RootCause" },
    { value: "PIC", label: "PIC" },
    { value: "Application", label: "Application" },
  ];

  const ColumnGroupBy = {
    Periode: "Periode",
    Criticality: "Criticality",
    RootCause: "RootCause",
    PIC: "PIC",
    Application: "Application",
  };

  const listChartType = [
    { value: "Bar", label: "Bar" },
    { value: "Line", label: "Line" },
    { value: "Pie", label: "Pie" },
  ];

  // const [handlerPeriode, sethandlerPeriode] = useState([]);
  const [handlerPeriode1Options, sethandlerPeriode1Options] = useState([]);
  const [handlerPeriode2Options, sethandlerPeriode2Options] = useState([]);
  const [handlerGroupByOptions, sethandlerGroupByOptions] = useState([]);
  const [handlerCriticalityOption, sethandlerCriticalityOption] = useState([]);
  const [handlerPICOption, sethandlerPICOption] = useState([]);
  const [handlerSelectedGroupBy, sethandlerSelectedGroupBy] = useState("");
  const [handlerApplicationName, sethandlerApplicationName] = useState("");
  const [handlerChartType1, sethandlerChartType1] = useState("bar");
  const [handlerChartType2, sethandlerChartType2] = useState("bar");
  const [handlerChartType3, sethandlerChartType3] = useState("line");
  const [handlerChartType4, sethandlerChartType4] = useState("line");

  const onChangeHandlerPeriode = (value, dateString) => {
    if (value == null) {
      sethandlerPeriode1Options("");
      sethandlerPeriode2Options("");
    } else {
      sethandlerPeriode1Options(dateString[0]);
      sethandlerPeriode2Options(dateString[1]);
    }
  };
  const onChangeHandlerPICOption = (event) => {
    if (event == null) {
      sethandlerPICOption("");
    } else {
      sethandlerPICOption(implodeSelect(event));
    }
  };
  const onChangeHandlerCriticalityOption = (event) => {
    if (event == null) {
      sethandlerCriticalityOption("");
    } else {
      sethandlerCriticalityOption(implodeSelect(event));
    }
  };
  const onChangeHandlerGroupByOptions = (event) => {
    sethandlerGroupByOptions(event.value);
    sethandlerSelectedGroupBy(event.label);
  };

  const handleAppChange = (event) => {
    if (event == null) {
      sethandlerApplicationName("");
    } else {
      sethandlerApplicationName(event.label);
    }
  };
  function implodeSelect(arr) {
    var imploded = "";
    arr.forEach((element) => {
      imploded += element.value.replace(/_/g, " ") + "|";
    });
    return imploded.substring(0, imploded.length - 1);
  }

  const [tableData, settableData] = useState(dashboardIncident);

  const [totalIncident, settotalIncident] = useState([]);
  const [totalApplication, settotalApplication] = useState([]);
  const [averageDetectionDuration, setaverageDetectionDuration] = useState([]);
  const [averageSolvedDuration, setaverageSolvedDuration] = useState([]);

  const lblChart = [];
  dashboardIncident.data.map((getLabel) => {
    if (getLabel.hasOwnProperty("Periode")) {
      lblChart.push(getLabel.Periode);
    } else if (getLabel.hasOwnProperty("Criticality")) {
      lblChart.push(getLabel.Criticality);
    } else if (getLabel.hasOwnProperty("RootCause")) {
      lblChart.push(getLabel.RootCause);
    } else if (getLabel.hasOwnProperty("PIC")) {
      lblChart.push(getLabel.PIC);
    } else if (getLabel.hasOwnProperty("Application")) {
      lblChart.push(getLabel.Application);
    }
  });

  const initialChartData1 = {
    labels: lblChart,
    datasets: [
      {
        label: "Total Incident",
        data: dashboardIncident.data.map((d) => d.TotalIncident),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
        order: 1,
      },
      {
        label: "Total Incident",
        data: dashboardIncident.data.map((d) => d.TotalIncident),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
        type: "line",
        order: 0,
      },
    ],
  };
  const initialChartData2 = {
    labels: lblChart,
    datasets: [
      {
        label: "Total Application",
        data: dashboardIncident.data.map((d) => d.TotalApps),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
        order: 1,
      },
      {
        label: "Total Application",
        data: dashboardIncident.data.map((d) => d.TotalApps),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
        type: "line",
        order: 0,
      },
    ],
  };
  const initialChartData3 = {
    labels: lblChart,
    datasets: [
      {
        label: "Average Detection Duration",
        data: dashboardIncident.data.map((d) => d.AverageDetectionDuration),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
      },
    ],
  };
  const initialChartData4 = {
    labels: lblChart,
    datasets: [
      {
        label: "Average Solved Duration",
        data: dashboardIncident.data.map((d) => d.AverageSolvedDuration),
        backgroundColor: palette("tol-rainbow", lblChart.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
      },
    ],
  };

  const [chartData1, setChartData1] = useState(initialChartData1);
  const [chartData2, setChartData2] = useState(initialChartData2);
  const [chartData3, setChartData3] = useState(initialChartData3);
  const [chartData4, setChartData4] = useState(initialChartData4);

  useEffect(() => {
    if (Filter == 1) {
      const response = axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboards/5/report?groupBy=${handlerGroupByOptions}&periodeAwal=${handlerPeriode1Options}&periodeAkhir=${handlerPeriode2Options}&PIC=${handlerPICOption}&CriticalApp=${handlerCriticalityOption}&AppName=${handlerApplicationName}`
        )
        .then((res) => {
          if (res.status === 200) {
            // set data Table
            settableData(res.data);
            // set chart label periode
            const lblChart = [];
            res.data.data.map((getLabel) => {
              if (getLabel.hasOwnProperty("Periode")) {
                lblChart.push(getLabel.Periode);
              } else if (getLabel.hasOwnProperty("Criticality")) {
                lblChart.push(getLabel.Criticality);
              } else if (getLabel.hasOwnProperty("RootCause")) {
                lblChart.push(getLabel.RootCause);
              } else if (getLabel.hasOwnProperty("PIC")) {
                lblChart.push(getLabel.PIC);
              } else if (getLabel.hasOwnProperty("Application")) {
                lblChart.push(getLabel.Application);
              }
            });

            setChartData1({
              labels: lblChart,
              datasets: [
                {
                  label: "Total Incident",
                  data: res.data.data.map((d) => d.TotalIncident),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                  order: 1,
                },
                {
                  label: "Total Incident",
                  data: res.data.data.map((d) => d.TotalIncident),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                  type: "line",
                  order: 0,
                },
              ],
            });
            setChartData2({
              labels: lblChart,
              datasets: [
                {
                  label: "Total Application",
                  data: res.data.data.map((d) => d.TotalApps),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                  order: 1,
                },
                {
                  label: "Total Application",
                  data: res.data.data.map((d) => d.TotalApps),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                  type: "line",
                  order: 0,
                },
              ],
            });
            setChartData3({
              labels: lblChart,
              datasets: [
                {
                  label: "Average Detection Duration",
                  data: res.data.data.map((d) => d.AverageDetectionDuration),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                },
              ],
            });
            setChartData4({
              labels: lblChart,
              datasets: [
                {
                  label: "Average Solved Duration",
                  data: res.data.data.map((d) => d.AverageSolvedDuration),
                  backgroundColor: palette("tol-rainbow", lblChart.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                },
              ],
            });
          } else {
            alert(res.statusText);
          }
        });
      setSelectedGroupBy(handlerSelectedGroupBy);
      setFilter(0);
    }
  });

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Shield - Incident & Problem Management</title>
        </Head>
        <section>
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                          Hello, {user.fullname ? user.fullname : user.username}
                        </h1>
                      </div>
                      <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Company</dt>
                        <dd className="flex items-center text-sm font-medium text-gray-500 capitalize sm:mr-6">
                          <OfficeBuildingIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Application Management &amp; Operation Division
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-1">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Overview
              </h2>
              <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card */}
                {cards.map((card) => (
                  <div
                    key={card.name}
                    className="overflow-hidden bg-white rounded-lg shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <card.icon
                            className="w-6 h-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1 w-0 ml-5">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {card.name}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {card.total}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-gray-50">
                      <div className="text-sm">
                        <Link href={card.href}>
                          <a className="font-medium text-cyan-700 hover:text-cyan-900">
                            {" "}
                            {card.href !== "#"
                              ? "View All"
                              : "Coming Soon"}{" "}
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-1">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Summary Dashboard
              </h2>
              <div className="inline-grid gap-4 p-2 mt-4 bg-white rounded-lg shadow lg:grid-cols-6">
                <div>
                  <label
                    htmlFor="Periode1Options"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Periode
                  </label>
                  <DateRangeFilter onChange={onChangeHandlerPeriode} />
                </div>
                <div>
                  <label
                    htmlFor="GroupByOptions"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Group By
                  </label>
                  <ReactSelect
                    id="GroupByOptions"
                    instanceId={"GroupByOptions"}
                    options={listGroupBy}
                    isClearable
                    className="block w-auto"
                    onChange={onChangeHandlerGroupByOptions}
                  />
                </div>
                <div>
                  <label
                    htmlFor="CriticalityOption"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Criticality
                  </label>
                  <ReactSelect
                    id="CriticalityOption"
                    instanceId={"CriticalityOption"}
                    options={CriticalityOption}
                    isClearable
                    isMulti
                    className="block w-auto"
                    onChange={onChangeHandlerCriticalityOption}
                  />
                </div>
                <div>
                  <label
                    htmlFor="PICOption"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    PIC
                  </label>
                  <ReactSelect
                    id="PICOption"
                    instanceId={"PICOption"}
                    options={PICOption}
                    isClearable
                    isMulti
                    className="block w-auto"
                    onChange={onChangeHandlerPICOption}
                  />
                </div>
                <div>
                  <label
                    htmlFor="ApplicationOption"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Application
                  </label>
                  <AsyncSelect
                    id="ApplicationOption"
                    instanceId={"ApplicationOption"}
                    isClearable
                    loadOptions={loadApplications}
                    styles={styledReactSelectAdd}
                    className="text-sm focus:ring-blue-300 focus:border-blue-300"
                    placeholder="Search App"
                    onChange={handleAppChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="Periode1Options"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    &nbsp;
                  </label>
                  <PrimaryButton onClick={() => setFilter(1)}>
                    SET
                  </PrimaryButton>
                </div>
              </div>
              <div className="inline-grid mt-4 bg-white rounded-lg shadow">
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
                    <ShowChart
                      chartData={chartData1}
                      title={"Total Incident"}
                      chartType={handlerChartType1}
                    />
                  </li>
                  <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
                    <ShowChart
                      chartData={chartData2}
                      title={"Total Impacted Application"}
                      chartType={handlerChartType2}
                    />
                  </li>
                  <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
                    <ShowChart
                      chartData={chartData3}
                      title={"Average Detection Duration (minutes)"}
                      chartType={handlerChartType3}
                    />
                  </li>
                  <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
                    <ShowChart
                      chartData={chartData4}
                      title={"Average Solved Duration (minutes)"}
                      chartType={handlerChartType4}
                    />
                  </li>
                </ul>
              </div>
              <div className="inline-grid mt-4 bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="relative px-6 py-3">
                        {SelectedGroupBy}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        Total Impacted Application
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        Total Incident
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        Average Detection Duration (minutes)
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        Average Solved Duration (minutes)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {typeof tableData === "object" &&
                    Object.keys(tableData).length > 0
                      ? tableData.data.map((dashboard) => (
                          <tr key={dashboard.RowID}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {dashboard[ColumnGroupBy[SelectedGroupBy]]}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
                              {dashboard.TotalApps}
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                              {dashboard.TotalIncident}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                              {dashboard.AverageDetectionDuration}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                              {dashboard.AverageSolvedDuration}
                            </td>
                          </tr>
                        ))
                      : ""}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Home;
