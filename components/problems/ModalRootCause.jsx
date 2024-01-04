import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BadgeCheckIcon } from "@heroicons/react/outline";
import { Spinner } from "components/ui/svg/spinner";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import { styledReactSelectAdd } from "components/utils";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { Controller, useForm } from "react-hook-form";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ModalRootCause({ user, problem }) {
  const [open, setOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const makeRootCause = async (event) => {
    Object.assign(event, {
      idProblem: problem.id,
      idApps: problem.app.id,
      source: "Problem",
      title: problem.problemName,
      createdBy: user.id,
      updatedBy: user.id,
      incidents: problem.incidents,
    });

    if (problem.jiraProblem == null || problem.jiraProblem == "") {
      toast.error("Message: Harus Menyertakan Link JIRA yang Valid");
    } else if (
      event.changeManagement &&
      !event.changeManagement.includes("confluence.bri.co.id")
    ) {
      toast.error("Message: Harus Menyertakan Link Confluence yang Valid");
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/rootcause/insert`,
          event,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response.status === 201) {
            toast.success("Problem Sucessfully Done and KEDB Created");
            setTimeout(() => router.reload(), 1000);
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
  };

  return (
    <>
      {problem.jiraProblem == "" || problem.jiraProblem == null ? null : (
        <button
          type="button"
          className="w-100 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => setOpen(true)}
        >
          Update to Done
        </button>
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                style={{ maxWidth: 46 + `rem` }}
              >
                <form onSubmit={handleSubmit(makeRootCause)}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <BadgeCheckIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Insert Known Error Record
                        </Dialog.Title>

                        <div className="grid grid-cols-1 sm:grid-cols-1">
                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Problem Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {problem.problemNumber
                                ? problem.problemNumber
                                : "Not defined yet"}
                            </dd>
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Problem Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {problem.problemName
                                ? problem.problemName
                                : "Not defined yet"}
                            </dd>
                          </div>

                          <div className="text-sm text-gray-500 py-2">
                            <i>
                              <b>
                                Please input some information below based on the
                                PAR document that has been approved.
                              </b>
                              <br />
                              If there is some image/chart/table, please
                              summarize it.
                            </i>
                          </div>

                          {problem.followUp.label.includes("CM") ? (
                            <div className="sm:col-span-1 py-2">
                              <dt className="text-sm font-medium text-gray-500">
                                Change Management Document
                              </dt>
                              <textarea
                                required
                                id="changeManagement"
                                name="changeManagement"
                                {...register("changeManagement", {
                                  required: "This is required!",
                                })}
                                rows={1}
                                style={{
                                  resize: "none",
                                }}
                                className={classNames(
                                  errors.changeManagament
                                    ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                    : "focus:ring-blue-500 focus:border-blue-500",
                                  "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                )}
                                placeholder="Confluence Link"
                              />
                            </div>
                          ) : null}

                          {/* COBA ENHANCE DARI SINI */}
                          {/* <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Estimasi Total Kerugian
                            </dt>
                            <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                Rp.
                              </span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Aplikasi Surrounding Yang Terdampak
                            </dt>
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
                                />
                              )}
                            />
                            {errors.idApps && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.idApps.message}
                              </p>
                            )}
                          </div> */}
                          {/* SAMPE SINI */}

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Description
                            </dt>
                            <textarea
                              required
                              id="description"
                              name="description"
                              {...register("description", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.description
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Description"
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Impacted System
                            </dt>
                            <textarea
                              required
                              id="impactSystem"
                              name="impactSystem"
                              {...register("impactSystem", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.impactSystem
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Impacted System"
                            />
                            {errors.impactSystem && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.impactSystem.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Root Cause
                            </dt>
                            <textarea
                              required
                              id="rootCause"
                              name="rootCause"
                              {...register("rootCause", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.rootCause
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Root Cause"
                            />
                            {errors.rootCause && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.rootCause.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Resolution
                            </dt>
                            <textarea
                              required
                              id="resolution"
                              name="resolution"
                              {...register("resolution", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.resolution
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Resolution"
                            />
                            {errors.resolution && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.resolution.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Lesson Learned
                            </dt>
                            <textarea
                              required
                              id="lessonLearned"
                              name="lessonLearned"
                              {...register("lessonLearned", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.lessonLearned
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Lesson Learned"
                            />
                            {errors.lessonLearned && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.lessonLearned.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Not sure
                    </button>
                    <button
                      type="submit"
                      ref={cancelButtonRef}
                      className={classNames(
                        spinner
                          ? "px-4 disabled:opacity-50 cursor-not-allowed"
                          : null,
                        "mt-3 w-full inline-flex justify-center rounded-md border border-green-300 shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      )}
                      disabled={spinner}
                    >
                      {spinner && <Spinner />}
                      Yes, Done
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
