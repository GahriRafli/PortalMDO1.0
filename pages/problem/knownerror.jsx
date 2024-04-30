import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "lib/session";
import Link from "next/link";
import { CodeIcon, SearchIcon } from "@heroicons/react/solid";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { DatePicker, Input } from "antd";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { PrimaryButton } from "components/ui/button";
import { SecondaryButton } from "components/ui/button";

export const getServerSideProps = withSession(async function ({ req }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
});

const KnownError = ({ user }) => {
  const RangePicker = DatePicker.RangePicker;
  const [selectedPage, setSelectedPage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [kedbState, setKedbState] = useState([]);
  const [keywordState, setKeywordState] = useState("");
  const [handlerStartPeriodOptions, sethandlerStartPeriodOptions] = useState(
    []
  );
  const [handlerEndPeriodOptions, sethandlerEndPeriodOptions] = useState([]);
  const router = useRouter();
  const componentRef = useRef(null);

  useEffect(() => {
    const currentPath = router.pathname;
    router.push(currentPath);
  }, []);

  const paginationHandler = (page) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    // currentQuery.perPage = PER_PAGE;
    setSelectedPage(currentQuery.page);
    router.push({
      pathname: currentPath,
      query: currentQuery,
    });

    let url = `${
      process.env.NEXT_PUBLIC_API_PROBMAN
    }/problem/rootcause/search?q=${keywordState}&startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}&page=${
      page.selected + 1
    }`;

    axios.get(url).then((res) => {
      setKedbState(res.data);
    });
  };

  const onChangeHandlerPeriode = (value, dateString) => {
    const endDate = `${
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    }`;
    sethandlerStartPeriodOptions(dateString[0]);
    sethandlerEndPeriodOptions(dateString[1]);
  };

  const onSearch = (e) => {
    const page = { selected: 0 };
    paginationHandler(page);
    const keyword = e.target.value;
    setKeywordState(keyword);
    if (e.key === "Enter") {
      e.preventDefault();
      let url = `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/rootcause/search?q=${keyword}&startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}`;

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })
        .then((response) => {
          setKedbState(response.data);
        });
    }
  };

  const handleGetData = () => {
    const page = { selected: 0 };
    paginationHandler(page);
    let url = `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/rootcause/search?q=${keywordState}&startDate=${handlerStartPeriodOptions}&endDate=${handlerEndPeriodOptions}`;

    axios.get(url).then((res) => {
      setKedbState(res.data);
    });
  };

  const handleExport = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Known Error Report`,
    pageStyle: `
      @media all {
        .page-break {
          display: none;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: auto;
        }
      }
      
      @page {
        size: potrait;
        margin: 10mm;
      }
    `,
  });

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Known Error Database"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          {/* content section  */}
          <section id="known-error-section">
            {/* Page title & actions */}
            <PageHeader title="Known Error Database"></PageHeader>
            <div className="sm:px-6 lg:px-8 mt-8">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 sm:grid-cols-6 gap-4">
                    <div className="col-span-6 text-left mb-1">
                      <label
                        htmlFor="date-filter"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <RangePicker
                        style={{
                          width: "25vw",
                          borderRadius: 5,
                          paddingTop: 10,
                          paddingBottom: 10,
                          paddingRight: 15,
                          paddingLeft: 15,
                        }}
                        name="dateRangeHit"
                        id="dateRangeHit"
                        onChange={onChangeHandlerPeriode}
                      />
                      <PrimaryButton
                        style={{ width: "10%" }}
                        type="button"
                        className="ml-2 justify-center"
                        onClick={() => handleGetData()}
                      >
                        Get Data
                      </PrimaryButton>
                      {kedbState.data?.count > 0 ? (
                        <SecondaryButton
                          type="button"
                          onClick={handleExport}
                          className="ml-3 justify-center"
                        >
                          Export
                        </SecondaryButton>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="my-3 max-w-full lg:max-w-full">
                    <div className="flex gap-x-2">
                      <div className="flex-auto">
                        <label
                          htmlFor="search"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Search
                        </label>
                        <form action="#" method="GET">
                          <Input
                            onKeyPress={onSearch}
                            disabled={false}
                            allowClear
                            placeholder="Search problem name here..."
                            prefix={
                              <SearchIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            }
                            style={{
                              borderRadius: "0.375rem",
                              height: "38px",
                            }}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* {console.log("kedbState.data.rows : ", kedbState?.data?.rows)} */}
            {kedbState.data?.count > 0 ? (
              <div ref={componentRef} className="print:a4-screen-sized">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-8">
                    <ul className="divide-y divide-gray-200">
                      {kedbState.data?.rows?.map((result, index) => (
                        <li
                          key={index}
                          className="shadow-lg relative bg-white sm:rounded-lg my-5 py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                        >
                          <div className="mb-5">
                            {result.problem.priorityMatrix?.mapping ===
                            "Critical" ? (
                              <span className="bg-red-300 text-gray-800 text-xs font-medium mr-2 px-5 py-2 rounded">
                                {result.problem.priorityMatrix?.mapping.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                            {result.problem.priorityMatrix?.mapping ===
                            "High" ? (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-5 py-2 rounded">
                                {result.problem.priorityMatrix?.mapping.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                            {result.problem.priorityMatrix?.mapping ===
                            "Medium" ? (
                              <span className="bg-blue-300 text-blue-800 text-xs font-medium mr-2 px-5 py-2 rounded">
                                {result.problem.priorityMatrix?.mapping.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                            {result.problem.priorityMatrix.mapping === "Low" ? (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-5 py-2 rounded">
                                {result.problem.priorityMatrix?.mapping.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="flex justify-between space-x-3">
                            <div className="min-w-0 flex-1">
                              <Link href={`/problem/${result.problem.id}`}>
                                <a
                                  href={`/problem/${result.problem.id}`}
                                  className="block focus:outline-none"
                                >
                                  <span
                                    className="absolute inset-0"
                                    aria-hidden="true"
                                  />
                                  <p className="text-sm text-gray-500">
                                    <span className="font-bold">
                                      {result.problem.problemNumber}
                                    </span>
                                    {` ${result.problem.problemName}`}
                                  </p>
                                  <div className="mt-1 flex space-x-4">
                                    <p className="flex items-center text-sm text-gray-500 truncate">
                                      <CodeIcon
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                                        aria-hidden="true"
                                      />{" "}
                                      {result.app?.subName}
                                    </p>
                                    {/* <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {result.problemType
                                        ? result.problemType
                                        : "Not Defined Problem Type"}
                                    </p> */}
                                    {/* <p
                                      className={classNames(
                                        result.problemStatus === "Unassigned"
                                          ? "bg-red-100 text-gray-800"
                                          : result.problemStatus ===
                                            "Waiting for Review"
                                          ? "bg-gray-100 text-gray-800"
                                          : result.problemStatus === "Ongoing at JIRA"
                                          ? "bg-blue-100 text-gray-800"
                                          : result.problemStatus === "Done"
                                          ? "bg-green-100 text-gray-800"
                                          : "bg-gray-100 text-gray-800",
                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                      )}
                                    >
                                      {result.problemStatus == null
                                        ? "Problem Status Not Defined"
                                        : result.problemStatus}
                                    </p> */}
                                  </div>
                                </a>
                              </Link>
                            </div>
                            <time
                              dateTime={result.createdAt}
                              className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                            >
                              {result.createdAt}
                            </time>
                          </div>

                          <div className="grid grid-cols-5">
                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                Description
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <p className="text-sm whitespace-pre-wrap text-gray-900">
                                {result.description != null
                                  ? result.description
                                  : ": Not Defined Yet/Recorded"}
                              </p>
                            </div>

                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                Impacted System
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <p className="text-sm whitespace-pre-wrap text-gray-900">
                                {result.impactSystem != null
                                  ? result.impactSystem
                                  : ": Not Defined Yet/Recorded"}
                              </p>
                            </div>

                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                <b>Root Cause</b>
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <p className="text-sm text-justify whitespace-pre-wrap text-gray-900">
                                <b>
                                  {result.rca != null
                                    ? result.rca
                                    : ": Not Defined Yet/Recorded"}
                                </b>
                              </p>
                            </div>

                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                Resolution
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <p className="text-sm whitespace-pre-wrap text-gray-900">
                                {result.resolution != null
                                  ? result.resolution
                                  : ": Not Defined Yet/Recorded"}
                              </p>
                            </div>

                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                <b>Lesson Learned</b>
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <p className="text-sm whitespace-pre-wrap text-gray-900">
                                <b>
                                  {result.lessonLearned != null
                                    ? result.lessonLearned
                                    : ": Not Defined Yet/Recorded"}
                                </b>
                              </p>
                            </div>

                            <div className="mt-5 mb-3 col-span-5">
                              <hr />
                            </div>

                            <div className="mt-2 col-span-1">
                              <p className="text-sm font-medium text-gray-500">
                                <b>Incident Related</b>
                              </p>
                            </div>
                            <div className="mt-2 col-span-4">
                              <div className="block max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-2">
                                {result.incident ? (
                                  <>
                                    <div className="flex justify-between space-x-3">
                                      <div className="min-w-0 flex-1">
                                        <Link
                                          href={`/problem/${result.problem.id}`}
                                        >
                                          <a
                                            href={`/problem/${result.problem.id}`}
                                            className="block focus:outline-none"
                                          >
                                            <span
                                              className="absolute inset-0"
                                              aria-hidden="true"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                              <span className="font-bold">
                                                {result.incident.incidentNumber}{" "}
                                                &nbsp;
                                              </span>
                                            </p>
                                          </a>
                                        </Link>
                                      </div>
                                      <time
                                        dateTime={result.createdAt}
                                        className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {result.createdAt}
                                      </time>
                                    </div>
                                    <p className="text-md text-gray-500">
                                      {result.incident.incidentName}
                                    </p>
                                    <div className="mt-3">
                                      <p className="items-center text-sm text-gray-500">
                                        <span className="font-bold">
                                          Root Cause :
                                        </span>
                                      </p>
                                      <p className="items-center text-sm text-gray-500 text-justify">
                                        {result.incident.rootCause}
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between space-x-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="mt-1 flex space-x-4">
                                        <p className="flex items-center text-sm text-gray-500 truncate">
                                          <span className="font-bold">
                                            No Incident Related
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {kedbState.paging?.Page}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {kedbState.paging?.totalPages}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {kedbState.paging?.totalData}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <ReactPaginate
                          forcePage={selectedPage - 1}
                          initialPage={kedbState.paging?.Page - 1}
                          pageCount={kedbState.paging?.totalPages} //page count
                          previousLabel={"Prev"}
                          onPageChange={paginationHandler}
                          containerClassName={
                            "relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          }
                          pageLinkClassName={
                            "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          }
                          previousLinkClassName={
                            "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          }
                          nextLinkClassName={
                            "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          }
                          breakLabel={"..."}
                          breakLinkClassName={
                            "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          }
                          activeLinkClassName={
                            "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          }
                          onClick={() =>
                            document
                              .getElementById("known-error-section")
                              .scrollIntoView()
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
};

export default KnownError;
