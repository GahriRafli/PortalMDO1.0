import { useTable, useSortBy, usePagination } from "react-table";
import { SortIcon, SortUpIcon, SortDownIcon } from "./short-icon";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { PageButton } from "./button/pagination-button";
import { classNames } from "components/utils";

function Table({ columns, data, initialPageSize }) {
  // Use the state and functions returned from useTable to build your UI
  const instance = useTable(
    { columns, data, initialState: { pageSize: initialPageSize } },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = instance;

  const { pageIndex, pageSize } = state;

  // Render the UI for your table
  // min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg
  return (
    <div className="align-middle min-w-full overflow-x-auto overflow-hidden sm:rounded-t-lg">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200 table-fixed"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={classNames(
                    "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.Header === "Description" && "w-1/3"
                  )}
                >
                  {/* Add a sort direction indicator */}
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
          className="bg-white divide-y divide-gray-200"
        >
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="bg-white">
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-3 text-xs text-gray-500"
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
      {/* Pagination Start */}
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
              // defaultValue={initialPageSize}
            >
              {[5, 10, 25, 50, 100, 500].map((pageSize) => (
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
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="rounded-l-md"
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => gotoPage(pageCount - 1)}
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
      {/* Pagination End */}
    </div>
  );
}

export default Table;
