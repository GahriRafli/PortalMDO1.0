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

export { Input, ReactSelect };
