function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProblemStats = ({ id, bgColor, initials, title, desc }) => {
  return (
    <li key={id} className="relative col-span-1 flex shadow-sm rounded-md">
      <div
        className={classNames(
          bgColor,
          "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
        )}
      >
        {initials}
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <span className="text-gray-900 font-medium hover:text-gray-600">
            {title}
          </span>
          <p className="text-gray-500">{desc}</p>
        </div>
      </div>
    </li>
  );
};

export default ProblemStats;
