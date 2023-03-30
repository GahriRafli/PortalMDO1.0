import { useForm } from "react-hook-form";
import { ReactSelect } from "components/ui/forms";

const selectResult = [
  { value: "Passed", label: "Passed" },
  { value: "Not Passed", label: "Not Passed" },
  { value: "No Data", label: "No Data" },
  { value: "N/A", label: "N/A" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MetricsThree = () => {
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

  return (
    <>
      <div className="grid grid-cols-4 gap-4 pt-6 px-6">
        <div className="self-center">
          <label className="text-sm font-medium text-gray-700">
            Processor Utilization
          </label>
        </div>

        <div className="col-span-2">
          <textarea
            id="problemName"
            name="problemName"
            {...register("problemName", {
              required: "This is required!",
              minLength: {
                value: 10,
                message: "Please lengthen this text to 10 characters or more.",
              },
              maxLength: {
                value: 60,
                message: "Please shorten this text to 60 characters or less.",
              },
            })}
            rows={1}
            style={{
              resize: "vertical",
            }}
            className={classNames(
              errors.problemName
                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                : "focus:ring-blue-500 focus:border-blue-500",
              "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
            )}
            placeholder="Result Description"
          />
          {errors.problemName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.problemName.message}
            </p>
          )}
        </div>

        <div className="">
          <ReactSelect
            isDisabled={false}
            options={selectResult}
            isClearable
            className="block w-full"
            // onChange={handleStatusProblemChange}
          />
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
            id="problemName"
            name="problemName"
            {...register("problemName", {
              required: "This is required!",
              minLength: {
                value: 10,
                message: "Please lengthen this text to 10 characters or more.",
              },
              maxLength: {
                value: 60,
                message: "Please shorten this text to 60 characters or less.",
              },
            })}
            rows={1}
            style={{
              resize: "vertical",
            }}
            className={classNames(
              errors.problemName
                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                : "focus:ring-blue-500 focus:border-blue-500",
              "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
            )}
            placeholder="Result Description"
          />
          {errors.problemName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.problemName.message}
            </p>
          )}
        </div>

        <div className="">
          <ReactSelect
            isDisabled={false}
            options={selectResult}
            isClearable
            className="block w-full"
            // onChange={handleStatusProblemChange}
          />
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
            id="problemName"
            name="problemName"
            {...register("problemName", {
              required: "This is required!",
              minLength: {
                value: 10,
                message: "Please lengthen this text to 10 characters or more.",
              },
              maxLength: {
                value: 60,
                message: "Please shorten this text to 60 characters or less.",
              },
            })}
            rows={1}
            style={{
              resize: "vertical",
            }}
            className={classNames(
              errors.problemName
                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                : "focus:ring-blue-500 focus:border-blue-500",
              "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
            )}
            placeholder="Result Description"
          />
          {errors.problemName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.problemName.message}
            </p>
          )}
        </div>

        <div className="">
          <ReactSelect
            isDisabled={false}
            options={selectResult}
            isClearable
            className="block w-full"
            // onChange={handleStatusProblemChange}
          />
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
            id="problemName"
            name="problemName"
            {...register("problemName", {
              required: "This is required!",
              minLength: {
                value: 10,
                message: "Please lengthen this text to 10 characters or more.",
              },
              maxLength: {
                value: 60,
                message: "Please shorten this text to 60 characters or less.",
              },
            })}
            rows={1}
            style={{
              resize: "vertical",
            }}
            className={classNames(
              errors.problemName
                ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                : "focus:ring-blue-500 focus:border-blue-500",
              "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"
            )}
            placeholder="Result Description"
          />
          {errors.problemName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.problemName.message}
            </p>
          )}
        </div>

        <div className="">
          <ReactSelect
            isDisabled={false}
            options={selectResult}
            isClearable
            className="block w-full"
            // onChange={handleStatusProblemChange}
          />
        </div>
      </div>
    </>
  );
};

export default MetricsThree;
