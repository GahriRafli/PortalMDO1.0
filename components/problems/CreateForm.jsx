import { useState, useEffect } from "react";
import axios from "axios";
import { styledReactSelect, styledReactSelectAdd } from "../utils";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-hot-toast";
import { Switch } from "@headlessui/react";
import { Spinner } from "components/ui/svg/spinner";
import { useRouter } from "next/router";
import format from "date-fns/format";
import AsyncSelect from "react-select/async";

import { Problem } from "./CreateInformation";
import HCInformation from "components/healthcheck/HCInformation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateForm = ({ user }) => {
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

  const { errors } = formState;
  const [recommend, setRecommend] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [followupOptions, setFollowupOptions] = useState([]);
  const router = useRouter();

  // Recommend
  const [enabled, setEnabled] = useState(false);
  const [enableSwitch, setEnableSwitch] = useState(false);
  const [checkedState, setCheckedState] = useState(new Array(14).fill(false)); //hardcode submetric
  const [finalArray, setFinalArray] = useState([]);

  // Handle switch button when incident is over
  const handleSwitch = (value) => {
    setEnableSwitch(value);
    value === false ? (setFinalArray([]), setEnabled(false)) : true;
  };

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

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Type at least 3 letters of application name</span>
      </components.NoOptionsMessage>
    );
  };

  const handleAppChange = async (event, { action }) => {
    try {
      if (action === "select-option") {
        const fetchRecommend = await fetch(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/apps/${event.value}`
        );
        let getRecommend = await fetchRecommend.json();
        setRecommend(getRecommend);
        setValue("idApps", event);
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

  //Coba Bikin Handle
  const handleCheck = async (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const arrCheck = updatedCheckedState.reduce((acc, currentState, index) => {
      if (currentState === true) {
        acc.push(recommend.data.hcResults[index].id);
      }
      return acc;
    }, []);

    setFinalArray(arrCheck);
  };

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
      healthCheck: finalArray,
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

  return (
    <>
      <form onSubmit={handleSubmit(createProblem)}>
        <div className="max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-0 lg:max-w-full lg:px-0 lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            <section
              aria-labelledby="create-problem"
              className="space-y-6 lg:col-start-1 lg:col-span-2"
            >
              <div className="bg-white shadow overflow-visible sm:rounded-lg static">
                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Problem Name
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

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Link JIRA
                  </label>
                  <div className="pt-1">
                    <input
                      id="jiraProblem"
                      name="jiraProblem"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      type="text"
                    />
                  </div>
                  <p className="pt-2 text-sm text-gray-500">
                    Optional, please fill in after Problem Number is generated.
                  </p>
                </div>

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
                          instanceId={"idApps"}
                          value={field.value}
                          isClearable
                          loadOptions={loadApplications}
                          styles={styledReactSelectAdd}
                          className="pt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Search for application"
                          components={{ NoOptionsMessage }}
                          onChange={handleAppChange}
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
                      Problem Number
                    </label>
                    <div className="pt-1">
                      <input
                        id="problemNumber"
                        name="problemNumber"
                        disabled={true}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                        value={`PR-**-${format(new Date(), "MMyyyy")}`}
                      />
                    </div>
                    <p className="pt-2 text-sm text-gray-500">
                      Number will generated automatically after the problem
                      submitted.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="pt-1">
                      <Controller
                        name="idType"
                        control={control}
                        rules={{ required: "This is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            options={typeOptions}
                            styles={styledReactSelect}
                            className="text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      />
                      {errors.idType && (
                        <p className="pt-2 text-sm text-red-600">
                          {errors.idType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Source
                    </label>
                    <div className="pt-1">
                      <Controller
                        name="idSource"
                        control={control}
                        rules={{ required: "This is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            options={sourceOptions}
                            styles={styledReactSelect}
                            className="text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      />
                      {errors.idSource && (
                        <p className="pt-2 text-sm text-red-600">
                          {errors.idSource.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Urgency
                  </label>
                  <div className="pt-1">
                    <Controller
                      name="idUrgency"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          options={urgencyOptions}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.idUrgency && (
                      <p className="pt-2 text-sm text-red-600">
                        {errors.idUrgency.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Impact
                  </label>
                  <div className="pt-1">
                    <Controller
                      name="idImpact"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          options={impactOptions}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.idImpact && (
                      <p className="pt-2 text-sm text-red-600">
                        {errors.idImpact.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Follow Up Plan
                  </label>
                  <div className="pt-1">
                    <Controller
                      name="idFollowup"
                      control={control}
                      {...register("idFollowup", {
                        required: "This is required!",
                      })}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          options={followupOptions}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.idFollowup && (
                      <p className="pt-2 text-sm text-red-600">
                        {errors.idFollowup.message}
                      </p>
                    )}
                  </div>
                </div>

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
            </section>
          </div>

          <section
            aria-labelledby="problem-create-info"
            className="lg:col-start-3 lg:col-span-1"
          >
            <Problem />
            <div className="bg-white my-6 px-2 py-3 shadow sm:rounded-lg sm:px-6">
              {recommend !== null && recommend.status == 200 ? (
                <>
                  <HCInformation data={recommend.data} />
                  {/* Switch Recommendation */}
                  <div className="flex items-center col-span-6 space-x-3 sm:col-span-6">
                    <Switch.Group as="div" className="flex items-center">
                      <Switch
                        checked={enableSwitch}
                        onChange={handleSwitch}
                        className={classNames(
                          enableSwitch ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            enableSwitch ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          )}
                        />
                      </Switch>
                      <Switch.Label
                        as="span"
                        className="ml-3 inline-grid"
                        passive
                      >
                        <span className="text-sm font-medium text-gray-900">
                          Recommendation{" "}
                        </span>
                        <span className="text-sm text-gray-500">
                          (Switch the toggle if Health Check includes in Ticket)
                        </span>
                      </Switch.Label>
                    </Switch.Group>
                  </div>
                  <ul className="inline-grid">
                    {enableSwitch &&
                      recommend.data.hcResults
                        .filter((res) => res.result == "Not Passed")
                        .map((res, index) => {
                          return (
                            <>
                              <li className="inline-flex my-2" key={index}>
                                <input
                                  type="checkbox"
                                  id={`checkbox-${index}`}
                                  name={`checkbox-${index}`}
                                  value={res.id}
                                  className={classNames(
                                    enabled
                                      ? "focus:ring-indigo-500"
                                      : "focus:ring-indigo-500 border-gray-300",
                                    "text-indigo-600 mt-0.5 mr-2 h-5 w-5 rounded cursor-pointer"
                                  )}
                                  onChange={() => handleCheck(index)}
                                />
                                <div className="inline-grid text-justify">
                                  <span className="font-medium">
                                    {res.hcSubmetric.description}
                                  </span>
                                  <span className="text-gray-500 whitespace-pre-wrap">
                                    {res.description}
                                  </span>
                                </div>
                              </li>
                            </>
                          );
                        })}
                  </ul>
                </>
              ) : (
                <div className="py-4">
                  <div className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    No Data Health Check Recommendation
                  </div>
                </div>
              )}
            </div>
            {/* <div className="py-4">
            <div className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              No Data Health Check Recommendation
            </div>
          </div> */}
          </section>
        </div>
      </form>
    </>
  );
};

export default CreateForm;
