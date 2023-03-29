import { useState, useEffect } from "react";
import axios from "axios";
import { styledReactSelect, styledReactSelectAdd } from "components/utils";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-hot-toast";
import { Spinner } from "components/ui/svg/spinner";
import { useRouter } from "next/router";
import format from "date-fns/format";
import AsyncSelect from "react-select/async";
import DatePicker from "components/ui/datepicker";
import { PhotographIcon, DocumentAddIcon } from "@heroicons/react/solid";

import CreateInformation from "components/problems/CreateInformation";

import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

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
  const [typeOptions, setTypeOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [followupOptions, setFollowupOptions] = useState([]);
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

  const [recommend, setRecommend] = useState(null);

  const handleAppChange = async (event, { action }) => {
    try {
      if (action === "select-option") {
        setApps(event.value);
        const fetchRecommend = await fetch(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/apps/${event.value}`
        );
        let getRecommend = await fetchRecommend.json();
        setRecommend(getRecommend);
      } else {
        setRecommend(null);
      }
    } catch (error) {
      throw error;
    }
  };

  // Get data urgency
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/urgency?isActive=Y`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.urgency,
        }));
        setUrgencyOptions(data);
      })
      .catch((err) => toast.error(`Urgency ${err}`));
  }, []);

  // Get data Impact
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/impact?isActive=Y`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.impact,
        }));
        setImpactOptions(data);
      })
      .catch((err) => toast.error(`Impact ${err}`));
  }, []);

  // Get data Type
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/type/all`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.type,
        }));
        setTypeOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Source Problem
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/source/all`)
      .then((response) => {
        const data = response.data.data
          .filter((value) => {
            return !value.label.startsWith("Incident");
          })
          .map((d) => ({
            value: d.id,
            label: d.label,
          }));
        setSourceOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Follow Up Plan
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/followup/all`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setFollowupOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Ini dilakukan saat onSubmit
  const createProblem = async (data, event) => {
    event.preventDefault();
    let checkFollowup = null;
    if (event.target.idFollowup.value !== null) {
      checkFollowup = parseInt(event.target.idFollowup.value);
    } else if (event.target.idFollowup.value === null) {
      checkFollowup = 4;
    }
    Object.assign(data, {
      problemName: event.target.problemName.value,
      jiraProblem: event.target.jiraProblem.value,
      idApps: data.idApps.value,
      idType: parseInt(event.target.idType.value),
      idSource: parseInt(event.target.idSource.value),
      idUrgency: parseInt(event.target.idUrgency.value),
      idImpact: parseInt(event.target.idImpact.value),
      idFollowup: checkFollowup,
      assignedTo: user.id,
      createdBy: user.id,
    });

    setSpinner(true);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/create`, data, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(function (response) {
        if (response.status === 201 || postProblem) {
          toast.success("Problem Sucessfully Created");
          setTimeout(
            () => router.push(`/problem/${response.data.data.id}`),
            1000
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          setSpinner(false);
          toast.error(`Request: ${error.request}`);
        } else {
          setSpinner(false);
          toast.error(`Message: ${error.message}`);
        }
      });
  };

  const [apps, setApps] = useState("");

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
                        <form onSubmit={handleSubmit(createProblem)}>
                          <div className="bg-white shadow overflow-visible sm:rounded-lg static">
                            {/* First Row */}
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Application
                                </label>
                                <Controller
                                  name="idApps"
                                  control={control}
                                  rules={{ required: "This is required" }}
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
                                  rules={{ required: "This is required" }}
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
                                <div className="pt-1">
                                  <textarea
                                    id="problemName"
                                    name="problemName"
                                    {...register("problemName", {
                                      required: "This is required!",
                                      minLength: {
                                        value: 10,
                                        message:
                                          "Please lengthen this text to 10 characters or more.",
                                      },
                                      maxLength: {
                                        value: 60,
                                        message:
                                          "Please shorten this text to 60 characters or less.",
                                      },
                                    })}
                                    rows={1}
                                    style={{
                                      resize: "none",
                                    }}
                                    className={classNames(
                                      errors.problemName
                                        ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                        : "focus:ring-blue-500 focus:border-blue-500",
                                      "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    )}
                                    placeholder="Problem Happening"
                                  />
                                  {errors.problemName && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.problemName.message}
                                    </p>
                                  )}
                                </div>
                                <p className="pt-2 text-sm text-gray-500">
                                  Write a few sentences about problem.
                                </p>
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                  Report Date
                                </label>
                                <div className="pt-1">
                                  <Controller
                                    control={control}
                                    rules={{ required: "This is required" }}
                                    name="dayDate"
                                    render={({ field }) => (
                                      <DatePicker
                                        allowClear
                                        // showTime={{ format: "HH:mm" }}
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
                                  {errors.problemName && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.problemName.message}
                                    </p>
                                  )}
                                </div>
                                <p className="pt-2 text-sm text-gray-500">
                                  Write a few sentences about problem.
                                </p>
                              </div>
                            </div>

                            {/* Third Row */}
                            <div className="pt-6 px-6">
                              <label className="block text-sm font-medium text-gray-700">
                                List of IP Address
                              </label>
                              <div className="pt-1"></div>
                            </div>

                            {/* Fourth Row */}
                            <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="cover-photo"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Topology Architecture
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                  <div className="text-center">
                                    <PhotographIcon
                                      className="mx-auto h-12 w-12 text-gray-300"
                                      aria-hidden="true"
                                    />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="cover-photo"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Document
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                  <div className="text-center">
                                    <DocumentAddIcon
                                      className="mx-auto h-12 w-12 text-gray-300"
                                      aria-hidden="true"
                                    />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

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
                                  disabled={spinner}
                                >
                                  {spinner && <Spinner />}
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </section>
                    </div>

                    <section
                      aria-labelledby="problem-create-info"
                      className="lg:col-start-3 lg:col-span-1"
                    >
                      <CreateInformation />
                    </section>
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
