import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/outline";
import CellResult from "./CellResult";
import CellMetric from "./CellMetric";

const styleHead =
  "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";

const HCInformation = ({ data }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6"
                style={{ width: "60vw" }}
              >
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <HeartIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 text-center font-medium text-gray-500"
                    >
                      <b>{data.healthcheckNumber}</b>
                    </Dialog.Title>
                    <div>
                      <p className="text-sm text-center text-gray-500">
                        {data.app.name} - {data.app.subName}
                      </p>
                      <table className="table-fixed">
                        <thead>
                          <tr className="border-t border-gray-200">
                            <th className={styleHead}>Metrics</th>
                            <th className={styleHead}>Unit</th>
                            <th className={styleHead}>Target</th>
                            <th className={styleHead}>Description</th>
                            <th className={styleHead}>Result</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {data.hcResults.map((row, i) => {
                            if (i == 0 || i == 4 || i == 7 || i == 11) {
                              return (
                                <>
                                  <CellMetric row={row} i={i} />
                                  <CellResult row={row} i={i} />
                                </>
                              );
                            } else {
                              return <CellResult row={row} i={i} />;
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    go back to create problem
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="py-4">
        <button
          type="button"
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => setOpen(true)}
        >
          Health Check Recommendation
        </button>
      </div>
    </>
  );
};

export default HCInformation;
