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

const MetricsFour = () => {
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
            Success Rate
          </label>
        </div>

        <div className="col-span-2">
          <textarea
            id="successRateDesc"
            name="successRateDesc"
            {...register("successRateDesc", {
              // required: "This is required!",
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

        <div className="">
          <ReactSelect
            id="successRateResult"
            name="successRateResult"
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
          <label className="text-sm font-medium text-gray-700">MTBF</label>
        </div>

        <div className="col-span-2">
          <textarea
            id="mtbfDesc"
            name="mtbfDesc"
            {...register("mtbfDesc", {
              // required: "This is required!",
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

        <div className="">
          <ReactSelect
            id="mtbfResult"
            name="mtbfResult"
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
            System Availability
          </label>
        </div>

        <div className="col-span-2">
          <textarea
            id="availabilityDesc"
            name="availabilityDesc"
            {...register("availabilityDesc", {
              // required: "This is required!",
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

        <div className="">
          <ReactSelect
            id="availabilityResult"
            name="availabilityResult"
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

export default MetricsFour;
