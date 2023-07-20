import React from "react";
import { CellHead, CellResult } from "./Cell";

const styleHead =
  "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";

const TabsUhuy = ({ data, color }) => {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap py-2 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal " +
                  (openTab === 1
                    ? "text-gray-500 bg-" + color + "-50"
                    : "text-" + color + "-50 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#metric1"
                role="tablist"
              >
                Configuration & Monitoring Tools
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal " +
                  (openTab === 2
                    ? "text-gray-500 bg-" + color + "-50"
                    : "text-" + color + "-50 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#metric2"
                role="tablist"
              >
                Performance Efficiency
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal " +
                  (openTab === 3
                    ? "text-gray-500 bg-" + color + "-50"
                    : "text-" + color + "-50 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#metric3"
                role="tablist"
              >
                Resource Utilization
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal " +
                  (openTab === 4
                    ? "text-gray-500 bg-" + color + "-50"
                    : "text-" + color + "-50 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#metric4"
                role="tablist"
              >
                Realibility Measures
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-sm rounded">
            <div className="flex-auto">
              <div className="tab-content tab-space">
                <div
                  className={openTab === 1 ? "block" : "hidden"}
                  id="metric1"
                >
                  {/* Metrics Pertama */}
                  <table className="table-fixed">
                    <thead>
                      <CellHead styleHead={styleHead} />
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data
                        .filter((row) => row.hcMetric.id == 1)
                        .map((row, i) => {
                          return <CellResult row={row} i={i} />;
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={openTab === 2 ? "block" : "hidden"}
                  id="metric2"
                >
                  {/* Metrics Kedua */}
                  <table className="table-fixed">
                    <thead>
                      <CellHead styleHead={styleHead} />
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data
                        .filter((row) => row.hcMetric.id == 2)
                        .map((row, i) => {
                          return <CellResult row={row} i={i} />;
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={openTab === 3 ? "block" : "hidden"}
                  id="metric3"
                >
                  {/* Metrics Ketiga */}
                  <table className="table-fixed">
                    <thead>
                      <CellHead styleHead={styleHead} />
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data
                        .filter((row) => row.hcMetric.id == 3)
                        .map((row, i) => {
                          return <CellResult row={row} i={i} />;
                        })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={openTab === 4 ? "block" : "hidden"}
                  id="metric4"
                >
                  {/* Metrics Keempat */}
                  <table className="table-fixed">
                    <thead>
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
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data
                        .filter((row) => row.hcMetric.id == 4)
                        .map((row, i) => {
                          return <CellResult row={row} i={i} />;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HCTabs = ({ data }) => {
  return (
    <div>
      <TabsUhuy data={data} color="blue" />
    </div>
  );
};

export default HCTabs;
