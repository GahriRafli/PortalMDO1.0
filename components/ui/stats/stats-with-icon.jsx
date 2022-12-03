import Link from "next/link";

export const StatsWithIcon = (props, { ...rest }) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow" {...rest}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <props.icon className="w-6 h-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {props.name}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {props.value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50">
        <div className="text-sm">
          <Link href={props.href}>
            <a className="font-medium text-blue-500 hover:text-blue-700">
              {props.href !== "#" ? "View All" : "Coming Soon"}{" "}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

StatsWithIcon.displayName = "StatsWithIcon";
