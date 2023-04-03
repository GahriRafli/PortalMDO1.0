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

const MetricsTwo = () => {
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

        <div className="">
          <ReactSelect
            id="percentileResponseResult"
            name="percentileResponseResult"
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

        <div className="">
          <ReactSelect
            id="adequacyResponseResult"
            name="adequacyResponseResult"
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

        <div className="">
          <ReactSelect
            id="throughputResult"
            name="throughputResult"
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

export default MetricsTwo;
