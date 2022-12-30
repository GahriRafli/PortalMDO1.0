import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Disclosure, Switch } from "@headlessui/react";
import { ArrowCircleLeftIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from "react-hot-toast";
import { Input } from "components/ui/forms";
import {
  classNames,
  styledReactSelect,
  styledReactSelectAdd,
  IconOption,
  ValueOption,
  createParam,
} from "components/utils";
import { PrimaryButton } from "components/ui/button/primary-button";
import { SecondaryButton } from "components/ui/button/secondary-button";
import { Spinner } from "components/ui/svg/spinner";
import docs from "components/tickets/docs.json";
import withSession from "lib/session";
import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageContent,
} from "components/layout/index";

export default function addTicket({ user }) {
  // Digunakan utuk fungsi reset form
  const defaultValues = {
    branchName: "",
    branchCode: "",
    picName: "",
    picPN: "",
    picPhone: "",
    sourceManual: "",
    content: "",
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
  const [ticketTypeOptions, setTicketTypeOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  const sourceManualOptions = [
    { value: "Whatsapp", label: "Whatsapp" },
    { value: "Telegram", label: "Telegram" },
  ];

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

  // Get data ticket type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/tickettype?isActive=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.ticketType,
        }));
        setTicketTypeOptions(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await sleep(1000);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, data, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(function (response) {
        if (response.status === 201) {
          !isSubmitting && toast.success("Ticket successfully added");
          router.push("/tickets");
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
    <LayoutPage session={user} pageTitle="Declare New Tickets">
      <LayoutPageHeader
        variant="alternate"
        pageTitle={"Add New Ticket Complaint"}
        backButton={true}
        href="/tickets"
      />
      <LayoutPageContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Section Ticket Detail */}
            <section aria-labelledby="create-new-ticket">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Start */}
                <div className="static overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Branch Code
                        </label>
                        <input
                          {...register("branchCode", {
                            required: "This is required",
                          })}
                          id="branchCode"
                          type="text"
                          name="branchCode"
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe Branch code"
                          defaultValue={""}
                        />
                        {errors.branchCode && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.branchCode.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Branch Name
                        </label>
                        <input
                          {...register("branchName", {
                            required: "This is required",
                          })}
                          id="branchName"
                          name="branchName"
                          type="text"
                          placeholder="Describe Branch Name"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm order focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue={""}
                        />
                        {errors.branchName && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.branchName.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          PIC Name
                        </label>
                        <input
                          {...register("picName", {
                            required: "This is required",
                          })}
                          id="picName"
                          name="picName"
                          type="text"
                          placeholder="Describe PIC Name Ticket"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm order focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue={""}
                        />
                        {errors.picName && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.picName.message}
                          </p>
                        )}
                      </div>

                      {/* Tambahan Pic Name dan Group */}
                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          PIC PN
                        </label>
                        <input
                          {...register("picPN", {
                            required: "This is required",
                          })}
                          id="picPN"
                          name="picPN"
                          type="text"
                          placeholder="Describe PIC PN Ticket"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm order focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue={""}
                        />
                        {errors.picPN && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.picPN.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          PIC Phone
                        </label>
                        <input
                          {...register("picPhone", {
                            required: "This is required",
                          })}
                          id="picPhone"
                          name="picPhone"
                          type="text"
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe PIC Phone TIcket"
                          defaultValue={""}
                        />
                        {errors.picPhone && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.picPhone.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 sm:col-span-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Source Ticket
                        </label>
                        <input
                          {...register("sourceManual", {
                            required: "This is required",
                          })}
                          id="sourceManual"
                          name="sourceManual"
                          type="text"
                          options={sourceManualOptions}
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe Source Ticket, ex : Whatsapp and Telegram"
                          defaultValue={""}
                        />
                        {errors.sourceManual && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.sourceManual.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          {...register("content", {
                            required: "This is required",
                          })}
                          id="content"
                          name="content"
                          rows={10}
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe the systems affected or Problem"
                          defaultValue={""}
                        />
                        {errors.content && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.content.message}
                          </p>
                        )}
                      </div>
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

  return {
    props: {
      user: req.session.get("user"),
    },
  };
});
