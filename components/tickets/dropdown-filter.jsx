import { useState, useMemo } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { components } from 'react-select';
import { toast } from "react-toastify";
import { styledReactSelect } from "../utils";

function SelectColumnFilter({ column: { setFilter } }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const loadApplications = (inputValue, callback) => {
    clearTimeout(timeoutId);

    if (inputValue.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${inputValue}`
        )
        .then((res) => {
          const cacheOptions = res.data.data.map((d) => ({
            value: d.subName,
            label: d.subName,
          }));

          callback(cacheOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  const handleChange = (value) => {
    const item = !value ? "" : value;
    setSelectedValue(value);
    setFilter(item.value || undefined);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const NoOptionsMessage = props => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Type at least 3 letters of application name</span>
      </components.NoOptionsMessage>
    );
  };

  return (
    <div className="mt-1">
      <AsyncSelect
        styles={styledReactSelect}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-80 sm:text-sm border-gray-300 rounded-md"
        placeholder="Search for application"
        isClearable
        cacheOptions
        loadOptions={loadApplications}
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.value}
        onChange={handleChange}
        onInputChange={handleInputChange}
        value={selectedValue}
        components={{ NoOptionsMessage }}
      />
    </div>
  );
}

function StatusFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  // Calculate the options for filtering. using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-700"
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export { SelectColumnFilter, StatusFilter };