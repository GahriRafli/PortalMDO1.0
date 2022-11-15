import { useState, useEffect } from "react";
import DatePicker from "../../components/ui/datepicker";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Disclosure, Switch } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";
import format from "date-fns/format";
import { toast } from "react-toastify";
import Layout from "../../components/layout";
import { Input } from "../../components/ui/forms";
import {
  classNames,
  styledReactSelect,
  IconOption,
  ValueOption,
} from "../../components/utils";
import { PrimaryButton } from "../../components/ui/button/primary-button";
import { SecondaryButton } from "../../components/ui/button/secondary-button";
import { Spinner } from "../../components/ui/svg/spinner";
import PageHeader from "../../components/incidents/page-header";
import docs from "../../components/incidents/docs.json";
import withSession from "../../lib/session";

function addIncident({ user }) {
  // Digunakan utuk fungsi reset form
  const defaultValues = {
    incidentName: "",
    idApps: null,
    startTime: null,
    logStartTime: null,
    endTime: null,
    idUrgency: null,
    idImpact: null,
    impactedSystem: "",
    rootCause: "",
    actionItem: "",
    responsibleEngineer: "",
    idProblemType: null,
    proposedEnhancement: "",
    lessonLearned: "",
  };
  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState,
    reset,
    getValues,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });
  const { errors, isSubmitting } = formState;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const router = useRouter();
  const [enabled, setEnabled] = useState(false); // Untuk toggle incident resolved
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [problemTypeOptions, setProblemTypeOptions] = useState([]);
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [isProblem, setIsProblem] = useState(false); // Untuk toggle permanent fix

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

  // Get data impact
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

  // Get data applications with async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) return callback([]);

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${value}&status=A`
        )
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: d.subName,
            criticality: d.criticalityApp,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Type at least 3 letters of application name</span>
      </components.NoOptionsMessage>
    );
  };

  // Get data Problem Type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/problemtype?isActive=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.problemType,
        }));
        setProblemTypeOptions(data);
      })
      .catch((err) => toast.error(`Problem Type ${err}`));
  }, []);

  // Get data incident type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/incidenttype?isActive=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.incidentType,
        }));
        setIncidentTypeOptions(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  // Handle validate datetime
  const st = new Date(getValues("startTime"));
  const et = new Date(getValues("endTime"));
  const ls = new Date(getValues("logStartTime"));

  const handleDatetime = () => {
    return (
      st.setSeconds(0, 0) < et.setSeconds(0, 0) &&
      ls.setSeconds(0, 0) < et.setSeconds(0, 0)
    );
  };

  // Handle validate start time
  const handleStartTime = () => ls.setSeconds(0, 0) <= st.setSeconds(0, 0);

  // Handle switch button when incident is over
  const handleSwitch = (value) => {
    unregister([
      "endTime",
      "idIncidentType",
      "rootCause",
      "actionItem",
      "responsibleEngineer",
      "lessonLearned",
      "idProblemType",
      "proposedEnhancement",
    ]);
    setEnabled(value);
  };

  // Hanlde permanent fix select
  const handleIsProlem = (value) => {
    unregister(["idProblemType", "proposedEnhancement"]);
    setIsProblem(value);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await sleep(1000);

    const sqlDateFormat = "yyyy-MM-dd HH:mm";
    const mandatoryObj = {
      idApps: data.idApps.value,
      startTime: format(new Date(data.startTime), sqlDateFormat),
      logStartTime: format(new Date(data.logStartTime), sqlDateFormat),
      idUrgency: data.idUrgency.value,
      idImpact: data.idImpact.value,
    };

    if (!enabled) {
      Object.assign(data, mandatoryObj);
    } else {
      Object.assign(data, mandatoryObj, {
        endTime: format(new Date(data.endTime), sqlDateFormat),
        idIncidentType: data.idIncidentType.value,
        isProblem: !isProblem ? "N" : "W",
        incidentStatus: "Resolved",
      });
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, data, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(function (response) {
        if (response.status === 201) {
          !isSubmitting && toast.success("Incident successfully added");
          router.push("/incidents");
        } else {
          toast.error(`Error Code: ${response.status}`);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          toast.error(`Request: ${error.request}`);
        } else {
          toast.error(`Msg: ${error.message}`);
        }
      });
  };

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Declare New Incident - Shield</title>
        </Head>
        {/* Page title & actions */}
        <PageHeader title="Create New Incident"></PageHeader>
        <div className="grid max-w-full grid-cols-1 gap-6 mx-auto mt-8 mb-8 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Section Incident Detail */}
            <section aria-labelledby="create-new-incident">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Start */}
                <div className="static overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-6">
                        <Input
                          name="incidentName"
                          register={register}
                          required="This is required"
                          label="Incident Name"
                          placeholder="Say what's happening. Example: Login page BRImo error"
                          className={
                            errors.incidentName
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500"
                          }
                        />
                        {errors.incidentName && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.incidentName.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
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
                              instanceId={"idApps"}
                              loadOptions={loadApplications}
                              styles={styledReactSelect}
                              className="text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Search for application"
                              components={{
                                Option: IconOption,
                                SingleValue: ValueOption,
                              }}
                            />
                          )}
                        />
                        <span className="mt-2 text-xs italic font-normal text-gray-500">
                          Type at least 3 letters of application name
                        </span>
                        {errors.idApps && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.idApps.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-3"></div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <Controller
                          control={control}
                          rules={{ required: "This is required" }}
                          name="logStartTime"
                          render={({ field }) => (
                            <DatePicker
                              allowClear
                              showTime={{ format: "HH:mm" }}
                              format="d MMMM yyyy HH:mm"
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
                        {errors.logStartTime && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.logStartTime.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Detected Time
                        </label>
                        <Controller
                          control={control}
                          rules={{
                            required: "This is required",
                            validate: handleStartTime,
                          }}
                          name="startTime"
                          render={({ field }) => (
                            <DatePicker
                              allowClear
                              showTime={{ format: "HH:mm" }}
                              format="d MMMM yyyy HH:mm"
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
                        {errors.startTime?.type === "validate" && (
                          <p className="mt-2 text-sm text-red-600">
                            Detected time can't be less than start time
                          </p>
                        )}
                        {errors.startTime && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.startTime.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Affected System
                        </label>
                        <textarea
                          {...register("impactedSystem", {
                            required: "This is required",
                            minLength: {
                              value: 30,
                              message:
                                "Please lengthen this text to 30 characters or more.",
                            },
                          })}
                          id="impactedSystem"
                          name="impactedSystem"
                          rows={3}
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe the systems affected by the incident"
                          defaultValue={""}
                        />
                        {errors.impactedSystem && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.impactedSystem.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Urgency
                        </label>
                        <Controller
                          name="idUrgency"
                          control={control}
                          rules={{ required: "This is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              instanceId={"idUrgency"}
                              options={urgencyOptions}
                              styles={styledReactSelect}
                              className="text-sm focus:ring-blue-500 focus:border-blue-500"
                              menuPlacement="top"
                            />
                          )}
                        />
                        {errors.idUrgency && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.idUrgency.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Impact
                        </label>
                        <Controller
                          name="idImpact"
                          id="idImpact"
                          control={control}
                          rules={{
                            required: "This is required",
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              instanceId={"idImpact"}
                              options={impactOptions}
                              styles={styledReactSelect}
                              className="text-sm focus:ring-blue-500 focus:border-blue-500"
                              menuPlacement="top"
                            />
                          )}
                        />
                        {errors.idImpact && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.idImpact.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center col-span-6 space-x-3 sm:col-span-6">
                        <Switch.Group as="div" className="flex items-center">
                          <Switch
                            checked={enabled}
                            onChange={handleSwitch}
                            className={classNames(
                              enabled ? "bg-blue-600" : "bg-gray-200",
                              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                enabled ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                              )}
                            />
                          </Switch>
                          <Switch.Label as="span" className="ml-3" passive>
                            <span className="text-sm font-medium text-gray-900">
                              Incident is Over{" "}
                            </span>
                            <span className="text-sm text-gray-500">
                              (Switch the toggle if the incident is over)
                            </span>
                          </Switch.Label>
                        </Switch.Group>
                      </div>
                      {/* Jika kondisi incident sudah selesai */}
                      {enabled && (
                        <>
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              End Time
                            </label>
                            <Controller
                              name="endTime"
                              control={control}
                              rules={{
                                required: "This is required",
                                validate: handleDatetime,
                              }}
                              render={({ field }) => (
                                <DatePicker
                                  allowClear
                                  showTime={{ format: "HH:mm" }}
                                  format="d MMMM yyyy HH:mm"
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
                            {errors.endTime?.type === "validate" && (
                              <p className="mt-2 text-sm text-red-600">
                                End time must be greater than log or start time
                              </p>
                            )}
                            {errors.endTime && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.endTime.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-3 sm:col-span-3">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Incident Type
                            </label>
                            <Controller
                              name="idIncidentType"
                              control={control}
                              rules={{ required: "This is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  instanceId={"idIncidentType"}
                                  isClearable={true}
                                  isSearchable={false}
                                  options={incidentTypeOptions}
                                  styles={styledReactSelect}
                                  className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                            />
                            {errors.idIncidentType && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.idIncidentType.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Root Cause
                            </label>
                            <textarea
                              {...register("rootCause", {
                                required: "This is required",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              id="rootCause"
                              name="rootCause"
                              rows={3}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Write a good Root Cause Analysis (RCA)"
                            />
                            {errors.rootCause && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.rootCause.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Action Items
                            </label>
                            <textarea
                              {...register("actionItem", {
                                required: "This is required",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              id="actionItem"
                              name="actionItem"
                              rows={3}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Describe the action"
                            />
                            {errors.actionItem && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.actionItem.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Responsible Team
                            </label>
                            <textarea
                              {...register("responsibleEngineer", {
                                required: "This is required",
                              })}
                              id="responsibleEngineer"
                              name="responsibleEngineer"
                              rows={3}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="The person(s) who attended the support call and had most context of what happened."
                            />
                            {errors.responsibleEngineer && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.responsibleEngineer.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center col-span-6 space-x-3 sm:col-span-3">
                            <Switch.Group
                              as="div"
                              className="flex items-center"
                            >
                              <Switch
                                checked={isProblem}
                                onChange={handleIsProlem}
                                className={classNames(
                                  isProblem ? "bg-blue-600" : "bg-gray-200",
                                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    isProblem
                                      ? "translate-x-5"
                                      : "translate-x-0",
                                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                  )}
                                />
                              </Switch>
                              <Switch.Label as="span" className="ml-3" passive>
                                <span className="text-sm font-medium text-gray-900">
                                  Need Improvemnt or Permanent Fix
                                </span>
                              </Switch.Label>
                            </Switch.Group>
                          </div>
                          {isProblem && (
                            <>
                              <div className="col-span-6 sm:col-span-3">
                                <label
                                  htmlFor="idProblemType"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Problem Type
                                </label>
                                <select
                                  {...register("idProblemType", {
                                    required: "This is required",
                                  })}
                                  id="idProblemType"
                                  name="idProblemType"
                                  className="block w-full py-2 pl-3 pr-10 mt-1 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  defaultValue={null}
                                >
                                  <option value="">Select...</option>
                                  {problemTypeOptions.map((type) => (
                                    <option value={type.value} key={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                                {errors.idProblemType && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.idProblemType.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-span-6 sm:col-span-6">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                  Proposed Enhancement
                                </label>
                                <textarea
                                  {...register("proposedEnhancement", {
                                    required: "This is required",
                                    minLength: {
                                      value: 30,
                                      message:
                                        "Please lengthen this text to 30 characters or more.",
                                    },
                                  })}
                                  id="proposedEnhancement"
                                  name="proposedEnhancement"
                                  rows={3}
                                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="What should be done to avoid this in future ? This is mandatory if you choose the permanent fix"
                                />
                                {errors.proposedEnhancement && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.proposedEnhancement.message}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                          <div className="col-span-6 sm:col-span-6">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Lesson Learned
                              <span className="font-normal text-gray-500"></span>
                            </label>
                            <textarea
                              {...register("lessonLearned", {
                                required: "This is required",
                              })}
                              id="lessonLearned"
                              name="lessonLearned"
                              rows={3}
                              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="The lesson that we take from this incident"
                            />
                            {errors.lessonLearned && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.lessonLearned.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 space-x-2 text-right bg-gray-50 sm:px-6">
                    <PrimaryButton
                      type="submit"
                      className={
                        isSubmitting
                          ? "disabled:opacity-50 cursor-not-allowed"
                          : ""
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Spinner />}
                      Save
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => {
                        reset(defaultValues);
                      }}
                    >
                      Reset
                    </SecondaryButton>
                  </div>
                </div>
              </form>
            </section>
          </div>

          {/* Start Docs Panel */}
          <section
            aria-labelledby="docs-title"
            className="lg:col-start-3 lg:col-span-1"
          >
            <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:px-6">
              <h2
                id="timeline-title"
                className="inline-flex items-center text-lg font-medium text-gray-900"
              >
                <QuestionMarkCircleIcon
                  className="w-6 h-6 mr-2 -ml-1 text-blue-500"
                  aria-hidden="true"
                />
                Docs
              </h2>
              <dl className="space-y-3 divide-y divide-gray-200">
                {docs.map((doc) => (
                  <Disclosure
                    as="div"
                    defaultOpen="true"
                    key={doc.id}
                    className="pt-3"
                  >
                    {({ open }) => (
                      <>
                        <dt className="text-lg">
                          <Disclosure.Button className="flex items-start justify-between w-full text-base text-left text-gray-400">
                            <span className="text-base font-normal text-gray-900">
                              {doc.title}
                            </span>
                            <span className="flex items-center ml-6 h-7">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-6 w-6 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="pr-12 mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            {doc.bodyHeader}
                          </p>
                          <ul className="text-sm text-gray-500 list-disc list-inside">
                            {doc.bodyContent &&
                              doc.bodyContent.map((bc) => (
                                <li key={bc.id}>{bc.text}</li>
                              ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </dl>
            </div>
          </section>
          {/* End of Docs Panel */}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, params }) {
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

export default addIncident;
