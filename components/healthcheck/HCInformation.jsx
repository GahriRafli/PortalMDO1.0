import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/outline";
import HCTabs from "./HCTabs";

const styleHead =
  "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";

const HCInformation = ({ data }) => {
  const [open, setOpen] = useState(false);
  let listIP = data.ipAddress.split(";");
  let listAppendix = data.appendix.split(";");
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
                      className="leading-6 text-center font-medium text-gray-700"
                    >
                      <b className="text-lg">
                        {data.app.name} - {data.app.subName}
                      </b>
                      <p className="text-sm text-gray-500">
                        {data.healthcheckNumber}
                      </p>
                    </Dialog.Title>
                    <div>
                      <div className="flex py-2 place-content-center">
                        <img
                          className="mx-2 my-2 py-2"
                          style={{ height: "25rem" }}
                          src={`${process.env.NEXT_PUBLIC_HOST_ADDRESS}/${listAppendix[0]}`}
                          alt={data.healthcheckNumber}
                        />
                        <table className="table-fixed my-2 self-start">
                          <thead>
                            <tr className="border-t border-gray-200">
                              <th className={styleHead}>List of IP Address</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {listIP.map((ip, i) => {
                              return (
                                <tr key={`list-ip-${i}`}>
                                  <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                    {ip}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <HCTabs data={data.hcResults} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    back to create problem
                  </button>
                  <a
                    href={`/healthcheck/${data.id}`}
                    className="ml-1 pl-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    go to health check page
                  </a>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Button Recommendation */}
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
