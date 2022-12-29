import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Select from "react-select";
import DatePicker from "components/ui/datepicker";
import withSession from "lib/session";
import incidentStatus from "public/incident-status.json";
import { format, parseISO, formatDistanceToNowStrict } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CardTitle } from "components/ui/card-title";
import { CardContent } from "components/ui/card-content";
import { PrimaryButton } from "components/ui/button/primary-button";
import { WhiteButton } from "components/ui/button";
import { ButtonCircle } from "components/ui/button/button-circle";
import { styledReactSelect } from "components/utils";
import { Spinner } from "components/ui/svg/spinner";
import { Listbox, Transition, Switch } from "@headlessui/react";
import {
  PencilIcon,
  XIcon,
  CheckIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  LockOpenIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";
import {
  ArrowCircleLeftIcon,
  DocumentTextIcon,
  PaperClipIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import {
  Image as AntdImage,
  Modal,
  Space,
  Tooltip,
  Upload,
  Typography,
  Spin,
} from "antd";
import { LayoutPage, LayoutPageContent } from "components/layout/index";
import PageHeader from "components/incidents/page-header";
import clsx from "clsx";

export default function IncidentDetail({ user, incident, comments }) {
  const pageTitle = `${incident.data.incidentNumber}
  ${incident.data.paramApps ? incident.data.paramApps.subName : ""} -
  Shield`;
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [newComments, setNewComments] = useState(comments);
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [enhanceOptions, setEnhanceOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(
    incident.data.incidentStatus
  );
  const [editableData, setEditableData] = useState({
    incidentName: incident.data.incidentName,
    titleLoading: false,
  });
  const [enhancement, setEnhancement] = useState(
    incident.data.isProblem !== "N" ? true : false
  );
  const [isOnGoing, setIsOngoing] = useState(
    incident.data.endTime === null ? true : false
  );
  const [fileList, setFileList] = useState([]);
  const [showList, setShowList] = useState(true);

  function refreshData() {
    router.replace(router.asPath);
  }

  /** =============== Data Fetching Start =============== */
  // get data incident type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL_V2}/parameters/incidenttype?isActive=Y`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.incidentType,
        }));
        setIncidentTypeOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get incident type list: ${error.response.data.message}`
        )
      );
  }, []);

  // get data system catgory type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL_V2}/parameters/categorysystem?isActive=Y`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.categorySystem,
        }));
        setCategoryTypeOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get system category type list: ${error.response.data.message}`
        )
      );
  }, []);
  /** =============== Data Fetching End =============== */

  // get data urgency list
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/urgency?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.urgency,
        }));
        setUrgencyOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get urgency list: ${error.response.data.message}`
        )
      );
  }, []);

  // get data impact list
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/impact?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.impact,
        }));
        setImpactOptions(data);
      })
      .catch((error) =>
        toast.error(`Unable to get impact list: ${error.response.data.message}`)
      );
  }, []);

  // get data enhancement list
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/problemtype?isActive=Y`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.problemType,
        }));
        setEnhanceOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get enhancement list: ${error.response.data.message}`
        )
      );
  }, []);

  // react hook form for incident
  const {
    register,
    unregister,
    handleSubmit,
    control,
    reset,
    resetField,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      idIncidentType: incident.data.paramIncidentType
        ? {
            label: incident.data.paramIncidentType.incidentType,
            value: incident.data.paramIncidentType.id,
          }
        : false,
      idCategorySystem: incident.data.paramCategorySystem
        ? {
            label: incident.data.paramCategorySystem.categorySystem,
            value: incident.data.paramCategorySystem.id,
          }
        : false,
      idUrgency: incident.data.paramUrgency
        ? {
            label: incident.data.paramUrgency.urgency,
            value: incident.data.paramUrgency.id,
          }
        : false,
      idImpact: incident.data.paramImpact
        ? {
            label: incident.data.paramImpact.impact,
            value: incident.data.paramImpact.id,
          }
        : false,
      logStartTime: incident.data.logStartTime
        ? parseISO(incident.data.logStartTime, new Date())
        : false,
      startTime: incident.data.startTime
        ? parseISO(incident.data.startTime, new Date())
        : false,
      endTime: incident.data.endTime
        ? parseISO(incident.data.endTime, new Date())
        : false,
      idProblemType: incident.data.idProblemType
        ? {
            label: incident.data.paramProblemType.problemType,
            value: incident.data.paramProblemType.id,
          }
        : false,
    },
  });

  // react hook form for comment
  const {
    register: register2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
    handleSubmit: handleSubmit2,
    reset: reset2,
  } = useForm({
    mode: "onBlur",
  });

  // handle change on incident status dropdown
  const onStatusChange = (value) => {
    const body =
      (selectedStatus === "Open" && value === "Investigate") ||
      (selectedStatus === "Open" && value === "Resolved") ? (
        <>
          All of this data will be send to Whatsapp and Telegram. This action
          cannot be undone.
          <div className="mt-2">
            <Space>
              <img src="/whatsapp.svg" alt="" className="h-4 w-4" />
              <img src="/telegram.svg" alt="" className="h-4 w-4" />
            </Space>
          </div>
        </>
      ) : (
        ""
      );

    Modal.confirm({
      title: `${value} this Incident ?`,
      content: body,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setSpinner(true);
        axios
          .patch(
            `${process.env.NEXT_PUBLIC_API_URL_V2}/incidents/${incident.data.id}`,
            { incidentStatus: value },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(function (response) {
            setSpinner(false);
            if (response.status === 200) {
              setSelectedStatus(response.data.data.incidentStatus);
              toast.success(
                `Incident set to ${response.data.data.incidentStatus}`
              );
            } else {
              toast.error(`Failed to update: ${response.data.message}`);
            }
          })
          .catch(function (error) {
            // Error 😨
            setSpinner(false);
            toast.error(`${error.response.data.message}`);
          });
      },
    });
  };

  // Handle Editable Title incident
  const handleEditableTitle = (value) => {
    if (editableData.incidentName !== value) {
      setEditableData((editableData) => ({
        ...editableData,
        titleLoading: true,
      }));
      axios
        .patch(
          `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}`,
          { incidentName: value },
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response.status === 200) {
            // setIncidentName(value);
            setEditableData((editableData) => ({
              ...editableData,
              incidentName: value,
              titleLoading: false,
            }));
          } else {
            toast.error(`Failed to update: ${response.data.message}`);
          }
        })
        .catch(function (error) {
          // Error 😨
          toast.error(`${error.response.data.message}`);
          setEditableData((editableData) => ({
            ...editableData,
            titleLoading: false,
          }));
        });
    }
  };

  // Handle validate datetime
  const timeType = {
    logStartTime: new Date(getValues("logStartTime")),
    startTime: new Date(getValues("startTime")),
    endTime: new Date(getValues("endTime")),
  };
  const { logStartTime, startTime, endTime } = timeType;

  const handleDatetime = () => {
    return (
      startTime.setSeconds(0, 0) < endTime.setSeconds(0, 0) &&
      logStartTime.setSeconds(0, 0) < endTime.setSeconds(0, 0)
    );
  };

  // Handle validate start time
  const handleStartTime = () =>
    logStartTime.setSeconds(0, 0) <= startTime.setSeconds(0, 0);

  // Handle switch button for permanent fix option
  const handleSwitch = () => {
    if (incident.data.isProblem !== "N") {
      setEnhancement(true);
      toast.error("There is already a improvement or permanent fix");
    } else {
      if (enhancement) {
        unregister(["idProblemType", "proposedEnhancement"]);
        setValue("proposedEnhancement", null);
        setEnhancement(false);
      } else {
        setEnhancement(true);
      }
    }
  };

  // Handle Incident Still on Going - by Agus
  const handleStillOngoing = (e) => {
    const checked = e.target.checked;

    if (checked === true) {
      setValue("endTime", null);
      unregister("endTime");
      setIsOngoing(true);
    } else {
      setIsOngoing(false);
    }
  };

  // Handle modal delete comments
  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure to delete this comment?",
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",

      onOk() {
        axios
          .delete(
            `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}/comment/${id}`,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then((res) => {
            if (res.status < 300) {
              refreshData();
              toast.success("Comment sussessfullt deteled");
            } else {
              toast.error(`Delete failed: ${res.data.message}`);
            }
          })
          .catch((err) => toast.error(err));
      },

      onCancel() {},
    });
  };

  // handle form submit
  const onSubmit = async (data) => {
    data = Object.assign(data, {
      idIncidentType: data.idIncidentType.value,
      idCategorySystem: data.idCategorySystem.value,
      startTime: format(new Date(data.startTime), "yyyy-MM-dd HH:mm"),
      logStartTime: format(new Date(data.logStartTime), "yyyy-MM-dd HH:mm"),
      endTime:
        isOnGoing === true
          ? null
          : format(new Date(data.endTime), "yyyy-MM-dd HH:mm"),
      idUrgency: data.idUrgency.value,
      idImpact: data.idImpact.value,
      isProblem: enhancement === true ? "W" : "N",
      idProblemType:
        enhancement === true
          ? data.idProblemType
            ? data.idProblemType.value
            : null
          : null,
    });

    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL_V2}/incidents/${incident.data.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(function (response) {
        !isSubmitting;
        if (response.status === 200) {
          toast.success("Incident updated successfully");
          // setTimeout(() => router.reload(), 500);
          refreshData();
          setEditMode(false);
        } else {
          toast.error(`Failed to update: ${response.data.message}`);
        }
      })
      .catch(function (error) {
        // Error 😨
        toast.error(`Failed to update: ${error.response.data.message}`);
      });
  };

  // handle on comment submit
  const onSubmitComment = async (data) => {
    const formData = new FormData();
    formData.append("messages", data.comment);
    // cek jika ada file yang diupload
    fileList.length !== 0 && formData.append("attachment", fileList);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}/comment`,
        formData,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`Failed submit ${res.data.message}`);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        reset2({
          comment: "",
          file: null,
        });
        setFileList([]);
        setShowList(false);
        refreshData();
      });
  };

  return (
    <LayoutPage session={user} pageTitle={pageTitle}>
      <PageHeader>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-5">
            <div className="flex flex-row space-x-4">
              <div className="flex w-8 h-8 items-center justify-center">
                <Link href="/incidents">
                  <a
                    aria-label="Kembali"
                    className="text-blue-500 hover:text-blue-700"
                    title="Kembali"
                  >
                    <ArrowCircleLeftIcon aria-hidden className="w-8 h-8" />
                  </a>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl font-semibold">
                  {editableData.incidentName}
                </h1>
                <p className="mt-1 text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                  Reported by{" "}
                  <a href="#" className="text-gray-900">
                    {incident.data.paramCreatedBy
                      ? incident.data.paramCreatedBy.fullname
                      : "undefined"}
                  </a>{" "}
                  on{" "}
                  <time>
                    {format(
                      new Date(incident.data.createdAt),
                      "dd MMMM yyyy HH:mm",
                      "id-ID"
                    )}
                  </time>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 sm:mt-0 sm:ml-4">
          <WhiteButton type="button" onClick={() => refreshData()}>
            <RefreshIcon
              className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
              aria-hidden="true"
            />
            Refresh
          </WhiteButton>
          <Listbox
            value={selectedStatus}
            onChange={(value) => {
              onStatusChange(value);
            }}
            disabled={user.grant === "viewer" ? true : false}
          >
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only">
                  Change incident status
                </Listbox.Label>
                <div className="relative">
                  <div className="inline-flex divide-x divide-gray-200 rounded-md shadow-sm">
                    <div className="relative z-0 inline-flex divide-x divide-gray-200 rounded-md shadow-sm">
                      <div
                        className={clsx(
                          selectedStatus == "Open"
                            ? "bg-red-500"
                            : selectedStatus == "Investigate"
                            ? "bg-blue-500"
                            : "bg-green-500",
                          "relative inline-flex items-center py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white"
                        )}
                      >
                        {spinner ? (
                          <Spinner />
                        ) : selectedStatus == "Open" ? (
                          <LockOpenIcon
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        ) : selectedStatus == "Investigate" ? (
                          <ClockIcon className="w-5 h-5" aria-hidden="true" />
                        ) : selectedStatus == "Resolved" ? (
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          ""
                        )}
                        <p className="ml-2.5 text-sm font-medium">
                          {selectedStatus}
                        </p>
                      </div>
                      <Listbox.Button
                        className={clsx(
                          selectedStatus == "Open"
                            ? "bg-red-500 hover:bg-red-600"
                            : selectedStatus == "Investigate"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-green-500 hover:bg-green-600",
                          "relative inline-flex items-center p-2 rounded-l-none rounded-r-md text-sm font-medium text-white focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
                        )}
                      >
                        <span className="sr-only">Change incident status</span>
                        <ChevronDownIcon
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                    </div>
                  </div>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="absolute right-0 z-10 mt-2 overflow-hidden origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {incidentStatus.map((option) => (
                        <Listbox.Option
                          key={option.status}
                          className={({ active }) =>
                            clsx(
                              active
                                ? "text-white bg-blue-500"
                                : "text-gray-900",
                              "cursor-default select-none relative p-4 text-sm"
                            )
                          }
                          value={option.status}
                        >
                          {({ selected, active }) => (
                            <div className="flex flex-col">
                              <div className="flex justify-between">
                                <p
                                  className={
                                    selected ? "font-semibold" : "font-normal"
                                  }
                                >
                                  {option.status}
                                </p>
                                {selected ? (
                                  <span
                                    className={
                                      active ? "text-white" : "text-blue-500"
                                    }
                                  >
                                    <CheckIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </div>
                              <p
                                className={clsx(
                                  active ? "text-blue-200" : "text-gray-500",
                                  "mt-2"
                                )}
                              >
                                {option.description}
                              </p>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      </PageHeader>
      <LayoutPageContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-flow-col-dense lg:grid-cols-2">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Incident Detail */}
            {editMode ? (
              <form key={2} onSubmit={handleSubmit(onSubmit)}>
                <section aria-labelledby="incident-detail">
                  <div className="bg-white shadow sm:rounded-lg">
                    <CardTitle
                      title={`Incident Report ${incident.data.incidentNumber}`}
                      subtitle={`Priority ${
                        incident.data.paramPriorityMatrix
                          ? incident.data.paramPriorityMatrix.mapping
                          : "not defined yet"
                      }, ${
                        incident.data.resolvedIntervals
                          ? `duration ${incident.data.resolvedIntervals} minutes`
                          : `started ${format(
                              new Date(incident.data.startTime),
                              "dd MMMM yyyy HH:mm",
                              "id-ID"
                            )}`
                      }`}
                    >
                      <div className="flex px-4">
                        <ButtonCircle
                          action={() => {
                            setEditMode(false);
                            reset();
                          }}
                          className="text-white border-transparent bg-rose-600 hover:bg-rose-700"
                        >
                          <XIcon className="w-5 h-5" aria-hidden="true" />
                        </ButtonCircle>
                        <ButtonCircle
                          action={handleSubmit(onSubmit)}
                          className={clsx(
                            isSubmitting
                              ? "px-4 disabled:opacity-50 cursor-not-allowed"
                              : "",
                            "ml-3 border-transparent text-white bg-blue-600 hover:bg-blue-700"
                          )}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <Spinner />}
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </ButtonCircle>
                      </div>
                    </CardTitle>
                    <CardContent>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-900">
                          Application
                        </dt>
                        <dd className="mt-1 text-sm text-gray-500">
                          {incident.data.paramApps
                            ? incident.data.paramApps.subName
                            : "Not defined yet"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="incident-type"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Incident Type
                        </label>
                        <Controller
                          name="idIncidentType"
                          control={control}
                          rules={{ required: "This is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={clsx(
                                errors.idIncidentType
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                              )}
                              options={incidentTypeOptions}
                              styles={styledReactSelect}
                              placeholder="Select incident type..."
                            />
                          )}
                        />
                        {errors.idIncidentType && (
                          <p className="text-sm text-red-600">
                            {errors.idIncidentType.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="start-time"
                          className="block mb-1 text-sm font-medium text-gray-900"
                        >
                          Start Time
                        </label>
                        <Controller
                          control={control}
                          rules={{ required: "This is required" }}
                          name="logStartTime"
                          render={({ field }) => (
                            <DatePicker
                              allowClear
                              placeholder="When the incident actually happen?"
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
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="detected-time"
                          className="block mb-1 text-sm font-medium text-gray-900"
                        >
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
                              placeholder="When we aware/identified the incident?"
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
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="end-time"
                          className="block mb-1 text-sm font-medium text-gray-900"
                        >
                          End Time
                        </label>
                        <Controller
                          name="endTime"
                          rules={{
                            required:
                              isOnGoing === true
                                ? false
                                : "This is required when incident is not ongoing",
                            validate:
                              isOnGoing === true ? false : handleDatetime,
                          }}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={isOnGoing === true ? true : false}
                              allowClear
                              placeholder="Thank God the incident is over"
                              showTime={{ format: "HH:mm" }}
                              format="d MMMM yyyy HH:mm"
                              onChange={(e) => field.onChange(e)}
                              value={field.value}
                              defaultValue={parseISO(
                                incident.data.endTime,
                                new Date()
                              )}
                              style={{
                                borderRadius: "0.375rem",
                                width: "100%",
                                height: "38px",
                              }}
                            />
                          )}
                        />
                        {incident.data.endTime === null && (
                          <div className="relative flex items-start mt-2">
                            <div className="flex items-center h-5">
                              <input
                                id="comments"
                                aria-describedby="comments-description"
                                name="comments"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onChange={handleStillOngoing}
                                checked={isOnGoing}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                              >
                                Incident Still Ongoing{" "}
                                <span className="font-normal text-gray-400">
                                  (Uncheck this when incident is over)
                                </span>
                              </label>
                            </div>
                          </div>
                        )}

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

                      <div className="sm:col-span-1">
                        <label
                          htmlFor="incident-type"
                          className="block text-sm font-medium text-gray-900"
                        >
                          System Caegory Type
                        </label>
                        <Controller
                          name="idCategorySystem"
                          control={control}
                          rules={{ required: "This is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={clsx(
                                errors.idCategorySystem
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                              )}
                              options={categoryTypeOptions}
                              styles={styledReactSelect}
                              placeholder="Select system category type..."
                              isSearchable={false}
                            />
                          )}
                        />
                        {errors.idCategorySystem && (
                          <p className="text-sm text-red-600">
                            {errors.idCategorySystem.message}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="urgency"
                          className="block text-sm font-medium text-gray-900"
                        >
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
                              className={clsx(
                                errors.idUrgency
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                              )}
                              options={urgencyOptions}
                              styles={styledReactSelect}
                              placeholder="Select urgency..."
                            />
                          )}
                        />
                        {errors.idUrgency && (
                          <p className="text-sm text-red-600">
                            {errors.idUrgency.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="impact"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Impact
                        </label>
                        <Controller
                          name="idImpact"
                          control={control}
                          rules={{ required: "This is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              className={clsx(
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
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Affected System
                        </dt>
                        <textarea
                          id="impact-system"
                          {...register("impactedSystem", {
                            required: "This is required!",
                            minLength: {
                              value: 30,
                              message:
                                "Please lengthen this text to 30 characters or more.",
                            },
                          })}
                          rows={5}
                          className={clsx(
                            errors.impactedSystem
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500",
                            "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          )}
                          placeholder="What service/system that impacted?"
                          defaultValue={
                            incident.data.impactedSystem
                              ? incident.data.impactedSystem
                              : ""
                          }
                        />
                        {errors.impactedSystem && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.impactedSystem.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Root Cause
                        </dt>
                        <textarea
                          id="root-cause"
                          {...register("rootCause", {
                            required: "This is required!",
                            minLength: {
                              value: 30,
                              message:
                                "Please lengthen this text to 30 characters or more.",
                            },
                          })}
                          rows={5}
                          className={clsx(
                            errors.rootCause
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500",
                            "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          )}
                          placeholder="Explain the Root Cause Analysis"
                          defaultValue={
                            incident.data.rootCause
                              ? incident.data.rootCause
                              : ""
                          }
                        />
                        {errors.rootCause && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.rootCause.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Action Items
                        </dt>
                        <textarea
                          id="action-items"
                          {...register("actionItem", {
                            required: "This is required!",
                            minLength: {
                              value: 30,
                              message:
                                "Please lengthen this text to 30 characters or more.",
                            },
                          })}
                          rows={5}
                          className={clsx(
                            errors.actionItem
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500",
                            "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          )}
                          placeholder="What do we do to fix the incident? What happened?"
                          defaultValue={
                            incident.data.actionItem
                              ? incident.data.actionItem
                              : ""
                          }
                        />
                        {errors.actionItem && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.actionItem.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 sm:col-span-2">
                        <Switch
                          checked={enhancement}
                          onChange={handleSwitch}
                          className={clsx(
                            enhancement ? "bg-blue-600" : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          )}
                        >
                          <span className="sr-only">Need permanent fix?</span>
                          <span
                            aria-hidden="true"
                            className={clsx(
                              enhancement ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                        <div>
                          <label className="block text-sm text-gray-700 font-regular">
                            Need improvement or permanent fix?
                          </label>
                          <span className="inline-block text-xs text-gray-400 align-top">
                            Please switch the toggle if the incident need
                            improvement or permanent fix
                          </span>
                        </div>
                      </div>
                      {enhancement === true && (
                        <>
                          <div className="sm:col-span-1">
                            <label
                              htmlFor="log-start"
                              className="block mb-1 text-sm font-medium text-gray-900"
                            >
                              Problem Type
                            </label>
                            <Controller
                              name="idProblemType"
                              control={control}
                              rules={{ required: "This is required!" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  isClearable
                                  className={clsx(
                                    errors.idProblemType
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                  )}
                                  options={enhanceOptions}
                                  styles={styledReactSelect}
                                  placeholder="Select Problem Type"
                                />
                              )}
                            />
                            {errors.idProblemType && (
                              <p className="text-sm text-red-600">
                                {errors.idProblemType.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-900">
                              Proposed Enhancement
                            </dt>
                            <textarea
                              id="proposed-enhancement"
                              {...register("proposedEnhancement", {
                                required: "This is required!",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              rows={4}
                              className={clsx(
                                errors.proposedEnhancement
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="What should be done to avoid this in future?"
                              defaultValue={
                                incident.data.proposedEnhancement
                                  ? incident.data.proposedEnhancement
                                  : ""
                              }
                            />
                            {errors.proposedEnhancement && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.proposedEnhancement.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Lesson Learned
                        </dt>
                        <textarea
                          id="action-items"
                          {...register("lessonLearned", {
                            required: "This is required!",
                          })}
                          rows={4}
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="The lesson that we take from this incident."
                          defaultValue={
                            incident.data.lessonLearned
                              ? incident.data.lessonLearned
                              : ""
                          }
                        />
                        {errors.lessonLearned && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lessonLearned.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Responsible Team
                        </dt>
                        <textarea
                          id="responsible-engineer"
                          {...register("responsibleEngineer", {
                            required: "This is required!",
                          })}
                          rows={3}
                          className={clsx(
                            errors.responsibleEngineer
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500",
                            "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          )}
                          placeholder="The person(s) who attended the support call and had most context of what happened."
                          defaultValue={
                            incident.data.responsibleEngineer
                              ? incident.data.responsibleEngineer
                              : ""
                          }
                        />
                        {errors.responsibleEngineer && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.responsibleEngineer.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </section>
              </form>
            ) : (
              <section aria-labelledby="incident-detail">
                <div className="bg-white shadow sm:rounded-lg">
                  <CardTitle
                    title={`Incident Report ${incident.data.incidentNumber}`}
                    subtitle={
                      incident.data.resolvedIntervals
                        ? `Duration ${incident.data.resolvedIntervals} minutes`
                        : `Started ${format(
                            new Date(incident.data.startTime),
                            "dd MMMM yyyy HH:mm",
                            "id-ID"
                          )}`
                    }
                  >
                    <div className="flex px-4">
                      {user.grant != "viewer" && (
                        <Tooltip title="Edit">
                          <span>
                            <ButtonCircle
                              action={() => {
                                setEditMode(true);
                              }}
                              className="text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-50"
                            >
                              <PencilIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </ButtonCircle>
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </CardTitle>
                  <CardContent>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-900">
                        Application
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.paramApps
                          ? incident.data.paramApps.subName
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-900">
                        Incident Priority
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.paramPriorityMatrix
                          ? incident.data.paramPriorityMatrix.mapping
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-900">
                        Urgency
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.paramUrgency
                          ? incident.data.paramUrgency.urgency
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-900">
                        System Category Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.paramCategorySystem?.categorySystem}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Impact
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.paramImpact
                          ? incident.data.paramImpact.impact
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Affected System
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.impactedSystem
                          ? incident.data.impactedSystem
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Root Cause
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.rootCause
                          ? incident.data.rootCause
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Action Items
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.actionItem
                          ? incident.data.actionItem
                          : "Not defined yet"}
                      </dd>
                    </div>
                    {incident.data.isProblem !== "N" && (
                      <>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Proposed Enhancement
                          </dt>
                          <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                            {incident.data.proposedEnhancement
                              ? incident.data.proposedEnhancement
                              : "No need improvement"}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Lesson Learned
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.lessonLearned
                          ? incident.data.lessonLearned
                          : "Not defined yet"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-900">
                        Responsible Team
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                        {incident.data.responsibleEngineer
                          ? incident.data.responsibleEngineer
                          : "Not defined yet"}
                      </dd>
                    </div>
                  </CardContent>
                </div>
              </section>
            )}

            {/* Comments */}
            <section aria-labelledby="notes-title">
              <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                    <h2
                      id="notes-title"
                      className="text-lg font-medium text-gray-900"
                    >
                      Notes
                    </h2>
                  </div>
                  <div className="px-4 py-6 sm:px-6">
                    <ul className="space-y-8">
                      {newComments.data.length > 0 &&
                        newComments.data.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <UserCircleIcon
                                  className="w-10 h-10 text-gray-500"
                                  aria-hidden="true"
                                />
                              </div>
                              <div>
                                <div className="text-sm">
                                  <a
                                    href="#"
                                    className="font-medium text-gray-900"
                                  >
                                    {comment.incidentCommentCreatedBy.fullname}
                                  </a>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  {comment.attachmentType === "image" ? (
                                    <AntdImage
                                      width={200}
                                      className="rounded-md"
                                      src={comment.attachment}
                                      alt=""
                                    />
                                  ) : comment.attachmentType === "document" ? (
                                    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                      <div className="w-80 pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                        <div className="w-0 flex-1 flex items-center">
                                          <DocumentTextIcon
                                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          <span className="ml-2 flex-1 w-0 truncate">
                                            {comment.originalAttachmentName}
                                          </span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                          <a
                                            href={comment.attachment}
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <p className="mt-2">{comment.messages}</p>
                                </div>

                                <div className="mt-2 text-xs space-x-2">
                                  <Tooltip
                                    placement="left"
                                    title={format(
                                      new Date(comment.createdAt),
                                      "dd MMM yyyy HH:mm"
                                    )}
                                  >
                                    <span className="text-gray-500 font-medium">
                                      {formatDistanceToNowStrict(
                                        new Date(comment.createdAt)
                                      )}{" "}
                                      ago
                                    </span>
                                  </Tooltip>
                                  {user.username ===
                                    comment.incidentCommentCreatedBy
                                      .username && (
                                    <>
                                      <span className="text-gray-500 font-medium">
                                        &middot;
                                      </span>{" "}
                                      <button
                                        type="button"
                                        className="text-red-500 font-medium"
                                        onClick={() =>
                                          showDeleteConfirm(comment.id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Footer section of comment */}
                {user.grant != "viewer" && (
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <UserCircleIcon
                          className="w-10 h-10 text-gray-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <form key={2} onSubmit={handleSubmit2(onSubmitComment)}>
                          <div>
                            <label htmlFor="comment" className="sr-only">
                              About
                            </label>
                            <textarea
                              {...register2("comment")}
                              id="comment"
                              name="comment"
                              rows={3}
                              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Add a note"
                              defaultValue={""}
                            />
                          </div>
                          <div className="mt-2">
                            <Upload
                              beforeUpload={(file) => {
                                setShowList(true);
                                setFileList(file);
                              }}
                              onRemove={() => setFileList([])}
                              listType="picture"
                              maxCount={1}
                              showUploadList={showList}
                            >
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm italic rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                              >
                                <PaperClipIcon
                                  className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
                                  aria-hidden="true"
                                />
                                Attach a file or drag here
                              </button>
                            </Upload>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <Tooltip
                              title="You can send text or images at the same time, or one of them"
                              placement="left"
                            >
                              <a
                                href="#"
                                className="group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <span>One of them is okay.</span>
                              </a>
                            </Tooltip>
                            <PrimaryButton
                              type="submit"
                              className={
                                isSubmitting2
                                  ? "disabled:opacity-50 cursor-not-allowed"
                                  : ""
                              }
                              disabled={isSubmitting2}
                            >
                              {isSubmitting2 && <Spinner />}
                              Comment
                            </PrimaryButton>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* End of Comments */}
          </div>

          <section
            aria-labelledby="incident-info"
            className="lg:col-start-3 lg:col-span-1"
          >
            <div className="bg-white shadow sm:rounded-lg">
              {/* Incident Info */}
              <div className="px-4 py-5 space-y-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-medium text-gray-900">
                    Incident Type
                  </h2>
                  <ul className="mt-2 leading-8">
                    <li className="inline">
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                      >
                        <div className="absolute flex items-center justify-center flex-shrink-0">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-rose-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3.5 text-sm font-medium text-gray-600">
                          {incident.data.paramIncidentType
                            ? incident.data.paramIncidentType.incidentType
                            : "-"}
                        </div>
                      </a>{" "}
                    </li>
                    <li className="inline">
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                      >
                        <div className="absolute flex items-center justify-center flex-shrink-0">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-blue-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3.5 text-sm font-medium text-gray-600">
                          {incident.data.paramApps
                            ? incident.data.paramApps.criticalityApp
                            : "-"}
                        </div>
                      </a>{" "}
                    </li>
                  </ul>
                </div>
                <h2 className="text-sm font-medium text-gray-900">
                  Time to Discover
                </h2>
                <div className="flex items-center space-x-2">
                  <ExclamationCircleIcon
                    className="w-5 h-5 text-yellow-600"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-600">
                    {`Detect : ${incident.data.detectIntervals} minutes`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshIcon
                    className="w-5 h-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-600">
                    {incident.data.resolvedIntervals
                      ? `Recover : ${incident.data.resolvedIntervals} minutes`
                      : "Not recovered yet"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    From{" "}
                    {incident.data.logStartTime
                      ? format(
                          new Date(incident.data.logStartTime),
                          "dd MMMM yyyy HH:mm",
                          "id-ID"
                        )
                      : "-"}{" "}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Until{" "}
                    {incident.data.endTime
                      ? format(
                          new Date(incident.data.endTime),
                          "dd MMMM yyyy HH:mm",
                          "id-ID"
                        )
                      : "(not recovered yet)"}{" "}
                  </span>
                </div>
                <hr />
                {/* Reporter */}
                <div className="px-4 py-2 space-y-4 sm:px-2">
                  <h2 className="text-sm font-medium text-gray-900">
                    Reporter
                  </h2>
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon
                      className="w-6 h-6 text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-600">
                      {incident.data.paramCreatedBy
                        ? incident.data.paramCreatedBy.fullname
                        : "undefined"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Last updated on{" "}
                      {incident.data.updatedAt
                        ? format(
                            new Date(incident.data.updatedAt),
                            "dd MMM yyyy HH:mm",
                            "id-ID"
                          )
                        : format(
                            new Date(incident.data.createdAt),
                            "dd MMM yyyy HH:mm",
                            "id-ID"
                          )}{" "}
                      <br />
                      by{" "}
                      {incident.data.paramUpdatedBy
                        ? incident.data.paramUpdatedBy.fullname
                        : incident.data.paramCreatedBy.fullname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Problem Info Management*/}
            {incident.data.isProblem !== "N" && (
              <div className="mt-3 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 space-y-4 sm:px-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">
                      Problem Detail
                    </h2>
                    {/* Tampilan yang di atas */}
                    <div className="ml-3.5 mt-3 text-sm font-medium text-gray-600">
                      Problem Number : {""}
                      {incident.data.problemDetail.problemNumber === null
                        ? "-"
                        : incident.data.problemDetail.problemNumber}
                    </div>
                    <div className="ml-3.5 mt-3 text-sm font-medium text-gray-600">
                      Assigned to : {""}
                      {incident.data.problemDetail.paramAssignedTo === null
                        ? "-"
                        : incident.data.problemDetail.paramAssignedTo.fullname}
                    </div>

                    {/* Detail Type dan Status */}
                    <div className="flex flex-wrap ml-3.5 mt-3 text-sm font-medium relative text-gray-600  px-3 py-0.5 items-center">
                      <span
                        className="absolute h-1.5 w-1.5 rounded-full bg-rose-500 items-center justify-center"
                        aria-hidden="true"
                      />
                      <div className="ml-3.5 text-sm font-medium text-gray-600">
                        Type : {""}
                        {incident.data.paramProblemType === null
                          ? "Not Yet"
                          : incident.data.paramProblemType.problemType}
                      </div>
                    </div>
                    <div className="inline-flex ml-3.5 mt-3 text-sm font-medium relative text-gray-600  px-3 py-0.5 items-center ">
                      <span
                        className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500 items-center justify-center"
                        aria-hidden="true"
                      />
                      <div className="ml-3.5 text-sm font-medium text-gray-600">
                        {incident.data.problemDetail
                          ? `Status : ${incident.data.problemDetail.paramProblemStatus.problemStatus}`
                          : "Problem Status Not yet"}
                      </div>
                    </div>
                    {/* Akhir Detail Type dan Status */}
                  </div>
                  <div>
                    {/* Improvement */}
                    <h2 className="text-sm font-medium text-gray-900">
                      Improvement
                    </h2>
                    <ul className="px-3 mt-2 leading-8">
                      <li className="inline">
                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                        >
                          <div className="absolute flex items-center justify-center flex-shrink-0">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-600">
                            {incident.data.problemDetail.paramFollowUpPlan
                              .followUpPlan === "Not yet"
                              ? "None"
                              : incident.data.problemDetail.paramFollowUpPlan
                                  .followUpPlan}
                            {/* ? incident.data.problemDetail.paramFollowUpPlan.followUpPlan
                                  : "None"} */}
                          </div>
                        </a>{" "}
                      </li>
                    </ul>
                    {/* Link */}
                    <h2 className="mt-2 text-sm font-medium text-gray-900">
                      Link
                    </h2>
                    <ul className="mt-2 leading-8">
                      {/* Link Jira*/}
                      <li className="inline">
                        {incident.data.problemDetail.jiraProblem !== null && (
                          <div className="relative inline-flex items-center rounded-full border border-gray-600 bg-gray-900 px-2 py-0.5 ml-2">
                            <div className="ml-1.5 mr-1.5 text-sm font-medium">
                              {incident.data.problemDetail.jiraProblem ===
                              null ? (
                                <span className="text-white">Jira</span>
                              ) : (
                                <div>
                                  <a
                                    className="ml-6 text-white"
                                    href={
                                      incident.data.problemDetail.jiraProblem
                                    }
                                    target="_blank"
                                  >
                                    <ExternalLinkIcon
                                      className="absolute flex items-center justify-center flex-shrink-0 w-5 h-5"
                                      aria-hidden="true"
                                    />
                                    Jira
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </li>

                      {/* Link Change Management*/}
                      <li className="inline">
                        {incident.data.problemDetail.followUpCM !== null && (
                          <div className="relative inline-flex items-center rounded-full border border-gray-600 bg-cyan-700 px-2 py-0.5 ml-2">
                            <div className="ml-1.5 mr-1.5 text-sm font-medium">
                              {incident.data.problemDetail.followUpCM ===
                              null ? (
                                <span className="text-white">
                                  Change Management
                                </span>
                              ) : (
                                <div>
                                  <a
                                    className="ml-6 text-white"
                                    href={
                                      incident.data.problemDetail.followUpCM
                                    }
                                    target="_blank"
                                  >
                                    <ExternalLinkIcon
                                      className="absolute flex items-center justify-center flex-shrink-0 w-5 h-5"
                                      aria-hidden="true"
                                    />
                                    Change Management
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </LayoutPageContent>
    </LayoutPage>
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

  // get data incident detail
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/incidents/${params.id}`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  const data = await res.json();

  // get data incident comment
  const getComment = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/incidents/${params.id}/comment`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  const comment = await getComment.json();

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: req.session.get("user"),
        incident: data,
        comments: comment,
      },
    };
  } else if (res.status === 401) {
    if (data.code === 999) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    } else if (data.code === 401) {
      return {
        notFound: true,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});
