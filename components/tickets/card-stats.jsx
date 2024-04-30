import Link from "next/link";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CardStats = ({ id, bgColor, initials, title, total, desc, href }) => {
    return (
        <li key={id} className="relative flex col-span-1 rounded-md shadow-sm">
            <div
                className={classNames(
                    bgColor,
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                )}
            >
                {initials}
            </div>
            <div className="flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md">
                <div className="flex-1 px-4 py-2 mt-2 text-sm truncate">
                    <a href= "#" className="font-medium text-gray-900 hover:text-gray-600">
                        {title}
                    </a>
                    <p className="text-sm text-gray-500">{total}</p>
                    <div className="text-right">
                        <p className="mt-6"></p>
                        <Link href={href}>
                            {desc}
                        </Link>
                        
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CardStats;
