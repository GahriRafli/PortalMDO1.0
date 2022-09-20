import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import { classNames } from "../utils";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { SortIcon, SortUpIcon, SortDownIcon } from "../ui/short-icon";
import { PageButton } from "../ui/button/pagination-button";
import React, { useImperativeHandle } from "react";

// eslint-disable-next-line react/display-name
const ProblemTables = React.forwardRef(({ columns, data }, ref) => {
  const instance = useTable(
    { columns, data },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    setPageSize,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = instance;

  const { globalFilter, pageIndex, pageSize } = state;
  useImperativeHandle(ref, () => instance);
  return (
    <>
      <table {...getTableProps()} className="min-w-full mt-3">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={`row-problem-${i}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th
                  key={`col-problem-${i}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={classNames(
                    "px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.Header === "Problem Name"
                  )}
                >
                  <div className="group flex items-center justify-between">
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
          className="bg-white divide-y divide-gray-100"
        >
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={`cell-problem-${i}`} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      key={`data-problem-${i}`}
                      {...cell.getCellProps()}
                      className="px-6 py-3 text-sm text-gray-500 font-normal"
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

      {/* START Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>{" "}
            </span>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="mt-1 ml-1 block text-base text-gray-700 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue={10}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <PageButton
                onClick={() => [
                  gotoPage(0),
                  document
                    .getElementById("problem-list-section")
                    .scrollIntoView(),
                ]}
                disabled={!canPreviousPage}
                className="rounded-l-md"
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => [
                  previousPage(),
                  document
                    .getElementById("problem-list-section")
                    .scrollIntoView(),
                ]}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => [
                  nextPage(),
                  document
                    .getElementById("problem-list-section")
                    .scrollIntoView(),
                ]}
                disabled={!canNextPage}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => [
                  gotoPage(pageCount - 1),
                  document
                    .getElementById("problem-list-section")
                    .scrollIntoView(),
                ]}
                disabled={!canNextPage}
                className="rounded-r-md"
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
      {/* END of Pagination */}
    </>
  );
});

export default ProblemTables;
