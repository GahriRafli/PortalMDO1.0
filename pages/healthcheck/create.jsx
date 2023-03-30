import { useState, useEffect } from "react";
import axios from "axios";
import { styledReactSelectAdd } from "components/utils";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-hot-toast";
import { Spinner } from "components/ui/svg/spinner";
import { useRouter } from "next/router";
import format from "date-fns/format";
import AsyncSelect from "react-select/async";
import DatePicker from "components/ui/datepicker";
import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { InputArch, InputDocument } from "components/healthcheck/InputFile";
import MetricsOne from "components/healthcheck/MetricsOne";
import MetricsTwo from "components/healthcheck/MetricsTwo";
import MetricsThree from "components/healthcheck/MetricsThree";
import MetricsFour from "components/healthcheck/MetricsFour";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
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
  } else {
    return {
      props: {
        user: user,
      },
    };
  }
});

export default function InputHealthCheck({ user }) {
  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState,
    getValues,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  const { errors, isSubmitting } = formState;
  const [enabled, setEnabled] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();

  // Get Data Aplikasi Async
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

  // Get Data Team Group Async
  const loadFunctions = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/group?prefix=${value}`
        )
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: `${d.prefix} - ${d.groupName}`,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Team Group ${err}`));
    }, 500);
  };

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Type at least 3 letters of application name</span>
      </components.NoOptionsMessage>
    );
  };

  const [apps, setApps] = useState("");

  const createHealthCheck = async (data, event) => {
    event.preventDefault();
    let mecahBaris = event.target.ipAddress.value.split("\n");
    console.log({
      app: data.idApps.value,
      function: data.idFunction.value,
      hcNumber: event.target.hcNumber.value,
      dayDate: event.target.dayDate.value,
      ipAddress: mecahBaris,
      arch: {
        description: event.target.archDesc.value,
        result: event.target.archResult.value,
      },
      monitoring: {
        description: event.target.monitoringDesc.value,
        result: event.target.monitoringResult.value,
      },
      version: {
        description: event.target.versionDesc.value,
        result: event.target.versionResult.value,
      },
      connection: {
        description: event.target.connectionDesc.value,
        result: event.target.connectionResult.value,
      },
    });
  };

  return (
    <>
      <LayoutPage session={user} pageTitle="Create Report" isShowNotif={false}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="create-list-section">
            {/* Page title & actions */}
            <PageHeader title="Create Health Check Report"></PageHeader>

            {/* CreateInput Report Tables (small breakpoint and up) */}
            <div className="hidden sm:block">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <>
                  <div className="max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-0 lg:max-w-full lg:px-0 lg:grid-flow-col-dense lg:grid-cols-3">
                    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                      <section
                        aria-labelledby="create-problem"
                        className="space-y-6 lg:col-start-1 lg:col-span-2"
                      >
                        <form onSubmit={handleSubmit(createHealthCheck)}>
                          <div className="bg-white shadow overflow-visible sm:rounded-lg static">
                            {/* First Row */}
                            <div
                              className="py-2 px-6 bg-green-200"
                              style={{
                                borderTopLeftRadius: "0.5rem",
                                borderTopRightRadius: "0.5rem",
                              }}
                            >
                              <label className="block text-lg font-medium text-green-500">
                                General Information
                              </label>
                            </div>
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Application
                                </label>
                                <Controller
                                  name="idApps"
                                  control={control}
                                  // rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <AsyncSelect
                                      {...field}
                                      isClearable
                                      loadOptions={loadApplications}
                                      styles={styledReactSelectAdd}
                                      className="pt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="Search for application"
                                      components={{ NoOptionsMessage }}
                                      // onChange={handleAppChange}
                                    />
                                  )}
                                />
                                {errors.idApps && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.idApps.message}
                                  </p>
                                )}
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Team Group
                                </label>
                                <Controller
                                  name="idFunction"
                                  control={control}
                                  // rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <AsyncSelect
                                      {...field}
                                      isClearable
                                      loadOptions={loadFunctions}
                                      styles={styledReactSelectAdd}
                                      className="pt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="Search for team group"
                                      components={{ NoOptionsMessage }}
                                      // onChange={handleAppChange}
                                    />
                                  )}
                                />
                                {errors.idFunction && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.idFunction.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Health Check Number
                                </label>
                                <textarea
                                  name="hcNumber"
                                  {...register("hcNumber", {
                                    // required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "none",
                                  }}
                                  className={classNames(
                                    errors.hcNumber
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="HC_-__/APP/AES/__"
                                />
                                {errors.hcNumber && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.hcNumber.message}
                                  </p>
                                )}
                                <p className="pt-2 text-sm text-gray-500">
                                  Document numbering.
                                </p>
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Report Date
                                </label>
                                <div className="pt-1">
                                  <Controller
                                    control={control}
                                    // rules={{ required: "This is required" }}
                                    render={({ field }) => (
                                      <DatePicker
                                        allowClear
                                        name="dayDate"
                                        format="d MMMM yyyy"
                                        onChange={(e) => field.onChange(e)}
                                        value={field.value}
                                        style={{
                                          borderRadius: "0.375rem",
                                          width: "100%",
                                          height: "38px",
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.dayDate && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.dayDate.message}
                                    </p>
                                  )}
                                </div>
                                <p className="pt-2 text-sm text-gray-500">
                                  Date a document was created.
                                </p>
                              </div>
                            </div>

                            {/* Third Row */}
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  List of IP Address
                                </label>
                                <div className="pt-1">
                                  <textarea
                                    name="ipAddress"
                                    // {...register("idAddress", {
                                    //   required: "This is required!",
                                    // })}
                                    rows={3}
                                    style={{
                                      resize: "vertical",
                                    }}
                                    className={classNames(
                                      errors.ipAddress
                                        ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                        : "focus:ring-blue-500 focus:border-blue-500",
                                      "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    )}
                                    placeholder="Server: Address"
                                  />
                                  {errors.ipAddress && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.ipAddress.message}
                                    </p>
                                  )}
                                  <p className="pt-2 text-sm text-gray-500">
                                    Use 'enter' to separate server.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Fourth Row */}
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <InputArch />
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <InputDocument />
                              </div>
                            </div>

                            {/* Fifth Row */}
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Configuration and Monitoring Tools
                              </label>
                            </div>
                            <MetricsOne />

                            {/* Sixth Row */}
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Performance Efficiency
                              </label>
                            </div>
                            <MetricsTwo />

                            {/* Seventh Row */}
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Resource Utilization
                              </label>
                            </div>
                            <MetricsThree />

                            {/* Eighth Row */}
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Reliability Measures
                              </label>
                            </div>
                            <MetricsFour />

                            {/* Footer Section */}
                            <div className="py-6 pr-6">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  className="mr-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => router.back()}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className={classNames(
                                    spinner
                                      ? "px-4 disabled:opacity-50 cursor-not-allowed"
                                      : null,
                                    "ml-1 pl-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  )}
                                  // disabled={spinner}
                                >
                                  {/* {spinner && <Spinner />} */}
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </section>
                    </div>

                    {/* <section
                      aria-labelledby="problem-create-info"
                      className="lg:col-start-3 lg:col-span-1"
                    >
                      <CreateInformation />
                    </section> */}
                  </div>
                </>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
