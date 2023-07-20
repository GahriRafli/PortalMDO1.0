import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Approval({ record, user }) {
  const router = useRouter();
  const { handleSubmit } = useForm({ mode: "onSubmit" });
  let tempRecord = record;
  let sentMCS = null;
  let objSent = {};

  const [status, setStatus] = useState({
    isChecker: null,
    isSigner: null,
    isChecked: null,
    isSigned: null,
  });

  useEffect(() => {
    switch (record.status) {
      case "Maker":
        setStatus({
          isChecker: true,
          isChecked: false,
          isSigned: false,
          isSigner: false,
        });
        break;
      case "Checker":
        setStatus({
          isChecker: false,
          isChecked: true,
          isSigned: false,
          isSigner: true,
        });
        break;
      case "Signed":
        setStatus({
          isChecker: false,
          isChecked: true,
          isSigned: true,
          isSigner: false,
        });
        break;
      default:
        break;
    }
  }, [record.status]);

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
        <div className="sm:flex sm:items-start">
          <div className="pt-3 text-center sm:pt-0 sm:pl-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Approval
            </h3>
            <div className="pt-2">
              <fieldset className="space-y-5">
                <legend className="sr-only">Document Control</legend>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maker"
                      aria-describedby="maker-checkbox"
                      name="maker"
                      type="checkbox"
                      className="mt-2 focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-indigo-300 rounded cursor-not-allowed"
                      checked={true}
                      disabled={true}
                    />
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
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="checker"
                        aria-describedby="checker-checkbox"
                        name="checker"
                        type="checkbox"
                        className={classNames(
                          status.isChecker
                            ? "focus:ring-indigo-500 border-gray-300 cursor-pointer"
                            : "focus:ring-gray-500 cursor-not-allowed",
                          "text-indigo-600 mt-2 h-5 w-5 rounded"
                        )}
                        checked={status.isChecked}
                        disabled={status.isChecked}
                        onClick={submitMCS}
                      />
                    </div>
                    <div className="ml-3 text-lg">
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
                  </div>
                </div>
                <div>
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="signer"
                        aria-describedby="signer-checkbox"
                        name="signer"
                        type="checkbox"
                        className={classNames(
                          status.isSigner
                            ? "focus:ring-indigo-500 border-gray-300 cursor-pointer"
                            : "focus:ring-gray-500 border-gray-300 cursor-not-allowed",
                          "text-indigo-600 mt-2 h-5 w-5 rounded"
                        )}
                        checked={status.isSigned}
                        disabled={status.isSigned}
                        onClick={submitMCS}
                      />
                    </div>
                    <div className="ml-3 text-lg">
                      <label
                        htmlFor="signer"
                        className={classNames(
                          status.isChecked ? "text-gray-700" : "text-gray-400",
                          "font-medium"
                        )}
                      >
                        Signer
                      </label>
                      <p
                        id="signer-checkbox"
                        className={classNames(
                          status.isChecked ? "text-gray-500" : "text-gray-200",
                          null
                        )}
                      >
                        Deni Sukma Adrianto
                      </p>
                    </div>
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
