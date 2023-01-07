/* eslint-disable react-hooks/rules-of-hooks */
import format from "date-fns/format";
import withSession from "lib/session";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { CardTitle } from "components/ui/card-title";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ButtonCircle } from "components/ui/button/button-circle";
import { Spinner } from "components/ui/svg/spinner";
import ModalRootCause from "components/problems/ModalRootCause";
import DetailHeader from "components/problems/DetailHeader";
import StepProgress from "components/problems/StepProgress";
import ProblemDetailPanel from "components/problems/ProblemDetailPanel";
import ProblemInfoPanel from "components/problems/ProblemInfoPanel";
import RelatedIncidentTables from "components/problems/RelatedIncidentTables";
import ProblemSubDetail from "components/problems/ProblemSubDetail";
import {
  styledReactSelect,
  styledReactSelectAdd,
} from "../../components/utils";
import { PencilIcon, XIcon, CheckIcon } from "@heroicons/react/solid";
import AssignModule from "components/problems/AssignModule";
import RootCauseCard from "components/problems/RootCauseCard";

import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${params.id}`
  );
  const data = await res.json();

  return {
    props: {
      user: user,
      problem: data.data,
      idProblem: params.id,
    },
  };
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProblemDetail({ user, problem, idProblem }) {
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      problemName: problem.problemName,
      idApps: problem.app
        ? {
            label: problem.app.subname,
            value: problem.app.id,
          }
        : false,
      jiraProblem: problem.jiraProblem,
      changeManagement: problem.followupCM,
      idUrgency: problem.urgency
        ? {
            label: problem.urgency.urgency,
            value: problem.urgency.id,
          }
        : false,
      idImpact: problem.impact
        ? {
            label: problem.impact.impact,
            value: problem.impact.id,
          }
        : false,
      idType: problem.paramType
        ? {
            label: problem.paramType.type,
            value: problem.paramType.id,
          }
        : false,
      idSource: problem.problemSource
        ? {
            label: problem.problemSource.label,
            value: problem.problemSource.id,
          }
        : false,
      idStatus: problem.problemStatus
        ? {
            label: problem.problemStatus.label,
            value: problem.problemStatus.id,
          }
        : false,
      idFollowup: problem.followUp
        ? {
            label: problem.followUp.label,
            value: problem.followUp.id,
          }
        : false,
      assignedTo: problem.assigned_to
        ? {
            label: problem.assigned_to.fullName,
            value: problem.assigned_to.id,
          }
        : false,
    },
  });

  const router = useRouter();

  const onUpdateStatus = async (data) => {
    Object.assign(data, {
      idStatus: { value: data.idStatus.value + 1 },
      updatedBy: user.id,
    });
    if (data.jiraProblem === "" || problem.jiraProblem == null) {
      toast.error(`Failed to update: Link JIRA harus diisi`);
    } else {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${problem.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success("Status Successfully Updated");
            setTimeout(() => router.reload(), 1000);
          } else {
            toast.error(`Failed to update: ${response.data.message}`);
          }
        })
        .catch(function (error) {
          setSpinner(false);
          toast.error(`Failed to update: ${error.response.data.message}`);
        });
    }
  };

  const onSubmitUpdateData = async (data) => {
    let matrixChanged = "N";
    if (
      problem.impact.id !== data.idImpact.value ||
      problem.urgency.id !== data.idUrgency.value
    ) {
      matrixChanged = "Y";
    }

    Object.assign(data, {
      id: problem.id,
      idStatus: { value: data.idStatus.value },
      updatedBy: user.id,
      matrixChanged: matrixChanged,
    });
    if (data.jiraProblem === "") {
      toast.error(`Failed to update: Link JIRA harus diisi`);
    } else {
      if (data.jiraProblem.includes("jira.bri.co.id")) {
        setSpinner(true);
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${problem.id}`,
            data,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(function (response) {
            if (response) {
              toast.success("Problem Successfully Updated");
              setTimeout(() => router.reload(), 1000);
            } else {
              toast.error(`Failed to update: ${response.data.message}`);
            }
          })
          .catch(function (error) {
            toast.error(`Failed to update: ${error.response.data.message}`);
          });
      } else {
        toast.error(`Failed to update: Must attach JIRA BRI`);
      }
    }
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

  // Get Data Problem Type
  const [typeOptions, setTypeOptions] = useState([]);
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

  // Get data Urgency
  const [urgencyOptions, setUrgencyOptions] = useState([]);
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
  const [impactOptions, setImpactOptions] = useState([]);
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

  // Get data Source Problem
  const [sourceOptions, setSourceOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/source/all`)
      .then((response) => {
        if (problem.incidents.length > 0) {
          const data = response.data.data.map((d) => ({
            value: d.id,
            label: d.label,
          }));
          setSourceOptions(data);
        } else {
          const data = response.data.data
            .filter((value) => {
              return !value.label.startsWith("Incident");
            })
            .map((d) => ({
              value: d.id,
              label: d.label,
            }));
          setSourceOptions(data);
        }
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Follow Up Problem
  const [followupOptions, setFollowupOptions] = useState([]);
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
      .catch((err) => toast.error(`Follow Up ${err}`));
  }, []);

  const pageTitle = `${problem.problemNumber}
  ${problem.app ? problem.app.subname : null} -
  Shield`;

  return (
    <>
      <LayoutPage session={user} pageTitle={pageTitle}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section>
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-full lg:px-12">
                <DetailHeader problem={problem} />

                {/* Conditional Update Button Status */}
                {problem.assigned_to ? (
                  user.username === problem.assigned_to.userName ? (
                    problem.problemStatus.id === 2 ? (
                      <form onSubmit={handleSubmit(onUpdateStatus)}>
                        <button
                          type="submit"
                          className={classNames(
                            spinner
                              ? "px-4 disabled:opacity-50 cursor-not-allowed"
                              : null,
                            "w-100 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          )}
                          disabled={spinner}
                        >
                          {spinner && <Spinner />}
                          Update Ongoing at JIRA
                        </button>
                      </form>
                    ) : null
                  ) : null
                ) : null}

                {problem.assigned_to ? (
                  user.username === problem.assigned_to.userName ? (
                    problem.problemStatus.id === 3 ? (
                      <ModalRootCause problem={problem} user={user} />
                    ) : null
                  ) : null
                ) : null}
              </div>

              <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
                <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                  {/* Problem Detail */}
                  <section aria-labelledby="problem-detail">
                    <div className="bg-white shadow sm:rounded-lg">
                      {editMode ? (
                        <>
                          <form onSubmit={handleSubmit(onSubmitUpdateData)}>
                            <section aria-labelledby="edit-problem">
                              <CardTitle
                                title={
                                  problem.problemNumber !== null
                                    ? `Problem Number ${problem.problemNumber}`
                                    : `Problem Number -`
                                }
                                subtitle={
                                  <ProblemSubDetail problem={problem} />
                                }
                              >
                                <div className="px-4 flex">
                                  <ButtonCircle
                                    action={() => {
                                      setEditMode(false);
                                      reset();
                                    }}
                                    className="border-transparent text-white bg-rose-600 hover:bg-rose-700"
                                  >
                                    <XIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </ButtonCircle>
                                  <ButtonCircle
                                    action={handleSubmit(onSubmitUpdateData)}
                                    className={classNames(
                                      spinner
                                        ? "px-4 disabled:opacity-50 cursor-not-allowed"
                                        : null,
                                      "ml-3 border-transparent text-white bg-blue-600 hover:bg-blue-700"
                                    )}
                                    disabled={spinner}
                                  >
                                    {spinner && <Spinner />}
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </ButtonCircle>
                                </div>
                              </CardTitle>
                              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                  <div className="sm:col-span-2">
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
                                        defaultValue={problem.problemName}
                                      />
                                      {errors.problemName && (
                                        <p className="mt-1 text-sm text-red-600">
                                          {errors.problemName.message}
                                        </p>
                                      )}
                                    </div>
                                    <p className="pt-2 text-sm text-gray-500">
                                      Edit a few sentences about problem.
                                    </p>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Link JIRA
                                    </label>
                                    <div className="pt-1">
                                      <textarea
                                        id="jiraProblem"
                                        name="jiraProblem"
                                        {...register("jiraProblem", {
                                          required: "This is required!",
                                        })}
                                        rows={1}
                                        style={{
                                          resize: "none",
                                        }}
                                        className={classNames(
                                          errors.jiraProblem
                                            ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                            : "focus:ring-blue-500 focus:border-blue-500",
                                          "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        )}
                                        placeholder="Link JIRA"
                                        defaultValue={problem.jiraProblem}
                                      />
                                      {errors.jiraProblem && (
                                        <p className="mt-1 text-sm text-red-600">
                                          {errors.jiraProblem.message}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Application
                                    </label>
                                    <Controller
                                      name="idApps"
                                      control={control}
                                      rules={{ required: "This is required" }}
                                      defaultValue={problem.app.id}
                                      render={({ field }) => (
                                        <AsyncSelect
                                          {...field}
                                          isClearable
                                          loadOptions={loadApplications}
                                          styles={styledReactSelectAdd}
                                          className="pt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Search for application"
                                          components={{ NoOptionsMessage }}
                                        />
                                      )}
                                    />
                                    {errors.idApps && (
                                      <p className="mt-2 text-sm text-red-600">
                                        {errors.idApps.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Type
                                    </label>
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

                                  <div className="sm:col-span-2">
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

                                  <div className="sm:col-span-2">
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
                                            className={classNames(
                                              errors.idImpact
                                                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                                : "focus:ring-blue-500 focus:border-blue-500",
                                              "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                            )}
                                            options={impactOptions}
                                            styles={styledReactSelect}
                                            placeholder="Select impact..."
                                          />
                                        )}
                                      />
                                      {errors.idImpact && (
                                        <p className="text-sm text-red-600">
                                          {errors.idImpact.message}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="sm:col-span-1">
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

                                  <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Follow Up Plan
                                    </label>
                                    <div className="pt-1">
                                      <Controller
                                        name="idFollowup"
                                        control={control}
                                        rules={{ required: "This is required" }}
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
                                </div>
                              </div>
                            </section>
                          </form>
                        </>
                      ) : (
                        <>
                          <CardTitle
                            title={
                              problem.problemNumber !== null
                                ? `Problem Number ${problem.problemNumber}`
                                : `Problem Number -`
                            }
                            subtitle={<ProblemSubDetail problem={problem} />}
                          >
                            {problem.problemStatus.id <= 4 ? (
                              <nav
                                className="flex items-center justify-left"
                                aria-label="Progress"
                              >
                                <p className="text-sm font-medium">
                                  {`Progress ${problem.problemStatus.id} of 4`}
                                </p>
                                <StepProgress problem={problem} />
                                <div className="px-4 flex ml-3 mb-4">
                                  {problem.assigned_to ? (
                                    user.username ===
                                    problem.assigned_to.userName ? (
                                      problem.problemStatus.id !== 4 ? (
                                        <ButtonCircle
                                          action={() => {
                                            setEditMode(true);
                                          }}
                                          className="border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-50"
                                        >
                                          <PencilIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </ButtonCircle>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </nav>
                            ) : null}
                          </CardTitle>
                          <ProblemDetailPanel problem={problem} />
                        </>
                      )}
                    </div>
                  </section>

                  {/* Condition Incident Table */}
                  <RelatedIncidentTables problem={problem} />

                  {/* Condition RootCause Done */}
                  {problem.rootCauses.length > 0 ? (
                    <RootCauseCard rootcause={problem.rootCauses[0]} />
                  ) : null}
                </div>

                <section
                  aria-labelledby="timeline-title"
                  className="lg:col-start-3 lg:col-span-1"
                >
                  {/* Problem Info */}
                  <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                    <ProblemInfoPanel problem={problem} />
                  </div>

                  {/* Reporter */}
                  <div className="bg-white shadow sm:rounded-lg mt-3">
                    <div className="space-y-4 px-4 py-5 sm:px-6">
                      {/* Divide Component Conditional for Assign */}
                      <AssignModule
                        problem={problem}
                        user={user}
                        idProblem={idProblem}
                      />

                      {problem.updated_by !== null ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 text-sm">
                            Last updated on{" "}
                            {format(
                              new Date(problem.updatedAt),
                              "d LLLL yyyy HH:mm",
                              "id-ID"
                            )}
                            <br />
                            by {problem.updated_by.fullName}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}

export default ProblemDetail;
