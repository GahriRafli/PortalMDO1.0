import { useEffect, useState, useRef, useMemo } from "react";
import Head from "next/head";
import Layout from "components/layout";
import PageHeader from "components/problems/ProblemHeader";
import withSession from "lib/session";
import { ProblemChart } from "components/problems/ProblemChart";
import DateRangeFilter from "components/incidents/daterange-filter";
import { DatePicker } from "antd";
import palette from "google-palette";
import { useForm } from "react-hook-form";

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

  const periodeData = await getPeriode.json();
  const topData = await getTop.json();
  const typeData = await getType.json();

  if (periodeData.status === 200 && topData.status === 200) {
    return {
      props: {
        user: user,
        data: {
          periode: periodeData.data,
          top: topData.data,
          type: typeData.data.slice(0, 5),
        },
      },
    };
  } else if (periodeData.status === 202 && topData.status === 202) {
    return {
      props: {
        user: user,
        data: {
          periode: periodeData.data,
          top: topData.data,
          type: typeData.data.slice(0, 5),
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

  data.periode.map((getLabel) => {
    if (getLabel.hasOwnProperty("TotalProblemPerPeriode")) {
      lblChartYTD.push(getLabel.DateStringPeriode);
    }
  });

  data.top.map((getLabel) => {
    if (getLabel.app.subName != "Others") {
      lblChartTop.push(getLabel.app.name);
    }
  });

  data.type.map((getLabel) => {
    if (getLabel.hasOwnProperty("TotalTypeImpacted")) {
      lblChartType.push(getLabel.paramType.type);
    }
  });

  // data.map((getLabel) => {
  //   if (getLabel.hasOwnProperty("app")) {
  //     if (getLabel.app.subName != "Others") {
  //       lblChart.push(getLabel.app.name);
  //     }
  //   } else if (getLabel.hasOwnProperty("TotalProblemPerPeriode")) {
  //     lblChart.push(getLabel.DatePeriode);
  //   }
  // });

  const initialChartDataYTD = {
    labels: lblChartYTD,
    datasets: [
      {
        label: "Total Problem Year to Date",
        data: data.periode.map((d) => d.TotalProblemPerPeriode),
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
        data: data.top.map((d) => d.TotalProblemPerApp),
        backgroundColor: palette("tol-dv", lblChartTop.length).map(function (
          hex
        ) {
          return "#" + hex;
        }),
      },
    ],
  };

  const initialChartDataType = {
    labels: lblChartType,
    datasets: [
      {
        label: `Top ${lblChartType.length} Problems Impacted Type`,
        data: data.type.map((d) => d.TotalTypeImpacted),
        backgroundColor: palette("tol-dv", lblChartType.length).map(function (
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

  const [chartDataType, setChartDataType] = useState(initialChartDataType);
  const [handlerChartTypeType, sethandlerChartTypeType] = useState("pie");

  // SKIP DULU DARI SINI. SKIP DULU DARI SINI. SKIP DULU DARI SINI.
  const [Filter, setFilter] = useState(false);
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
  };
  // SKIP SAMPAI SINI. SKIP SAMPAI SINI. SKIP SAMPAI SINI.

  return (
    <>
      <Layout key="LayoutProblem" session={user}>
        <Head>
          <title>Report Problem</title>
        </Head>
        <section>
          <PageHeader title="Report Problem"></PageHeader>

          <div className="grid grid-cols-1 py-2 gap-x-4 gap-y-8 px-4 sm:px-6 lg:px-12 sm:grid-cols-2">
            {/* Card Problem Year to Date */}
            <div className="sm:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-8 py-8">
                  <div id="formHitPeriod" name="formHitPeriod">
                    {/* <form onSubmit={handleSubmit(hitPeriod)}> */}
                    <label
                      htmlFor="StartPeriodOptions"
                      className="block mb-1 text-lg text-center font-medium text-gray-700"
                    >
                      Total Problems Year to Date
                    </label>
                    {/* <RangePicker
                    name="dateRangeUhuy"
                    id="dateRangeUhuy"
                    onChange={onChangeHandlerPeriode}
                  />
                  <button
                    style={{ width: "33%" }}
                    type="button"
                    className="inline-flex justify-center py-2 px-2 border border-blue-500 shadow-sm text-sm font-normal rounded-md text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    onClick={hitPeriod}
                  >
                    Hit!
                  </button>
                  </form> */}
                  </div>
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
            <div className="sm:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-8 py-8">
                  <div id="formHitPeriod" name="formHitPeriod">
                    <label
                      htmlFor="StartPeriodOptions"
                      className="block mb-1 text-lg text-center font-medium text-gray-700"
                    >
                      Top Ten Impacted Apps Year to Date
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
          </div>

          <div className="grid grid-cols-1 py-2 gap-x-4 gap-y-8 px-4 sm:px-6 lg:px-12 sm:grid-cols-2">
            {/* Card Problem Type Pie */}
            <div className="sm:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-8 py-8">
                  <div id="formHitPeriod" name="formHitPeriod">
                    <label
                      htmlFor="StartPeriodOptions"
                      className="block mb-1 text-lg text-center font-medium text-gray-700"
                    >
                      Top {lblChartType.length} Problems Impacted Type
                    </label>
                  </div>
                  <ProblemChart
                    chartData={chartDataType}
                    title={`Top ${lblChartType.length} Problems Impacted Type`}
                    chartType={handlerChartTypeType}
                    onDisplay={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
