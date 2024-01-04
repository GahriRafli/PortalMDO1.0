import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { classNames } from "components/utils";

export default function Approval({ record, user }) {
  const router = useRouter();
  let tempRecord = record;
  let sentMCS = null;
  let objSent = {};

  const submitMCS = async () => {
    if (tempRecord.status == "Maker") {
      sentMCS = "Checker";
    } else if (tempRecord.status == "Checker") {
      sentMCS = "Signed";
    } else {
      sentMCS = tempRecord.status;
    }

    Object.assign(objSent, {
      status: sentMCS,
      updatedBy: user.id,
    });

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/record/${tempRecord.id}`,
        objSent
      )
      .then(function (response) {
        if (response.status === 200) {
          toast.success(`${sentMCS} Approved`);
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
  };

  return (
    <>
      <div className="relative bg-white px-4 py-5 sm:rounded-lg sm:px-6 sm:my-8">
        <div className="sm:flex sm:items-center">
          <div className="pt-3 text-center sm:pt-0 sm:pl-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Approval
            </h3>
            <div className="pt-2">
              <fieldset className="space-y-5">
                <legend className="sr-only">Document Control</legend>
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    {/* <input
                      id="maker"
                      aria-describedby="maker-checkbox"
                      name="maker"
                      type="checkbox"
                      className="mt-2 focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-indigo-300 rounded cursor-not-allowed"
                      checked={true}
                      disabled={true}
                    /> */}
                    {/* <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"> */}
                    <CheckCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                    {/* </div> */}
                  </div>
                  <div className="ml-3 text-lg">
                    <label
                      htmlFor="maker"
                      className="font-medium text-gray-700"
                    >
                      Maker
                    </label>
                    <p id="maker-checkbox" className="text-gray-500">
                      {record.created_by.fullName}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="relative flex items-center">
                    <div className="flex items-center h-5">
                      <CheckCircleIcon
                        className={classNames(
                          record.status == "Maker"
                            ? "opacity-0"
                            : "opacity-100",
                          "h-6 w-6 text-indigo-600"
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mx-3 text-lg">
                      <label
                        htmlFor="checker"
                        className="font-medium text-gray-700"
                      >
                        Checker
                      </label>
                      <p id="checker-checkbox" className="text-gray-500">
                        Kartika Mutiara Dini
                      </p>
                    </div>
                    {user.userMatrix.desc.includes("TL AES") ||
                    user.fullname.includes("Kartika Mutiara") ? (
                      <div className="mx-3">
                        <button
                          type="button"
                          className={classNames(
                            record.status == "Checker" ||
                              record.status == "Signed"
                              ? "hidden"
                              : "inline-flex",
                            "w-100 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          )}
                          onClick={submitMCS}
                        >
                          Approve
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="relative flex items-center">
                    <div className="flex items-center h-5">
                      <CheckCircleIcon
                        className={classNames(
                          record.status == "Signed"
                            ? "opacity-100"
                            : "opacity-0",
                          "h-6 w-6 text-indigo-600"
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mx-3 text-lg">
                      <label
                        htmlFor="signer"
                        className="text-gray-700 font-medium"
                      >
                        Signer
                      </label>
                      <p id="signer-checkbox" className="text-gray-500">
                        Deni Sukma Adrianto
                      </p>
                    </div>
                    {user.userMatrix.desc.includes("TL AES") ||
                    user.fullname.includes("Kartika Mutiara") ? (
                      <div className="mx-3">
                        <button
                          type="button"
                          className={classNames(
                            record.status == "Checker"
                              ? "inline-flex"
                              : "hidden",
                            "w-100 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          )}
                          onClick={submitMCS}
                        >
                          Approve
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
