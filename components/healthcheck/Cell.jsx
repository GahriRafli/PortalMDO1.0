const CellHead = ({ styleHead }) => {
  return (
    <tr className="border-t border-gray-200">
      <th className={styleHead} style={{ width: "10rem" }}>
        Metrics
      </th>
      <th className={styleHead} style={{ width: "7rem" }}>
        Unit
      </th>
      <th className={styleHead} style={{ width: "9rem" }}>
        Target
      </th>
      <th className={styleHead} style={{ width: "35rem" }}>
        Description
      </th>
      <th className={styleHead} style={{ width: "7rem" }}>
        Result
      </th>
    </tr>
  );
};

const CellMetric = ({ row, i }) => {
  return (
    <>
      <tr key={`cell-metric-${i}`} className="text-left bg-blue-50">
        <td colSpan={5} className="px-6 py-3 text-sm text-gray-500 font-normal">
          <b>{row.hcMetric.name}</b>
        </td>
      </tr>
    </>
  );
};

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
        <td className="px-6 py-3 text-sm text-gray-500 font-normal whitespace-pre-wrap">
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

export { CellHead, CellMetric, CellResult };
