import React, { useImperativeHandle } from "react";
import {
  useTable,
  useSortBy,
} from "react-table";
import { SortIcon, SortUpIcon, SortDownIcon } from "../ui/short-icon";
import { classNames } from "../utils";

const Table = React.forwardRef(({ columns, data }, ref) => {
  const instance = useTable(
    { columns, data },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance;

  useImperativeHandle(ref, () => instance);

  return (
    <>
      <div className="flex flex-col mt-3">
        <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-200 table-fixed"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={classNames(
                        "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        column.Header === "Ticket Name" && "w-1/3",
                        column.Header === "Application" && "w-72",
                        column.Header === "Started At" && "w-40",
                        column.Header === "Reporter" && "w-64",
                        column.Header === " " && "w-20"
                      )}
                    >
                      <div className="flex items-center justify-between group">
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <SortDownIcon className="w-4 h-4 text-green-400" />
                            ) : (
                              <SortUpIcon className="w-4 h-4 text-green-400" />
                            )
                          ) : (
                            column.canSort && (
                              <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                            )
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="bg-white">
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-3 text-sm text-gray-500"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});

export default Table;
