const CellMetric = ({ row }) => {
  return (
    <>
      <tr className="text-left bg-blue-50">
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          <b>{row.hcMetric.name}</b>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </>
  );
};

export default CellMetric;
