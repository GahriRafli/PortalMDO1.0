const CellResult = ({ row, i }) => {
  return (
    <>
      <tr key={`cell-result-${i}`}>
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          {row.hcSubmetric.description}
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          {row.hcSubmetric.unit}
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          {row.hcSubmetric.target}
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          {row.description}
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
          {row.result}
        </td>
      </tr>
    </>
  );
};

export default CellResult;
