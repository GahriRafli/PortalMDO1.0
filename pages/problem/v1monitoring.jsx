import { useState, useRef, useMemo } from "react";
import PageHeader from "components/problems/ProblemHeader";
import withSession from "lib/session";
import { ProblemChart } from "components/problems/ProblemChart";
import { DatePicker } from "antd";
import palette from "google-palette";
//import { toast } from "react-toastify";
import { toast } from "react-hot-toast";
import { UserCircleIcon } from "@heroicons/react/solid";

import axios from "axios";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

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
    if (getLabel.app.subName != "Others") {
      lblChartImpacted.push(getLabel.app.subName);
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

  const initialChartDataProblems = {
    labels: lblChartProblems,
    datasets: [
      {
        label: "Total Problems",
        data: data.problemsByPeriod.map((d) => d.TotalProblemPerPeriode),
        backgroundColor: palette("tol-rainbow", lblChartProblems.length).map(
          function (hex) {
            return "#" + hex;
          }
        ),
        borderColor: "#afafaf8c",
        // tension: 0.2,
      },
    ],
  };

  const initialChartDataImpacted = {
    labels: lblChartImpacted,
    datasets: [
      {
        label: "Total Problems Impacted",
        data: data.impactedByPeriod.map((d) => d.TotalProblemPerApp),
        backgroundColor: palette("cb-RdYlBu", lblChartImpacted.length).map(
          function (hex) {
            return "#" + hex;
          }
        ),
      },
    ],
  };

  const initialChartDataFUP = {
    labels: lblChartFUP,
    datasets: [
      {
        label: "Total Follow Up",
        data: data.fupByPeriod.map((d) => d.TotalProblemPerFollowup),
        backgroundColor: palette("tol-rainbow", lblChartFUP.length).map(
          function (
            //  backgroundColor: palette("cb-RdYlBu", lblChartFUP.length).map(function (
            hex
          ) {
            return "#" + hex;
          }
        ),
        borderColor: "#afafaf8c",
      },
    ],
  };

  const initialChartDataSources = {
    labels: lblChartSources,
    datasets: [
      {
        label: "Problem Source",
        data: data.problemsSource.map((d) => d.TotalProblemPerSource),
        backgroundColor: palette("tol-rainbow", lblChartSources.length).map(
          function (hex) {
            return "#" + hex;
          }
        ),
      },
    ],
  };

  const initialDataAssignee = data.assigneeByPeriod;

  const [chartDataProblems, setChartDataProblems] = useState(
    initialChartDataProblems
  );
  const [chartDataImpacted, setChartDataImpacted] = useState(
    initialChartDataImpacted
  );
  const [chartDataFUP, setChartDataFUP] = useState(initialChartDataFUP);

  const [countDataAssignee, setDataAssignee] = useState(initialDataAssignee);

  const [chartDataSources, setChartDataSources] = useState(
    initialChartDataSources
  );

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
            if (getLabel.app.subName != "Others") {
              lblChartImpacted.push(getLabel.app.subName);
            }
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

          setChartDataProblems({
            labels: lblChartProblems,
            datasets: [
              {
                label: "Total Problems",
                data: dataHit.problemsByPeriod.map(
                  (d) => d.TotalProblemPerPeriode
                ),
                backgroundColor: palette(
                  "tol-rainbow",
                  lblChartProblems.length
                ).map(function (hex) {
                  return "#" + hex;
                }),
                borderColor: "#afafaf8c",
                // tension: 0.2,
              },
            ],
          });

          setChartDataImpacted({
            labels: lblChartImpacted,
            datasets: [
              {
                label: "Total Problems Impacted",
                data: dataHit.impactedByPeriod.map((d) => d.TotalProblemPerApp),
                backgroundColor: palette(
                  "cb-RdYlBu",
                  lblChartImpacted.length
                ).map(function (hex) {
                  return "#" + hex;
                }),
              },
            ],
          });

          setChartDataFUP({
            labels: lblChartFUP,
            datasets: [
              {
                label: "Total Follow Up",
                data: dataHit.fupByPeriod.map((d) => d.TotalProblemPerFollowup),
                backgroundColor: palette("tol-rainbow", lblChartFUP.length).map(
                  function (hex) {
                    return "#" + hex;
                  }
                ),
                borderColor: "#afafaf8c",
              },
            ],
          });

          setChartDataSources({
            labels: lblChartSources,
            datasets: [
              {
                label: "Problem Source",
                data: dataHit.problemsSource.map(
                  (d) => d.TotalProblemPerSource
                ),
                backgroundColor: palette(
                  "tol-rainbow",

                  lblChartSources.length
                ).map(function (hex) {
                  return "#" + hex;
                }),
              },
            ],
          });

          setDataAssignee(dataHit.assigneeByPeriod);
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
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-4 px-8">
              <div
                className="col-span-2 text-center"
                id="formHitPeriod"
                name="formHitPeriod"
              >
                <RangePicker
                  style={{ width: "25vw" }}
                  name="dateRangeUhuy"
                  id="dateRangeUhuy"
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

              {/* Card Problems By Period */}
              <div className="col-span-1">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-8 py-8">
                    <label
                      htmlFor="TotalProblems"
                      className="block mb-1 text-lg text-center font-medium text-gray-700"
                    >
                      Total Problems per Month
                    </label>
                    <ProblemChart
                      chartData={chartDataProblems}
                      title={"Total Problem Year to Date"}
                      chartType={"line"}
                      onDisplay={false}
                      // stringLimit={
                      //   chartDataProblems.datasets[0].data.length > 6 ? 5 : 100
                      // }
                    />
                  </div>
                </div>
              </div>

              {/* CATATAN PENGEMBANGAN SELANJUTNYA */}
              {/* Card Most Impacted Apps */}
              <div className="col-span-1">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-8 py-8">
                    <div id="formHitPeriod" name="formHitPeriod">
                      <label
                        htmlFor="ImpactedApps"
                        className="block mb-1 text-lg text-center font-medium text-gray-700"
                      >
                        Most Impacted Application
                      </label>
                    </div>
                    <ProblemChart
                      chartData={chartDataImpacted}
                      title={"Top Ten Impacted Apps Year to Date"}
                      chartType={"bar"}
                      onDisplay={false}
                      // stringLimit={
                      //   chartDataImpacted.datasets[0].data.length > 5 ? 15 : 100
                      // }
                    />
                  </div>
                </div>
              </div>

              {/* Card Follow Up Plan */}
              <div className="col-span-1">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-8 py-8">
                    <div id="formHitPeriod" name="formHitPeriod">
                      <label
                        htmlFor="FollowUpPlan"
                        className="block mb-1 text-lg text-center font-medium text-gray-700"
                      >
                        Most Follow Up Plan
                      </label>
                    </div>
                    <ProblemChart
                      chartData={chartDataFUP}
                      title={"Most Follow Up Plan"}
                      chartType={"bar"}
                      onDisplay={false}
                      indexAxis={"y"}
                    />
                  </div>
                </div>
              </div>

              {/* Problem Source */}
              <div className="col-span-1">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-8 py-8">
                    <div id="formHitPeriod" name="formHitPeriod">
                      <label
                        htmlFor="FollowUpPlan"
                        className="block mb-1 text-lg text-center font-medium text-gray-700"
                      >
                        Problem Source
                      </label>
                    </div>
                    <ProblemChart
                      chartData={chartDataSources}
                      title={"Problem Source"}
                      chartType={"bar"}
                      onDisplay={false}
                      indexAxis={"y"}
                    />
                  </div>
                </div>
              </div>

              {/* Card Assignee */}
              {/* <div className="col-span-2"> */}
              <div className="col-span-2">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-8 py-8 mb-10">
                    <div id="formHitPeriod" name="formHitPeriod">
                      <label
                        htmlFor="EachAssignee"
                        className="block mb-1 text-lg text-center font-medium text-gray-700"
                      >
                        Total Problems per Assignee
                      </label>
                    </div>

                    {countDataAssignee.map((result, index) => (
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 text-md text-gray-500"
                        key={index}
                      >
                        <div className="col-span-1 font-medium">
                          <span className="flex items-center justify-between min-w-0 space-x-3">
                            <UserCircleIcon
                              className="w-7 h-7"
                              aria-hidden="true"
                            />
                            <span className="flex flex-col flex-1 min-w-0">
                              {result.assigned_to.fullName}
                            </span>
                          </span>
                        </div>
                        <div className="col-span-1 text-right">
                          {result.TotalProblemPerAssignee} (
                          {result.PercentageOfAssignee})
                          {/* <span>
                          <ProblemCounter
                            key={index}
                            end={result.TotalProblemPerAssignee}
                          />
                          {` `}
                        </span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
