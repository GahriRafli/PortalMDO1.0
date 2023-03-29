const CellResult = ({ row, i }) => {
  const styleData = "px-6 py-3 text-sm text-gray-500 font-normal";

  let explodeDesc = [];
  if (row.description.includes(";")) {
    explodeDesc = row.description.split(";");
  } else {
    explodeDesc = [row.description];
  }
  return (
    <>
      <tr key={`cell-result-${i}`}>
        <td className={styleData}>{row.hcSubmetric.description}</td>
        <td className={styleData}>{row.hcSubmetric.unit}</td>
        <td className={styleData}>{row.hcSubmetric.target}</td>
        <td className={styleData}>
          {explodeDesc.map((desc) => {
            return (
              <>
                {desc} <br />
              </>
            );
          })}
        </td>
        <td className={styleData}>{row.result}</td>
      </tr>
    </>
  );
};

export default CellResult;
