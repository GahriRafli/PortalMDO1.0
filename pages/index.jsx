import { useState, useEffect } from "react";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import withSession from "lib/session";
import { Verified } from "components/ui/svg/verified-icon";
import { OfficeBuildingIcon, UserCircleIcon } from "@heroicons/react/solid";
import {
  ShieldCheckIcon,
  FireIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";
import { StatsWithIcon } from "components/ui/stats/stats-with-icon";
import { DefaultCard } from "components/ui/card/default-card";
import DateRangeFilter from "components/incidents/daterange-filter";
import { ReactSelect } from "components/ui/forms";
import AsyncSelect from "react-select/async";
import { getNickName, styledReactSelect } from "components/utils";
import { ShowChart } from "components/chart";
import palette from "google-palette";
import { format, getYear } from "date-fns";
import axios from "axios";
import { getApplication, getCriticalityApp, useAxios } from "lib/api-helper";
import { toast } from "react-toastify";

const initialChartData = {
  groupBy: "Periodic",
  periodeAwal: format(new Date(getYear(new Date()), 0, 1), "yyyy-MM-dd"),
  periodeAkhir: format(new Date(), "yyyy-MM-dd"),
  criticality: null,
  application: null,
};

const groupByParam = [
  { value: "Periodic", label: "Periode" },
  { value: "CritApps", label: "Criticality" },
  { value: "RootCause", label: "RootCause" },
  { value: "PIC", label: "PIC" },
  { value: "Application", label: "Application" },
];

export default function Home({ user, statsIncidentData, chartIncidentData }) {
  const cards = [
    {
      name: "Incidents Open",
      href: "/incidents",
      icon: ShieldCheckIcon,
      value: statsIncidentData.data.jumlah,
    },
    {
      name: "Problem Management",
      href: "/problem",
      icon: FireIcon,
      value: 0,
    },
    {
      name: "Ticket Open",
      href: "#",
      icon: ChatAlt2Icon,
      value: 0,
    },
  ];

  // Master data dashboard incident is here
  const [dashboardIncidentData, setDashboardIncidentData] = useState(
    chartIncidentData.data
  );
  const [filterOptions, setFilterOptions] = useState({
    groupBy: [],
    criticality: [],
    application: [],
  });
  const [filterData, setFilterData] = useState(initialChartData);
  const [chartLabels, setChartLabels] = useState(
    dashboardIncidentData.map((d) => d.Periode2)
  );

  function getChartBgColor(length) {
    return palette("tol-rainbow", length).map(function (hex) {
      return "#" + hex;
    });
  }

  // Get list Criticality App
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/8/report`)
      .then((res) => {
        const optionsData = res.data.data.map((d) => ({
          value: d.criticality_app,
          label: d.criticality_app_desc,
        }));
        setFilterOptions((filterOptions) => ({
          ...filterOptions,
          criticality: optionsData,
        }));
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  // Get list Application
  const loadApplications = (value, callback) => {
    getApplication(value, callback);
  };

  // Get Dashboard data
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/5/report?groupBy=${
          filterData.groupBy
        }&periodeAwal=${filterData.periodeAwal}&periodeAkhir=${
          filterData.periodeAkhir
        }&PIC=&CriticalApp=${
          !filterData.criticality ? "" : filterData.criticality
        }&AppName=${!filterData.application ? "" : filterData.application}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((res) => {
        const newDasboardIncidentData = res.data.data;
        const newChartLabel = [];
        newDasboardIncidentData.map((d) => {
          if (d.hasOwnProperty("Periode")) {
            newChartLabel.push(d.Periode2);
          } else if (d.hasOwnProperty("Criticality")) {
            newChartLabel.push(d.Criticality);
          } else if (d.hasOwnProperty("RootCause")) {
            newChartLabel.push(d.RootCause);
          } else if (d.hasOwnProperty("PIC")) {
            newChartLabel.push(d.PIC);
          } else if (d.hasOwnProperty("Application")) {
            newChartLabel.push(d.Application);
          } else {
            return false;
          }
        });
        setChartLabels(newChartLabel);
        setDashboardIncidentData(newDasboardIncidentData);
      })
      .catch((err) => alert(err));
  }, [
    filterData.periodeAwal,
    filterData.periodeAkhir,
    filterData.criticality,
    filterData.groupBy,
    filterData.application,
  ]);

  const totalIncidentChart = {
    labels: chartLabels,
    datasets: [
      {
        data: dashboardIncidentData.map((d) => d.TotalIncident),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        order: 0,
      },
      {
        data: dashboardIncidentData.map((d) => d.TotalIncident),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        type: "line",
        order: 0,
      },
    ],
  };

  const totalImpactedAppChart = {
    labels: chartLabels,
    datasets: [
      {
        data: dashboardIncidentData.map((d) => d.TotalApps),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        order: 0,
      },
      {
        data: dashboardIncidentData.map((d) => d.TotalApps),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        type: "line",
        order: 0,
      },
    ],
  };

  const mttdChart = {
    labels: chartLabels,
    datasets: [
      {
        data: dashboardIncidentData.map((d) => d.AverageDetectionDuration),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        order: 0,
      },
    ],
  };

  const mttrChart = {
    labels: chartLabels,
    datasets: [
      {
        data: dashboardIncidentData.map((d) => d.AverageSolvedDuration),
        backgroundColor: getChartBgColor(dashboardIncidentData.length),
        order: 0,
      },
    ],
  };

  const handleDateRangeFilter = (value, dateString) => {
    if (!value) {
      setFilterData((filterData) => ({
        ...filterData,
        periodeAwal: initialChartData.periodeAwal,
        periodeAkhir: initialChartData.periodeAkhir,
      }));
    } else {
      const periodeAwal = dateString[0];
      const periodeAkhir = dateString[1];

      setFilterData((filterData) => ({
        ...filterData,
        periodeAwal: periodeAwal,
        periodeAkhir: periodeAkhir,
      }));
    }
  };

  const handleGroupByFilter = (props) => {
    if (!props) {
      setFilterData((filterData) => ({
        ...filterData,
        groupBy: initialChartData.groupBy,
      }));
    } else {
      setFilterData((filterData) => ({
        ...filterData,
        groupBy: props.value,
      }));
    }
  };

  const handleCriticalityFilter = (props) => {
    if (!props) {
      setFilterData((filterData) => ({
        ...filterData,
        criticality: initialChartData.criticality,
      }));
    } else {
      setFilterData((filterData) => ({
        ...filterData,
        criticality: props.value,
      }));
    }
  };

  const handleAppFilter = (props) => {
    if (!props) {
      setFilterData((filterData) => ({
        ...filterData,
        application: initialChartData.application,
      }));
    } else {
      setFilterData((filterData) => ({
        ...filterData,
        application: props.label,
      }));
    }
  };

  return (
    <LayoutPage session={user} pageTitle="Home Dashboard - Shield">
      <LayoutPageHeader>
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            {/* Profile */}
            <div className="flex items-center">
              {/* <img
                className="hidden h-16 w-16 rounded-full sm:block"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                alt=""
              /> */}
              {/* <UserCircleIcon className="h-16 w-16 text-gray-500 sm:block" /> */}
              <img
                loading="lazy"
                className="h-16 w-16 text-gray-500 sm:block"
                src={user.photo}
                alt="User Proflie"
              />
              <div>
                <div className="flex items-center">
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                    Welcome back,{" "}
                    {user.fullname ? getNickName(user.fullname) : user.username}{" "}
                    👋🏻
                  </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Company</dt>
                  <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                    <OfficeBuildingIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Bank Rakyat Indonesia
                  </dd>
                  <dt className="sr-only">Account status</dt>
                  <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                    <Verified
                      className="flex-shrink-0 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Verified Bristars account
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            {/* You can add component in right section here */}
          </div>
        </div>
      </LayoutPageHeader>
      <LayoutPageContent>
        <div>
          <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-1">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Genneral Report
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card */}
              {cards.map((card) => (
                <StatsWithIcon
                  key={card.name}
                  name={card.name}
                  icon={card.icon}
                  href={card.href}
                  value={card.value}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 pb-8">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Incident Report
            </h2>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <DateRangeFilter onChange={handleDateRangeFilter} />
              </div>
              <div>
                <ReactSelect
                  placeholder="Group By"
                  instanceId={"groupBy"}
                  options={groupByParam}
                  isSearchable={false}
                  isClearable
                  onChange={handleGroupByFilter}
                />
              </div>
              <div>
                <ReactSelect
                  placeholder="Criticality"
                  instanceId={"criticality"}
                  options={filterOptions.criticality}
                  isSearchable={false}
                  isClearable
                  onChange={handleCriticalityFilter}
                />
              </div>
              <div>
                <AsyncSelect
                  placeholder="Application"
                  styles={styledReactSelect}
                  className="text-sm focus:ring-blue-300 focus:border-blue-300"
                  instanceId={"application"}
                  loadOptions={loadApplications}
                  isClearable
                  onChange={handleAppFilter}
                />
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 xxl:grid-cols-5">
              <div className="col-span-2">
                <DefaultCard title="Total Incident">
                  <ShowChart chartData={totalIncidentChart} chartType="bar" />
                </DefaultCard>
                <DefaultCard
                  title="Average Detection Duration"
                  subtitle="Data in minutes"
                >
                  <ShowChart chartData={mttdChart} chartType="line" />
                </DefaultCard>
              </div>
              <div className="col-span-2">
                <DefaultCard title="Total Impacted Application">
                  <ShowChart
                    chartData={totalImpactedAppChart}
                    chartType="bar"
                  />
                </DefaultCard>
                <DefaultCard
                  title="Average Solved Duration"
                  subtitle="Data in minutes"
                >
                  <ShowChart chartData={mttrChart} chartType="line" />
                </DefaultCard>
              </div>
              <div>
                <DefaultCard>
                  <h1>Recent Activity</h1>
                  <p className="text-xs font-normal text-gray-500">
                    No Activity found
                  </p>
                </DefaultCard>
              </div>
            </div>
          </div>
        </div>
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
        permmanent: false,
      },
    };
  }

  const myApi = {
    url: process.env.NEXT_PUBLIC_API_URL,
    headers: { Authorization: `Bearer ${user.accessToken}` },
  };

  const getChartIncidentData = await fetch(
    `${myApi.url}/dashboards/5/report?groupBy=${initialChartData.groupBy}&periodeAwal=${initialChartData.periodeAwal}&periodeAkhir=${initialChartData.periodeAkhir}&PIC=&CriticalApp=&AppName=`,
    {
      headers: myApi.headers,
    }
  );
  const chartIncidentData = await getChartIncidentData.json();

  res = await fetch(`${myApi.url}/dashboards/1/report`, {
    headers: myApi.headers,
  });
  const statsIncidentData = await res.json();

  if (res.status === 200) {
    return {
      props: {
        user: req.session.get("user"),
        statsIncidentData: statsIncidentData,
        chartIncidentData: chartIncidentData,
      },
    };
  }
});
