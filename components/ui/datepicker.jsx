/**
 * This example previously used antd-dayjs-webpack-plugin
 * (https://github.com/ant-design/antd-dayjs-webpack-plugin) to attempt to
 * replace Moment.js with date-fns, but it would crash the page when the user
 * clicked on the DatePicker. Using this custom component (following Ant Design
 * guidelines at https://ant.design/docs/react/replace-moment) instead of the
 * webpack plugin fixes that bug.
 */

import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';

const DatePicker = generatePicker(dateFnsGenerateConfig);

export default DatePicker;
