import { useState, useRef, useMemo } from "react";
import PageHeader from "components/problems/ProblemHeader";
import withSession from "lib/session";
import { DatePicker } from "antd";
import { toast } from "react-hot-toast";

import {
  Legend,
  Card,
  Flex,
  AreaChart,
  DonutChart,
  BarList,
  BarChart,
  Title,
  Divider,
  Metric,
  Text,
} from "@tremor/react";

import axios from "axios";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
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

  const getDashboardAll = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/all`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const dashboardData = await getDashboardAll.json();

  if (dashboardData.status === 200) {
    return {
      props: {
        user: user,
        data: dashboardData.data,
      },
    };
  } else if (dashboardData.status === 202) {
    return {
      props: {
        user: user,
        data: dashboardData.data,
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

export default function Report({ user, data }) {
  const RangePicker = DatePicker.RangePicker;
  const lblChartProblems = [];
  const lblChartImpacted = [];
  const lblChartFUP = [];
  const lblChartSources = [];

  // ini jumlah problem nya
  data.problemsByPeriod.map((getLabel) => {
    if (getLabel.hasOwnProperty("TotalProblemPerPeriode")) {
      lblChartProblems.push(getLabel.DateStringPeriode);
    }
  });

  // ini app impact nya
  data.impactedByPeriod.map((getLabel) => {
    if (getLabel.app.name != "Others") {
      lblChartImpacted.push(getLabel.app.name);
    }
  });

  //ini follow up plan nya
  data.fupByPeriod.map((getLabel) => {
    if (getLabel.hasOwnProperty("followUp")) {
      lblChartFUP.push(getLabel.followUp.label);
    }
  });

  // ini problem source nya
  data.problemsSource.map((getLabel) => {
    if (getLabel.hasOwnProperty("problemSource")) {
      lblChartSources.push(getLabel.problemSource.label);
    }
  });

  const initialChartDataProblems = data.problemsByPeriod;
  const initialChartDataTotalAllProblems = data.totalProblem;
  const initialChartDataImpacted = {
    labels: lblChartImpacted,
    datasets: [
      {
        label: "Total Problems Impacted",
        data: data.impactedByPeriod.map((d) => d.TotalProblemPerApp),
        backgroundColor: "#14b8a6",
      },
    ],
  };
  const initialChartDataTypes = data.problemsType;
  const initialChartDataFUP = data.fupByPeriod.map((item) => ({
    name: `${item.followUp.filterLabelFUP}`,
    value: item.TotalProblemPerFollowup,
  }));
  const initialChartDataSources = data.problemsSource.map((item) => ({
    name: `${item.problemSource.label}`,
    value: item.TotalProblemPerSource,
  }));
  const initialDataAssignee = data.assigneeByPeriod.map((item) => ({
    name: `${item.assigned_to.fullName} (${item.PercentageOfAssignee})`,
    value: item.TotalProblemPerAssignee,
  }));

  const [chartDataProblems, setChartDataProblems] = useState(
    initialChartDataProblems
  );
  const [chartDataTotalAllProblems, setChartDataTotalAllProblems] = useState(
    initialChartDataTotalAllProblems
  );
  const [chartDataImpacted, setChartDataImpacted] = useState(
    initialChartDataImpacted
  );
  const [chartDataFUP, setChartDataFUP] = useState(initialChartDataFUP);
  const [countDataAssignee, setDataAssignee] = useState(initialDataAssignee);
  const [chartDataSources, setChartDataSources] = useState(
    initialChartDataSources
  );
  const [chartDataTypes, setChartDataType] = useState(initialChartDataTypes);

  // SKIP DULU DARI SINI. SKIP DULU DARI SINI. SKIP DULU DARI SINI.
  const [hit, setHit] = useState(false);
  const [handlerStartPeriodOptions, sethandlerStartPeriodOptions] = useState(
    []
  );
  const [handlerEndPeriodOptions, sethandlerEndPeriodOptions] = useState([]);

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
        `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/all${
          handlerStartPeriodOptions && handlerStartPeriodOptions
            ? `?startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}`
            : ""
        }`
      )
      .then((res) => {
        const dataHit = res.data.data;
        const lblChartProblems = [];
        const lblChartImpacted = [];
        const lblChartFUP = [];
        const lblChartSources = [];
        countDataAssignee = [];
        if (res.status == 200) {
          dataHit.problemsByPeriod.map((getLabel) => {
            if (getLabel.hasOwnProperty("DateStringPeriode")) {
              lblChartProblems.push(getLabel.DateStringPeriode);
            }
          });

          dataHit.impactedByPeriod.map((getLabel) => {
            let check = getLabel.app;
            if (check != null) {
              if (check.subName != "Others") {
                lblChartImpacted.push(check.name);
              }
            }
            // if (getLabel.app.subName != "Others") {
            //   lblChartImpacted.push(getLabel.app.subName);
            // }
          });

          dataHit.fupByPeriod.map((getLabel) => {
            if (getLabel.hasOwnProperty("followUp")) {
              lblChartFUP.push(getLabel.followUp.label);
            }
          });

          dataHit.problemsSource.map((getLabel) => {
            if (getLabel.hasOwnProperty("problemSource")) {
              lblChartSources.push(getLabel.problemSource.label);
            }
          });

          setChartDataProblems(dataHit.problemsByPeriod);
          setChartDataTotalAllProblems(dataHit.totalProblem);
          setChartDataImpacted({
            labels: lblChartImpacted,
            datasets: [
              {
                label: "Total Problems Impacted",
                data: dataHit.impactedByPeriod.map((d) => d.TotalProblemPerApp),
                backgroundColor: "#14b8a6",
              },
            ],
          });
          setChartDataType(dataHit.problemsType);
          setChartDataFUP(
            dataHit.fupByPeriod.map((item) => ({
              name: `${item.followUp.filterLabelFUP}`,
              value: item.TotalProblemPerFollowup,
            }))
          );
          setChartDataSources(
            dataHit.problemsSource.map((item) => ({
              name: `${item.problemSource.label}`,
              value: item.TotalProblemPerSource,
            }))
          );
          setDataAssignee(
            dataHit.assigneeByPeriod.map((item) => ({
              name: `${item.assigned_to.fullName} (${item.PercentageOfAssignee})`,
              value: item.TotalProblemPerAssignee,
            }))
          );
        } else {
          toast.error("Data not updated for that period");
        }
      });
  };

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Monitoring Problem"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section>
            <PageHeader title="Monitoring Problem"></PageHeader>
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-4">
              <div className="col-span-6 text-center">
                <RangePicker
                  style={{ width: "25vw" }}
                  name="dateRangeUhuy"
                  id="dateRangeUhuy"
                  onChange={onChangeHandlerPeriode}
                  showTime={true}
                  showSecond={false}
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

              {/* Card Problems By Period */}
              <div className="xl:col-span-4 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">Total Problems per Month</Title>
                  </Flex>
                  <AreaChart
                    marginTop="mt-4"
                    data={chartDataProblems}
                    categories={["TotalProblemPerPeriode"]}
                    dataKey="DateStringPeriode"
                    colors={["teal"]}
                    showLegend={false}
                    height="h-96"
                  />
                </Card>
              </div>

              {/* Card Most Impacted Systems */}
              <div className="xl:col-span-2 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">Impacted Systems</Title>
                  </Flex>
                  <Text className="mt-8">Total Problems</Text>
                  <Metric>{chartDataTotalAllProblems}</Metric>
                  <Divider />
                  <div className="py-2">
                    <Legend
                      categories={
                        Array.isArray(chartDataTypes) === true
                          ? chartDataTypes.map((d) => d.paramType.type)
                          : []
                      }
                    />
                  </div>
                  <DonutChart
                    label={true}
                    data={chartDataTypes}
                    dataKey="paramType.type"
                    category="TotalProblemPerType"
                    colors={["cyan", "sky", "indigo", "violet", "purple"]}
                    height="h-60"
                  />
                </Card>
              </div>

              {/* Card Assignee */}
              <div className="xl:col-span-2 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">
                      Total Problems per Assignee
                    </Title>
                  </Flex>
                  <div className="mt-4 pr-4 overflow-y-auto h-[54vh]">
                    <BarList data={countDataAssignee} color="violet" />
                  </div>
                </Card>
              </div>

              {/* Card Most Impacted Apps */}
              <div className="xl:col-span-4 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">Most Impacted Application</Title>
                  </Flex>
                  <div className="mt-4">
                    <ProblemChart
                      chartData={chartDataImpacted}
                      title={"Top Ten Impacted Apps Year to Date"}
                      chartType={"bar"}
                      onDisplay={false}
                      stringLimit={
                        chartDataImpacted.datasets[0].data.length > 5 ? 15 : 100
                      }
                    />
                  </div>
                </Card>
              </div>

              {/* Card Follow Up Plan */}
              <div className="xl:col-span-3 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">Most Follow Up Plan</Title>
                  </Flex>
                  <div className="mt-4 pr-4">
                    <BarList data={chartDataFUP} color="pink" />
                  </div>
                </Card>
              </div>

              {/* Problem Source */}
              <div className="xl:col-span-3 sm:col-span-6">
                <Card>
                  <Flex>
                    <Title className="w-full">Problem Source</Title>
                  </Flex>
                  <div className="mt-4 pr-4">
                    <BarList data={chartDataSources} color="violet" />
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
