import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { Spinner } from "components/ui/svg/spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NonAssignModule = ({ problem, user, option }) => {
  const [open, setOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const AssignToAnother = async (data) => {
    let dataAssignAnother = {};
    let conditionAssign;
    if (option == "opa") {
      // Pastiin di DB Existing nya
      conditionAssign = parseInt(process.env.NEXT_PUBLIC_ASSIGN_OPA);
    } else if (option == "agile") {
      // Pastiin di DB Existing nya
      conditionAssign = parseInt(process.env.NEXT_PUBLIC_ASSIGN_AGILE);
    }
    Object.assign(dataAssignAnother, {
      updatedBy: user.id,
      assignedTo: conditionAssign,
      additional: data.additional,
      option: option.toUpperCase(),
    });
    if (dataAssignAnother.assignedTo) {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/assignanother/${problem.id}`,
          dataAssignAnother,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success(
              `Team ${option.toUpperCase()} Sebagai Investigator Berhasil Dipilih`
            );
            setTimeout(() => router.reload(), 1000);
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
            toast.error(`Message: ${error.message}`);
          }
        });
    } else {
      toast.error("Investigator Belum Dipilih");
    }
  };

  return (
    <>
      {option == "opa" ? (
        <button
          style={{ width: "33%" }}
          type="button"
          className="inline-flex justify-center py-2 px-2 border border-yellow-500 shadow-sm text-sm font-normal rounded-md text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
          onClick={() => {
            setOpen(true);
          }}
        >
          OPA Team
        </button>
      ) : null}
      {option == "agile" ? (
        <button
          style={{ width: "33%" }}
          type="button"
          className="inline-flex justify-center py-2 px-2 border border-gray-500 shadow-sm text-sm font-normal rounded-md text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          onClick={() => {
            setOpen(true);
          }}
        >
          Agile Team
        </button>
      ) : null}

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
                <form onSubmit={handleSubmit(AssignToAnother)}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                        <InformationCircleIcon
                          className="h-6 w-6 text-yellow-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Assign this problem to {option.toUpperCase()}
                        </Dialog.Title>

                        <div className="grid grid-cols-1 sm:grid-cols-1">
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

                          <div className="sm:col-span-1 py-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Notes
                            </dt>
                            <textarea
                              required
                              id="additional"
                              name="additional"
                              {...register("additional", {
                                required: "This is required!",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Please lengthen this text to 10 characters or more.",
                                },
                              })}
                              rows={3}
                              style={{
                                resize: "none",
                              }}
                              className={classNames(
                                errors.additional
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder={`Please add some reason why this problem is given to ${option.toUpperCase()}`}
                            />
                            {errors.additional && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.additional.message}
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
                      Cancel
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
                      Assign to {option.toUpperCase()}
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
};

export default NonAssignModule;
