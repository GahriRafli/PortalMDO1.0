import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import * as ProblemHelper from "components/problems/ProblemHelper";
import { Spinner } from "components/ui/svg/spinner";
import { ButtonCircle } from "components/ui/button/button-circle";
// import { toast } from "react-toastify";
import { toast } from "react-hot-toast";
import { PencilIcon, UserCircleIcon, BanIcon } from "@heroicons/react/solid";
import { styledReactSelect } from "components/utils";

import NonAssignModule from "./NonAssignModule";
import RejectModule from "./RejectModule";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AssignModule = ({ problem, user, idProblem }) => {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [toAES, setToAES] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      assignedTo: problem.assigned_to
        ? {
            label: problem.assigned_to.fullName,
            value: problem.assigned_to.id,
          }
        : false,
    },
  });

  // Get data User
  const [assignOptions, setAssignOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/user/assigned/aes`)
      .then((response) => {
        const data = response.data.data.map((user) => ({
          value: user.id,
          label: user.fullName,
        }));
        setAssignOptions(data);
      })
      .catch((err) => toast.error(`Assign ${err}`));
  }, []);

  const makeAssign = async (data, event) => {
    event.preventDefault();
    let dataAssign = {};
    Object.assign(dataAssign, {
      idStatus: 2,
      updatedBy: user.id,
      assignedTo: parseInt(event.target.assignedTo.value),
    });
    if (dataAssign.assignedTo) {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/recprob/${idProblem}`,
          dataAssign,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success("Problem Sucessfully Assigned");
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
      toast.error("Team Member sebagai Investigator belum dipilih");
    }
  };

  const [reassignMode, setReassignMode] = useState(false);
  const makeReAssign = async (data, event) => {
    event.preventDefault();
    let dataReAssign = {};
    Object.assign(dataReAssign, {
      updatedBy: user.id,
      assignedTo: parseInt(event.target.assignedTo.value),
    });
    if (dataReAssign.assignedTo) {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/reassign/${idProblem}`,
          dataReAssign,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success("Team Member Investigator berhasil di Update");
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
      toast.error("Team Member sebagai Investigator belum dipilih");
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h2 className="my-0 text-sm font-medium text-gray-900">Assignment</h2>
        {/* Beginning of Kondisional reassign untuk TL */}
        {ProblemHelper.checkTLAES(user) &&
        problem.problemStatus.id !== 4 &&
        problem.assigned_to !== null ? (
          // && problem.incidents.length > 0
          // && [...problem.incidents].shift().isProblem != "R"
          <span className="text-yellow-600 text-sm ml-auto mr-0">
            <ButtonCircle
              action={() => {
                {
                  !reassignMode
                    ? setReassignMode(true)
                    : setReassignMode(false);
                }
              }}
              className="pl-3 pr-2 border-yellow-300 bg-yellow-100 hover:bg-yellow-50"
            >
              Re-Assign
              <PencilIcon className="ml-1 h-5 w-5" aria-hidden="true" />
            </ButtonCircle>
          </span>
        ) : null}
        {/* End of Kondisional reassign untuk TL */}

        {/* Beginning of Kondisional reject untuk TL */}
        {ProblemHelper.checkTLAES(user) &&
        problem.problemStatus.id !== 7 &&
        problem.assigned_to === null ? (
          <RejectModule problem={problem} user={user} />
        ) : problem.problemStatus.id === 7 ? (
          <span className="text-red-600 text-sm ml-auto mr-0">
            <ButtonCircle className="pl-3 pr-2 border-red-500 bg-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300">
              Rejected
              <BanIcon className="ml-1 h-5 w-5" aria-hidden="true" />
            </ButtonCircle>
          </span>
        ) : null}
        {/* End of Kondisional reject untuk TL */}
      </div>

      {ProblemHelper.checkTLAES(user) &&
      problem.assigned_to == null &&
      [...problem.incidents].shift().isProblem != "R" ? (
        <div className="flex flex-cols-3 gap-2 items-center">
          <button
            style={{ width: "33%" }}
            type="button"
            className="inline-flex justify-center py-2 px-2 border border-rose-500 shadow-sm text-sm font-normal rounded-md text-rose-500 bg-transparent hover:bg-rose-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300"
            onClick={() => {
              !toAES ? setToAES(true) : setToAES(false);
            }}
          >
            AES Member
          </button>
          <NonAssignModule problem={problem} user={user} option="opa" />
          <NonAssignModule problem={problem} user={user} option="agile" />
        </div>
      ) : null}

      {reassignMode == true ? (
        <>
          <form onSubmit={handleSubmit(makeReAssign)}>
            <Controller
              name="assignedTo"
              control={control}
              defaultValue={problem.assigned_to.id}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={assignOptions}
                  styles={styledReactSelect}
                  className="block w-60 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            <button
              type="submit"
              className={classNames(
                spinner ? "px-4 disabled:opacity-50 cursor-not-allowed" : null,
                "mt-4 w-60 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-normal rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
              disabled={spinner}
            >
              {spinner && <Spinner />}
              Submit
            </button>
            {errors.assignedTo && (
              <p className="pt-2 text-sm text-red-600">
                {errors.assignedTo.message}
              </p>
            )}
          </form>
        </>
      ) : null}

      {problem.assigned_to ? (
        !reassignMode ? (
          <div className="flex items-center space-x-2">
            <UserCircleIcon
              className="h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
            <span className="text-gray-600 text-sm">
              {problem.assigned_to.fullName}
            </span>
          </div>
        ) : null
      ) : ProblemHelper.checkTLAES(user) ? (
        <>
          {toAES == true ? (
            <form onSubmit={handleSubmit(makeAssign)}>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    options={assignOptions}
                    styles={styledReactSelect}
                    className="block w-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              <button
                type="submit"
                className={classNames(
                  spinner
                    ? "px-4 disabled:opacity-50 cursor-not-allowed"
                    : null,
                  "mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-normal rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                )}
                style={{ width: "100%" }}
                disabled={spinner}
              >
                {spinner && <Spinner />}
                Submit
              </button>
              {errors.assignedTo && (
                <p className="pt-2 text-sm text-red-600">
                  {errors.assignedTo.message}
                </p>
              )}
            </form>
          ) : null}
        </>
      ) : problem.problemStatus.id == 7 ? null : (
        "Not Yet Assigned"
      )}
    </>
  );
};

export default AssignModule;
