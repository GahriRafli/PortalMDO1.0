import { DatePicker } from "antd";

// const { RangePicker } = DatePicker;
const RangePicker = DatePicker.RangePicker;

const DateRangeFilter = ({ ...rest }) => {
  return (
    <RangePicker
      style={{
        borderRadius: "0.375rem",
        width: "100%",
        height: "38px",
      }}
      {...rest}
    />
  );
};

export default DateRangeFilter;
