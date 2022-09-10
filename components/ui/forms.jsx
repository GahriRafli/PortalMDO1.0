import Select from "react-select";
import { styledReactSelect, classNames } from "components/utils";

const Input = ({ label, name, placeholder, className, register, required }) => (
  <>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...register(name, { required })}
      type="text"
      name={name}
      className={classNames(
        "mt-1 block shadow-sm border-gray-300 sm:text-sm rounded-md w-full",
        className
      )}
      placeholder={placeholder}
    />
  </>
);

const ReactSelect = ({ className, ...rest }) => (
  <Select
    className={classNames(
      "text-sm focus:ring-blue-300 focus:border-blue-300",
      className
    )}
    styles={styledReactSelect}
    {...rest}
  />
);

const InputFile = ({ className, ...rest }) => (
  <label class="block">
    <span class="sr-only">Choose File</span>
    <input
      type="file"
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </label>
);

export { Input, ReactSelect, InputFile };
