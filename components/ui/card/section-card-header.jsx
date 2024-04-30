import clsx from "clsx";

export const SectionCardHeader = ({ className, title, ...rest }) => {
  return (
    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
  );
};

SectionCardHeader.displayName = "SectionCardHeader";
