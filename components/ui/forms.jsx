import React from "react";
import Select from "react-select";
import { styledReactSelect } from "components/utils";
import clsx from "clsx";

const Input = ({ label, name, placeholder, className, register, required }) => (
  <>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...register(name, { required })}
      type="text"
      name={name}
      className={clsx(
        "mt-1 block shadow-sm border-gray-300 sm:text-sm rounded-md w-full",
        className
      )}
      placeholder={placeholder}
    />
  </>
);

// const RadioInput = React.forwardRef({ label, name, ...rest }, ref) => (
//   <>
//     <input
//       type="radio"
//       name={name}
//       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//       {...rest}
//     />
//     <label
//       htmlFor="inline-radio"
//       className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
//     >
//       {label}
//     </label>
//   </>
// );

const RadioInput = React.forwardRef(
  ({ className, label, name, ...rest }, ref) => (
    <>
      <input
        ref={ref}
        type="radio"
        name={name}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        {...rest}
      />
      <label
        htmlFor="inline-radio"
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </>
  )
);

const TextareaInput = React.forwardRef(
  ({ className, name, rows = 3, ...rest }, ref) => (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      name={name}
      className={clsx(
        "shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md",
        className
      )}
    />
  )
);

const ReactSelect = React.forwardRef(({ className, ...rest }, ref) => (
  <Select
    className={clsx(
      "text-sm focus:ring-blue-300 focus:border-blue-300",
      className
    )}
    styles={styledReactSelect}
    ref={ref}
    {...rest}
  />
));

export { Input, ReactSelect, RadioInput, TextareaInput };
