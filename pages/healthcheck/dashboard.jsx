import { useState, useMemo, useEffect } from "react";
import PageHeader from "components/problems/ProblemHeader";
import withSession from "lib/session";
import { DatePicker } from "antd";
import { toast } from "react-hot-toast";

import {
  Card,
  Flex,
  AreaChart,
  Title,
  BarChart,
  LineChart,
} from "@tremor/react";

import axios from "axios";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import Table from "components/ui/table";
import { ProblemChart } from "components/problems/ProblemChart";

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

  const getDashboardhc = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/monitoring`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const dashboardHc = await getDashboardhc.json();

  if (dashboardHc.status === 200) {
    return {
      props: {
        user: user,
        data: dashboardHc.data,
      },
    };
  } else if (dashboardHc.status === 202) {
    return {
      props: {
        user: user,
        data: dashboardHc.data,
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

export default function Dashboard({ user, data }) {
  const RangePicker = DatePicker.RangePicker;
  const lblChartHc = [];
  const lblChartPivotHc = [];
  //const lblChartJsPivotHc = [];

  //data jumlah health check
  data.totalHealthCheck.map((getLabel) => {
    if (getLabel.hasOwnProperty("TotalHealthCheck")) {
      lblChartHc.push(getLabel.DateStringRange);
    }
  });

  //data jumlah pivot metric health check
  // data.totalHealthCheckPivot.map((getLabel) => {
  //   if (getLabel.hasOwnProperty("Passed", "Not Passed", "N/A")) {
  //     lblChartPivotHc.push(getLabel.hcSubmetric.labelFilterSource);
  //   }
  // });

  //const initialChartDataProblems = data.problemsByPeriod;
  const initialChartDataHealthCheck = data.totalHealthCheck;
  //const initialChartDataPivotHealthCheck = data.totalHealthCheckPivot;
  // const initialChartDataPivotHealthCheckbackup = data.totalHealthCheckPivot;

  // const [chartDataProblems, setChartDataProblems] = useState(
  //   initialChartDataProblems
  // );
  const [chartDataHealthCheck, setChartDataHealthCheck] = useState(
    initialChartDataHealthCheck
  );
  // const [chartDataPivotHealthCheck, setChartDataPivotHealthCheck] = useState(
  //   initialChartDataPivotHealthCheck
  // );
  // const initialChartDataPivotHealthCheckbackup = {
  //   labels: lblChartJsPivotHc,
  //   datasets: [
  //     {
  //       label: "",
  //     },
  //   ],
  // };

  const [hit, setHit] = useState(false);
  const [handlerStartPeriodOptions, sethandlerStartPeriodOptions] = useState(
    []
  );
  const [handlerEndPeriodOptions, sethandlerEndPeriodOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data?.totalHealthCheckMetric);
  }, []);

  const onChangeHandlerPeriode = (value, dateString) => {
    const endDate = `${
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    }`;
    sethandlerStartPeriodOptions(dateString[0]);
    sethandlerEndPeriodOptions(dateString[1]);
  };

  const handleGetData = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/monitoring${
          handlerStartPeriodOptions && handlerEndPeriodOptions
            ? `?startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}`
            : ""
        }`
      )
      .then((res) => {
        const dataHit = res.data.data;

        const lblChartHc = [];

        if (res.status == 200) {
          dataHit.totalHealthCheck.map((getLabel) => {
            if (getLabel.hasOwnProperty("DateStringRange")) {
              lblChartHc.push(getLabel.DateStringRange);
            }
          });
          // dataHit.totalHealthCheckPivot.map((getLabel) => {
          //   if (getLabel.hasOwnProperty("Passed", "Not Passed", "N/A")) {
          //     lblChartHc.push(getLabel.hcSubmetric.labelFilterSource);
          //   }
          // });

          // setChartDataProblems(dataHit.problemsByPeriod);
          setChartDataHealthCheck(dataHit.totalHealthCheck);
          // setChartDataPivotHealthCheck(dataHit.totalHealthCheckPivot);
          // setTableData(dataHit.totalHealthCheckMetric);
        } else {
          toast.error("Data not updated for that period");
        }
      });
  };

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Report Number",
  //       accessor: "healthCheckNumber",
  //     },
  //     {
  //       Header: "Application",
  //       accessor: "apps",
  //     },
  //     {
  //       Header: "Function",
  //       accessor: "function",
  //     },
  //     {
  //       Header: "Metric",
  //       accessor: "metric",
  //     },
  //     {
  //       Header: "Submetric",
  //       accessor: "submetric",
  //     },
  //     {
  //       Header: "Target",
  //       accessor: "target",
  //     },
  //     {
  //       Header: "Description Result",
  //       accessor: "description",
  //     },
  //     {
  //       Header: "Result",
  //       accessor: "result",
  //     },
  //     {
  //       Header: "Created at",
  //       accessor: "createdAt",
  //     },
  //   ],
  //   []
  // );

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Dashboard Health Check"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section>
            <PageHeader title="Dashboard Health Check"></PageHeader>
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-4 mt-5">
              <div className="col-span-6 text-center">
                <RangePicker
                  style={{ width: "25vw" }}
                  name="dateRangeHit"
                  id="dateRangeHit"
                  onChange={onChangeHandlerPeriode}
                />
                <button
                  style={{ width: "10%" }}
                  type="button"
                  className="inline-flex justify-center ml-2 py-2 px-2 border border-blue-500 shadow-sm text-sm font-normal rounded-md text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  onClick={() => handleGetData()}
                >
                  Get Data
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-5">
              <div className="xl:col-span-8 sm:col-span-8">
                <Card>
                  <Flex>
                    <Title className="w-full">
                      Total Health Check per Month
                    </Title>
                  </Flex>
                  <LineChart
                    marginTop="mt-10"
                    //  style={{ overflowX: "auto", overflowY: "auto" }}
                    data={chartDataHealthCheck}
                    categories={["TotalHealthCheck"]}
                    dataKey="DateStringRange"
                    colors={["indigo"]}
                    showLegend={false}
                    height="h-96"
                  />
                </Card>
              </div>
            </div>

            {/* <div className="grid grid-cols-1  mt-10">
              <Card>
                <Flex>
                  <Title className="w-full">Metric Health Check</Title>
                </Flex>
                <BarChart
                  marginTop="mt-2"
                  // showXAxis={true}
                  //relative={true}
                  //layout="vertical"
                  showXAxis={true}
                  showYAxis={true}
                  //  style={{ overflowX: "auto" }}
                  data={chartDataPivotHealthCheck}
                  categories={["Passed", "Not Passed", "N/A"]}
                  dataKey="hcSubmetric.labelFilterSource"
                  colors={["emerald", "rose", "orange"]}
                  showLegend={true}
                  showGridLines={true}
                />
              </Card>
            </div> */}

            {/* <div className="grid grid-cols-1 mt-5">
              <div className="mt-3 print:mt-96">
                <h2 className="mb-3 text-lg leading-6 font-medium text-gray-900">
                  Health Check Detail
                </h2>
                <Table
                  columns={columns}
                  data={tableData}
                  initialPageSize={500}
                />
              </div>
            </div> */}
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
