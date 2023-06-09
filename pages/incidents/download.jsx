import React, { useState, useEffect, useMemo } from "react";
import withSession from "lib/session";
import { format } from "date-fns";
import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageContent,
} from "components/layout/index";
import clsx from "clsx";
import { DefaultCard } from "components/ui/card/default-card";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { IconOption, ValueOption, styledReactSelect } from "components/utils";
import DownloadTable from "components/incidents/download-table";
import { Controller, useForm } from "react-hook-form";
import { getApplication } from "lib/api-helper";
import axios from "axios";
import { toast } from "react-hot-toast";
import DateRangeFilter from "components/incidents/daterange-filter";
import {
  PrimaryAnchorButton,
  PrimaryButton,
  SecondaryButton,
} from "components/ui/button";
import { Spinner } from "components/ui/svg/spinner";

export default function DownloadIncident({ user, downloadList }) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // Table column variable
  const columns = useMemo(
    () => [
      {
        Header: "File Name",
        accessor: "filenameUid",
        disableSortBy: true,
        Cell: (props) => {
          return (
            <div className="flex items-center">
              <div className="flex-shrink-0 h-7 w-7">
                <img
                  className="h-6 w-6"
                  loading="lazy"
                  src="/xls.png"
                  alt="Excel logo"
                />
                {/* <UserCircleIcon className="h-7 w-7" /> */}
              </div>
              <div className="ml-2">
                <span className="text-sm">{props.value}</span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Periode",
        accessor: "startTime",
        Cell: (props) =>
          `${format(new Date(props.value), "dd-MM-yyyy")} s.d. ${format(
            new Date(props.row.original.endTime),
            "dd-MM-yyyy"
          )}`,
      },
      {
        Header: "Download Time",
        accessor: "createdAt",
        Cell: (props) => format(new Date(props.value), "dd-MM-yyyy HH:mm:ss"),
      },
      {
        Header: "",
        accessor: "downloadFilename",
        disableSortBy: true,
        Cell: (props) => {
          return (
            <PrimaryAnchorButton href={props.value}>
              Download
            </PrimaryAnchorButton>
          );
        },
      },
    ],
    []
  );

  const defaultValues = {
    date: "",
    idApps: "",
    idIncidentType: "",
    incidentStatus: "",
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(downloadList);
  const [portalTarget, setPortalTarget] = useState("");

  // Get data applications with async
  const loadApplications = (value, callback) => {
    getApplication(value, callback, user.accessToken);
  };

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
      .catch((error) => toast.error(`Unable to get incident type list`));
  }, []);

  // Handle react-select dropdown position
  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      setPortalTarget(document.querySelector("body"));
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    const { idApps, idIncidentType, date, incidentStatus } = data;
    const startTime = format(new Date(date[0]), "yyyy-MM-dd");
    const endTime = format(new Date(date[1]), "yyyy-MM-dd");

    //  Primary parameter : tanggal awal dan tanggal akhir
    const params = new URLSearchParams(
      `startTime=${startTime}&endTime=${endTime}`
    );

    if (idApps) params.append("idApps", idApps.value);
    if (idIncidentType) params.append("idIncidentType", idIncidentType.value);
    if (incidentStatus) params.append("incidentStatus", incidentStatus);

    await sleep(5000);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/irdownloads?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((response) => {
        setTableData(response.data.data);
      })
      .catch((error) => toast.error(`Failed to Export ${error}`))
      .finally(() => {
        setLoading(false);
        toast.success("Successfully Export");
      });
  };

  return (
    <LayoutPage session={user} pageTitle="Incident Download - Shield">
      <LayoutPageHeader
        variant="alternate"
        pageTitle={"Incident Download"}
        pageSubTitle="This page is specifically download incident report"
        backButton={true}
        href="/incidents"
      ></LayoutPageHeader>
      <LayoutPageContent>
        <DefaultCard>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Filter
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed incident report so be
                    careful what you share.
                  </p>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Periode<span className="text-xs text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500 italic">
                        (Mandatory field)
                      </span>
                    </div>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Controller
                        control={control}
                        name="date"
                        rules={{ required: "This is required!" }} //optional
                        render={({
                          field: { onChange, name, value },
                          fieldState: { invalid, isDirty }, //optional
                          formState: { errors }, //optional, but necessary if you want to show an error message
                        }) => (
                          <>
                            <DateRangeFilter
                              className="block max-w-lg w-full text-base shadow-sm"
                              onChange={(dateString) => onChange(dateString)}
                              value={value}
                            />

                            {errors.date && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.date.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="idApps"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Application
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Controller
                        name="idApps"
                        control={control}
                        render={({ field }) => (
                          <AsyncSelect
                            {...field}
                            value={field.value || ""}
                            isClearable
                            instanceId={"idApps"}
                            loadOptions={loadApplications}
                            styles={styledReactSelect}
                            className="block max-w-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search for application"
                            components={{
                              Option: IconOption,
                              SingleValue: ValueOption,
                            }}
                            menuPortalTarget={portalTarget}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="idIncidentType"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Incident Type
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Controller
                        name="idIncidentType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            instanceId={"idIncidentType"}
                            className={clsx(
                              errors.idIncidentType
                                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                : "focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md",
                              "block max-w-lg w-full text-base shadow-sm"
                            )}
                            options={incidentTypeOptions}
                            styles={styledReactSelect}
                            placeholder="Select incident type..."
                            value={field.value || ""}
                            menuPortalTarget={portalTarget}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="incidentStatus"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Incident Status
                    </label>
                    <div className="flex mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center mr-4">
                        <input
                          {...register("incidentStatus")}
                          value={"Open"}
                          id="open"
                          name="incidentStatus"
                          type="radio"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label
                          htmlFor="open"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Open
                        </label>
                      </div>
                      <div className="flex items-center mr-4">
                        <input
                          {...register("incidentStatus")}
                          value={"Resolved"}
                          id="resolved"
                          name="incidentStatus"
                          type="radio"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label
                          htmlFor="resolved"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Resolved
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("incidentStatus")}
                          value={"Investigate"}
                          id="investigate"
                          name="incidentStatus"
                          type="radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="investigate"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Investigate
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end space-x-2">
                <PrimaryButton
                  type="submit"
                  className={
                    loading ? "disabled:opacity-50 cursor-not-allowed" : ""
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner /> Exporting...
                    </>
                  ) : (
                    "Export"
                  )}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => reset(defaultValues)}
                >
                  Reset
                </SecondaryButton>
              </div>
            </div>
          </form>
        </DefaultCard>
        <div className="mt-3">
          <DownloadTable
            columns={columns}
            data={tableData}
            initialPageSize={10}
          />
        </div>
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({
  req,
  query,
  res,
}) {
  const user = req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/irdownloads/list`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  return {
    props: {
      user: user,
      downloadList: data.data,
    }, // will be passed to the page component as props
  };
});
