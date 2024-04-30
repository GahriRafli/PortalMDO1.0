import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon, PencilAltIcon, TrashIcon, EyeIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useState, useMemo } from 'react';

function formatDate(date) {
    const setFormat = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return setFormat.format(new Date(date));
}

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const IncidentTables = ({ incidents }) => {
    const itemsPerPage = 10;
    const [page, setPage] = useState(1);
    const displayData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return incidents.data.slice(start, start + itemsPerPage);
    }, [incidents]);

    // console.log(incidents.data[1]);

    return (
        <>
            {/* <button onClick={() => setPage(page + 1)}> Next </button>
            <button onClick={() => setPage(page - 1)}> Prev </button> */}
            <table className="min-w-full">
                <thead>
                    <tr className="border-t border-gray-200">
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="lg:pl-2">Name</span>
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Started
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reporter
                        </th>
                        <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {displayData.map((incident) => (
                        <tr key={incident.id}>
                            <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                <div className="flex items-center space-x-3 lg:pl-2">
                                    <div
                                        className={incident.incidentStatus == 'Open' ? 'bg-red-600 flex-shrink-0 w-2.5 h-2.5 rounded-full' : 'bg-green-500 flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                        aria-hidden="true"
                                    />
                                    <Link href={`/incidents/${incident.id}`}>
                                        <a className="hover:text-gray-700">{incident.incidentName}</a>
                                    </Link>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.paramApps.name}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.paramPriorityMatrix ? incident.paramPriorityMatrix.mapping : "-"}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.resolvedIntervals ? `${incident.resolvedIntervals}m` : "-"}
                            </td>
                            <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                {formatDate(incident.startTime)}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                Lord Commander
                            </td>
                            <td className="pr-6">
                                <Menu as="div" className="relative flex justify-end items-center">
                                    {({ open }) => (
                                        <>
                                            <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <span className="sr-only">Open options</span>
                                                <DotsVerticalIcon
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </Menu.Button>
                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items
                                                    static
                                                    className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                                                >
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a href={`/incidents/${incident.id}`}
                                                                    className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "group flex items-center px-4 py-2 text-sm")}>
                                                                    <EyeIcon
                                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                        aria-hidden="true"
                                                                    />
                                                                    View
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a href="#"
                                                                    className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "group flex items-center px-4 py-2 text-sm")}>
                                                                    <PencilAltIcon
                                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                        aria-hidden="true"
                                                                    />
                                                                    Edit
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a href="#"
                                                                    className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "group flex items-center px-4 py-2 text-sm")}>
                                                                    <TrashIcon
                                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                        aria-hidden="true"
                                                                    />
                                                                    Delete
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </>
                                    )}
                                </Menu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default IncidentTables;