import { useState } from "react";
import axios from "axios";
import { styledReactSelectAdd } from "components/utils";
import { Controller, useForm } from "react-hook-form";
import { components } from "react-select";
import { toast } from "react-hot-toast";
import { Spinner } from "components/ui/svg/spinner";
import { useRouter } from "next/router";
import AsyncSelect from "react-select/async";
import DatePicker from "components/ui/datepicker";
import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { PhotographIcon } from "@heroicons/react/solid";
import { HealthCheck } from "components/problems/CreateInformation";
const moment = require("moment");
import { ReactSelect } from "components/ui/forms";

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
  const [image, setImage] = useState({ preview: "", data: "" });
  const router = useRouter();

  const selectResult = [
    { value: "Passed", label: "Passed" },
    { value: "Not Passed", label: "Not Passed" },
    { value: "No Data", label: "No Data" },
    { value: "N/A", label: "N/A" },
  ];

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

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  function mecahBaris(input) {
    let oneLiner,
      tempElement = null;
    let mecahBaris = input.split("\n");
    mecahBaris.map((element) => {
      if (tempElement == null) {
        tempElement = element;
      } else {
        tempElement = `${oneLiner};${element}`;
      }
      oneLiner = tempElement;
    });
    return oneLiner;
  }

  const createHealthCheck = async (data, event) => {
    event.preventDefault();
    let fName = null;
    let formData = new FormData();

    // Validasi Image Kosong
    // try {
    if (!image.data == "" || !image.data == null) {
      // if (!image.data.type == "image/jpeg" || !image.data.type == "image/png") {
      //   toast.error("Harus Menggunakan Format JPG/PNG");
      // }

      // Proses Renaming File
      fName = image.data.name.toLowerCase();
      fName.replace(" ", "-");
      fName = `${moment().format("YYYYMMDD")}_${fName}`;
      formData.append("topologyArch", image.data);
    } else {
      toast.error("Image Topology tidak boleh kosong");
    }
    // } catch (error) {
    //   toast.error(error);
    // }

    const sentData = {
      record: {
        idApps: data.idApps.value,
        idFunction: data.idFunction.value,
        healthcheckNumber: event.target.hcNumber.value,
        status: "Maker",
        dayDate: event.target.dayDate.value,
        ipAddress: mecahBaris(event.target.ipAddress.value),
        dataSet: mecahBaris(event.target.dataSet.value),
        appendix: `${fName};${event.target.appendix.value}`,
        createdBy: user.id,
      },
      results: [
        {
          idMetric: 1,
          idSubmetric: 1,
          description: event.target.archDesc.value,
          result: event.target.archResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 1,
          idSubmetric: 2,
          description: event.target.monitoringDesc.value,
          result: event.target.monitoringResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 1,
          idSubmetric: 3,
          description: event.target.versionDesc.value,
          result: event.target.versionResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 1,
          idSubmetric: 4,
          description: event.target.connectionDesc.value,
          result: event.target.connectionResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 2,
          idSubmetric: 5,
          description: event.target.percentileResponseDesc.value,
          result: event.target.percentileResponseResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 2,
          idSubmetric: 6,
          description: event.target.adequacyResponseDesc.value,
          result: event.target.adequacyResponseResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 2,
          idSubmetric: 7,
          description: event.target.throughputDesc.value,
          result: event.target.throughputResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 3,
          idSubmetric: 8,
          description: event.target.processorUtilDesc.value,
          result: event.target.processorUtilResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 3,
          idSubmetric: 9,
          description: event.target.memoryUtilDesc.value,
          result: event.target.memoryUtilResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 3,
          idSubmetric: 10,
          description: event.target.ioDevicesDesc.value,
          result: event.target.ioDevicesResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 3,
          idSubmetric: 11,
          description: event.target.bandwidthUtilDesc.value,
          result: event.target.bandwidthUtilResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 4,
          idSubmetric: 12,
          description: event.target.successRateDesc.value,
          result: event.target.successRateResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 4,
          idSubmetric: 13,
          description: event.target.mtbfDesc.value,
          result: event.target.mtbfResult.value,
          createdBy: user.id,
        },
        {
          idMetric: 4,
          idSubmetric: 14,
          description: event.target.availabilityDesc.value,
          result: event.target.availabilityResult.value,
          createdBy: user.id,
        },
      ],
    };

    if (!sentData.record.dayDate == "" || !sentData.record.dayDate == null) {
      try {
        // Proses Upload File
        const resUpload = await fetch(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/image/arch`,
          {
            method: "POST",
            body: formData,
          }
        );

        // Proses Upload Report
        if (resUpload) {
          setSpinner(true);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/create`,
              sentData,
              {
                headers: { Authorization: `Bearer ${user.accessToken}` },
              }
            )
            .then(function (response) {
              if (response.status === 201) {
                toast.success("Health Check Report Sucessfully Created");
                setTimeout(() => router.push(`/healthcheck`), 1000);
              }
              if (response.status == 204) {
                // toast.success("Kosong");
              } else if (response.status == 200) {
                toast.success("Ingfo Ingfo");
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
        }
      } catch (error) {
        throw error;
      }
    } else {
      toast.error("Report Date Harus Diisi");
    }
  };

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Health Check Form Report"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="create-list-section">
            <PageHeader title="Health Check Form"></PageHeader>
            <div className="hidden sm:block">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
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
                                  required: "This is required!",
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
                                  id="dayDate"
                                  name="dayDate"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <DatePicker
                                      {...field}
                                      instanceId={"dayDate"}
                                      allowClear
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
                                  {...register("ipAddress", {
                                    required: "This is required!",
                                  })}
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
                            <div className="col-span-6 sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Dataset Taken
                              </label>
                              <div className="pt-1">
                                <textarea
                                  name="dataSet"
                                  {...register("dataSet", {
                                    required: "This is required!",
                                  })}
                                  rows={3}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.dataSet
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Date (Metrics)"
                                />
                                {errors.dataSet && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.dataSet.message}
                                  </p>
                                )}
                                <p className="pt-2 text-sm text-gray-500">
                                  Use 'enter' to separate dataset.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Fourth Row */}
                          <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="topologyArch"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Topology Architecture
                              </label>
                              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                  {image.preview ? (
                                    <img
                                      src={image.preview}
                                      width="500px"
                                      height="100%"
                                    />
                                  ) : (
                                    <PhotographIcon
                                      className="mx-auto h-12 w-12 text-gray-300"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <div className="mt-4 text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="topologyArch"
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
                                    >
                                      <span>Upload a file</span>
                                      {/* <Controller
                                        id="topologyArch"
                                        name="topologyArch"
                                        control={control}
                                        rules={{ required: "This is required" }}
                                        render={({ field }) => (
                                          <input
                                            instanceId={"topologyArch"}
                                            type="file"
                                            className="sr-only"
                                            required
                                            onChange={handleFileChange}
                                          />
                                        )}
                                      /> */}
                                      <input
                                        id="topologyArch"
                                        name="topologyArch"
                                        type="file"
                                        className="sr-only"
                                        required
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    {image && <h4>{image.data.name}</h4>}
                                    <p className="text-xs leading-5 text-gray-600">
                                      PNG or JPG up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* {errors.topologyArch && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.topologyArch.message}
                                </p>
                              )} */}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="appendixFile"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Document
                              </label>
                              <textarea
                                name="appendix"
                                {...register("appendix", {
                                  required: "This is required!",
                                })}
                                rows={3}
                                style={{
                                  resize: "vertical",
                                }}
                                className={classNames(
                                  errors.appendix
                                    ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                    : "focus:ring-blue-500 focus:border-blue-500",
                                  "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                )}
                                placeholder="https://confluence.bri.co.id/pages/viewpage.action?pageId="
                              />
                              {errors.appendix && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.appendix.message}
                                </p>
                              )}
                              <p className="pt-2 text-sm text-gray-500">
                                Reference Document Report.
                              </p>
                            </div>
                          </div>

                          {/* Section Configuration */}
                          <section id="Configuration">
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Configuration and Monitoring Tools
                              </label>
                            </div>
                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Architecture
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="archDesc"
                                  name="archDesc"
                                  {...register("archDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.archDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.archDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.archDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="archResult"
                                  name="archResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"archResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.archResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.archResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Monitoring Tools
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="monitoringDesc"
                                  name="monitoringDesc"
                                  {...register("monitoringDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.monitoringDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.monitoringDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.monitoringDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="monitoringResult"
                                  name="monitoringResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"monitoringResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.monitoringResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.monitoringResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Version and Configuration
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="versionDesc"
                                  name="versionDesc"
                                  {...register("versionDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.versionDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.versionDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.versionDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="versionResult"
                                  name="versionResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"versionResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.versionResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.versionResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Connection Pooling
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="connectionDesc"
                                  name="connectionDesc"
                                  {...register("connectionDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.connectionDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.connectionDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.connectionDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="connectionResult"
                                  name="connectionResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"connectionResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.connectionResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.connectionResult.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </section>

                          {/* Section Performance */}
                          <section id="Performance">
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Performance Efficiency
                              </label>
                            </div>
                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Percentile 99 Response time
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="percentileResponseDesc"
                                  name="percentileResponseDesc"
                                  {...register("percentileResponseDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.percentileResponseDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.percentileResponseDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.percentileResponseDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="percentileResponseResult"
                                  name="percentileResponseResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"percentileResponseResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.percentileResponseResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.percentileResponseResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Response Time Adequacy
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="adequacyResponseDesc"
                                  name="adequacyResponseDesc"
                                  {...register("adequacyResponseDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.adequacyResponseDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.adequacyResponseDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.adequacyResponseDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="adequacyResponseResult"
                                  name="adequacyResponseResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"adequacyResponseResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.adequacyResponseResult && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.adequacyResponseResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Throughput
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="throughputDesc"
                                  name="throughputDesc"
                                  {...register("throughputDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.throughputDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.throughputDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.throughputDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="throughputResult"
                                  name="throughputResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"throughputResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.throughputResult && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.throughputResult.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </section>

                          {/* Section Resource Utilization */}
                          <section id="Resource">
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Resource Utilization
                              </label>
                            </div>
                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Processor Utilization
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="processorUtilDesc"
                                  name="processorUtilDesc"
                                  {...register("processorUtilDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.processorUtilDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.processorUtilDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.processorUtilDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="processorUtilResult"
                                  name="processorUtilResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"processorUtilResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.processorUtilResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.processorUtilResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Memory Utilization
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="memoryUtilDesc"
                                  name="memoryUtilDesc"
                                  {...register("memoryUtilDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.memoryUtilDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.memoryUtilDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.memoryUtilDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="memoryUtilResult"
                                  name="memoryUtilResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"memoryUtilResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.memoryUtilResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.memoryUtilResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  I/O Devices
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  name="ioDevicesDesc"
                                  {...register("ioDevicesDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.ioDevicesDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.ioDevicesDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.ioDevicesDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="ioDevicesResult"
                                  name="ioDevicesResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"ioDevicesResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.ioDevicesResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.ioDevicesResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Bandwidth Utilization
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="bandwidthUtilDesc"
                                  name="bandwidthUtilDesc"
                                  {...register("bandwidthUtilDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.bandwidthUtilDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.bandwidthUtilDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.bandwidthUtilDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="bandwidthUtilResult"
                                  name="bandwidthUtilResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"bandwidthUtilResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.bandwidthUtilResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.bandwidthUtilResult.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </section>

                          {/* Realibility Section */}
                          <section id="Realibility">
                            <div className="mt-4 py-2 px-6 bg-blue-200">
                              <label className="block text-lg font-medium text-blue-500">
                                Reliability Measures
                              </label>
                            </div>
                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  Success Rate
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="successRateDesc"
                                  name="successRateDesc"
                                  {...register("successRateDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.successRateDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.successRateDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.successRateDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="successRateResult"
                                  name="successRateResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"successRateResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.successRateResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.successRateResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  MTBF
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="mtbfDesc"
                                  name="mtbfDesc"
                                  {...register("mtbfDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.mtbfDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.mtbfDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.mtbfDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="mtbfResult"
                                  name="mtbfResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"mtbfResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.mtbfResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.mtbfResult.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-6 px-6">
                              <div className="self-center">
                                <label className="text-sm font-medium text-gray-700">
                                  System Availability
                                </label>
                              </div>

                              <div className="col-span-2">
                                <textarea
                                  id="availabilityDesc"
                                  name="availabilityDesc"
                                  {...register("availabilityDesc", {
                                    required: "This is required!",
                                  })}
                                  rows={1}
                                  style={{
                                    resize: "vertical",
                                  }}
                                  className={classNames(
                                    errors.availabilityDesc
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="Result Description"
                                />
                                {errors.availabilityDesc && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.availabilityDesc.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Controller
                                  id="availabilityResult"
                                  name="availabilityResult"
                                  control={control}
                                  rules={{ required: "This is required" }}
                                  render={({ field }) => (
                                    <ReactSelect
                                      {...field}
                                      instanceId={"availabilityResult"}
                                      isSearchable={false}
                                      isDisabled={false}
                                      options={selectResult}
                                      className="block w-full"
                                    />
                                  )}
                                />
                                {errors.availabilityResult && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.availabilityResult.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </section>

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
                    <HealthCheck />
                  </section>
                </div>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
