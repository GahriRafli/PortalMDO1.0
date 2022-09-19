import { useEffect, useState, useRef, useMemo } from "react";
import Head from "next/head";
import Layout from "components/layout";
import PageHeader from "components/problems/ProblemHeader";
import withSession from "lib/session";
import { ProblemChart } from "components/problems/ProblemChart";
import { DatePicker } from "antd";
import palette from "google-palette";
import { get, useForm } from "react-hook-form";
import ProblemCounter from "components/problems/ProblemCounter";

import axios from "axios";

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

  const getPeriode = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/periode`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const getTop = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/toptenproblem`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const getType = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/toptenimpacted`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const getCountFUP = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/topfollowup`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );

  const getCountAssignee = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/topassignee`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  
  const dashboardData = await getDashboardAll.json()
  const periodeData = await getPeriode.json();
  const topData = await getTop.json();
  const typeData = await getType.json();
  const fupData = await getCountFUP.json();
  const assigneeData = await getCountAssignee.json();

  if (dashboardData.status === 200 && assigneeData.status === 200) {
    return {
      props: {
        user: user,
        data: {
          // periode: periodeData.data,
          // top: topData.data,
          // type: typeData.data.slice(0, 5),
          // fup: fupData.data,
          dashboard: dashboardData.data,
          assignee: assigneeData.data,
        },
      },
    };
  } else if (dashboardData.status === 202 && assigneeData.status === 202) {
    return {
      props: {
        user: user,
        data: {
          // periode: periodeData.data,
          // top: topData.data,
          // type: typeData.data.slice(0, 5),
          // fup: fupData.data,
          dashboard: dashboardData.data,
          assignee: assigneeData.data,
        },
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
  const { handleSubmit } = useForm();
  const lblChartYTD = [];
  const lblChartTop = [];
  const lblChartType = [];

  // ini jumlah problem nya
  data.dashboard.topYeartoDate.map((getLabel) => {
    if (getLabel.hasOwnProperty("TotalProblemPerPeriode")) {
      lblChartYTD.push(getLabel.DateStringPeriode);
    }
  });

  // ini app impact nya
  data.dashboard.topTen.map((getLabel) => {
    if (getLabel.app.subName != "Others") {
      // lblChartTop.push(getLabel.app.name);
      lblChartTop.push(getLabel.app.subName);
    }
  });

  const initialChartDataYTD = {
    labels: lblChartYTD,
    datasets: [
      {
        label: "Total Problem Year to Date",
        data: data.dashboard.topYeartoDate.map((d) => d.TotalProblemPerPeriode),
        backgroundColor: palette("tol-dv", lblChartYTD.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
        borderColor: "#afafaf8c",
        tension: 0.2,
      },
    ],
  };

  const initialChartDataTop = {
    labels: lblChartTop,
    datasets: [
      {
        label: `Top Ten Impacted Apps Year to Date`,
        data: data.dashboard.topTen.map((d) => d.TotalProblemPerApp),
        backgroundColor: palette("tol-dv", lblChartTop.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
      },
    ],
  };

  const [chartDataYTD, setChartDataYTD] = useState(initialChartDataYTD);
  const [handlerChartTypeYTD, sethandlerChartTypeYTD] = useState("line");

  const [chartDataTop, setChartDataTop] = useState(initialChartDataTop);
  const [handlerChartTypeTop, sethandlerChartTypeTop] = useState("bar");

  // const [chartDataType, setChartDataType] = useState(initialChartDataType);
  const [handlerChartTypeType, sethandlerChartTypeType] = useState("pie");

  // SKIP DULU DARI SINI. SKIP DULU DARI SINI. SKIP DULU DARI SINI.
  const [hit, setHit] = useState(false);
  const [handlerStartPeriodOptions, sethandlerStartPeriodOptions] = useState(
    []
  );
  const [handlerEndPeriodOptions, sethandlerEndPeriodOptions] = useState([]);

  const onChangeHandlerPeriode = (value, dateString) => {
    if (value == null) {
      sethandlerStartPeriodOptions("");
      sethandlerEndPeriodOptions("");
    } else {
      sethandlerStartPeriodOptions(dateString[0]);
      sethandlerEndPeriodOptions(dateString[1]);
    }
  };

  const hitPeriod = async (data, event, value, dateString) => {
    if (value == null) {
      sethandlerStartPeriodOptions("");
      sethandlerEndPeriodOptions("");
    } else {
      sethandlerStartPeriodOptions(dateString[0]);
      sethandlerEndPeriodOptions(dateString[1]);
    }
    let objPeriod = {
      start: handlerStartPeriodOptions,
      end: handlerEndPeriodOptions,
    };
    // objPeriod dah mashookk
  };
  // SKIP SAMPAI SINI. SKIP SAMPAI SINI. SKIP SAMPAI SINI.
  useEffect(() => {
    if (hit == true) {
      const hitPeriode = axios
        .get(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/dashboard/all?startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}`
        )
        .then((res) => {
          const lblChartYTD = [];
          const lblChartTop = [];
          if (res.status == 200) {
            res.data.data.topYeartoDate.map((getLabel) => {
              if (getLabel.hasOwnProperty("DateStringPeriode")) {
                lblChartYTD.push(getLabel.DateStringPeriode);
              }
            });

            res.data.data.topTen.map((getLabel) => {
              if (getLabel.app.subName != "Others") {
                lblChartTop.push(getLabel.app.subName);
              }
            });

            setChartDataYTD({
              labels: lblChartYTD,
              datasets: [
                {
                  label: "Total Problems with Period",
                  data: res.data.data.topYeartoDate.map(
                    (d) => d.TotalProblemPerPeriode
                  ),
                  backgroundColor: palette(
                    "tol-rainbow",
                    lblChartYTD.length
                  ).map(function (hex) {
                    return "#" + hex;
                  }),
                },
              ],
            });

            setChartDataTop({
              labels: lblChartTop,
              datasets: [
                {
                  label: `Top Ten Impacted Apps Year to Date`,
                  data: res.data.data.topTen.map((d) => d.TotalProblemPerApp),
                  backgroundColor: palette("tol-dv", lblChartTop.length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  ),
                },
              ],
            });

          }
        });
      setHit(false);
    }
  });

  return (
    <>
      <Layout key="LayoutProblem" session={user}>
        <Head>
          <title>Monitoring Problem</title>
        </Head>
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
                onClick={() => setHit(true)}
              >
                Get Data
              </button>
            </div>

            {/* Card Problem Year to Date */}
            <div className="col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-8 py-8">
                  <label
                    htmlFor="TotalProblems"
                    className="block mb-1 text-lg text-center font-medium text-gray-700"
                  >
                    Total Problems with Period
                  </label>
                  <ProblemChart
                    chartData={chartDataYTD}
                    title={"Total Problem Year to Date"}
                    chartType={handlerChartTypeYTD}
                    onDisplay={false}
                  />
                </div>
              </div>
            </div>

            {/* Card Problem Top Ten */}
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
                    chartData={chartDataTop}
                    title={"Top Ten Impacted Apps Year to Date"}
                    chartType={handlerChartTypeTop}
                    onDisplay={false}
                  />
                </div>
              </div>
            </div>

            {/* Follow Up Plan */}
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
                  {console.log(data.dashboard.topFollowup)}
                  {data.dashboard.topFollowup.map((result, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 text-md text-gray-500">
                      <div className="col-span-1">
                        <span className="font-bold">
                          {/* {result.followUp.label} */}
                        </span>
                      </div>
                      <div className="col-span-1 text-right">
                        <ProblemCounter
                          key={index}
                          end={result.TotalProblemPerFollowUp}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div className="col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-8 py-8">
                  <div id="formHitPeriod" name="formHitPeriod">
                    <label
                      htmlFor="EachAssignee"
                      className="block mb-1 text-lg text-center font-medium text-gray-700"
                    >
                      Total Problem Each Member
                    </label>
                  </div>

                  {data.assignee.map((result, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 text-md text-gray-500">
                      <div className="col-span-1 font-bold">
                        {result.assigned_to.fullName}
                      </div>
                      <div className="col-span-1 text-right">
                        <span>
                          <ProblemCounter
                            key={index}
                            end={result.TotalProblemPerAssignee}
                          />
                          {` (${result.PercentageOfAssignee})`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
