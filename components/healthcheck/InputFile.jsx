import { PhotographIcon, DocumentAddIcon } from "@heroicons/react/solid";

const InputArch = () => {
  return (
    <>
      <label
        htmlFor="topologyArch"
        className="block text-sm font-medium text-gray-700"
      >
        Topology Architecture
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotographIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="topologyArch"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              {/* <input
                id="topologyArch"
                name="topologyArch"
                type="image"
                className="sr-only"
              /> */}
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG or JPG up to 10MB
          </p>
        </div>
      </div>
    </>
  );
};
const InputDocument = () => {
  return (
    <>
      <label
        htmlFor="appendixFile"
        className="block text-sm font-medium text-gray-700"
      >
        Document
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <DocumentAddIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="appendixFile"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              {/* <input
                id="appendixFile"
                name="appendixFile"
                type="file"
                className="sr-only"
              /> */}
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            DOCX or PDF up to 10MB
          </p>
        </div>
      </div>
    </>
  );
};

export { InputArch, InputDocument };
