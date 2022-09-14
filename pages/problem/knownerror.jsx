import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "lib/session";
import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import { CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  let getKEDB, knownerror;
  let url = new URL(`${process.env.NEXT_PUBLIC_API_PROBMAN}/rootcause/all`);

  const paramLength = Object.keys(query).length;

  if (paramLength == 0) {
    url.searchParams.append("page", query.page);
    url.searchParams.append("perPage", query.perPage);
  } else {
    url.searchParams.append("page", query.page);
    url.searchParams.append("perPage", query.perPage);
    // return true;
  }

  getKEDB = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  knownerror = await getKEDB.json();

  if (getKEDB.status >= 200) {
    return {
      props: {
        user: user,
        kedb: knownerror,
      },
    };
  }
});

const KnownError = ({ user, kedb }) => {
  const [selectedPage, setSelectedPage] = useState("");
  const router = useRouter();
  const PER_PAGE = 5;

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
  };

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Known Error</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Known Error"></PageHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-8">
              <ul className="divide-y divide-gray-200">
                {kedb.data.rows.map((result, index) => (
                  <li
                    key={index}
                    className="shadow-lg relative bg-white sm:rounded-lg my-5 py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                  >
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
                                {result.app.subname}
                              </p>
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {result.problemType
                                  ? result.problemType
                                  : "Not Defined Problem Type"}
                              </p>
                              <p
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
                              </p>
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
                    <div className="mt-4">
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Impacted System :{" "}
                        {result.impactSystem != null
                          ? result.impactSystem
                          : "Not Defined Yet/Recorded"}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Root Cause :
                        {result.rca != null
                          ? result.rca
                          : "Not Defined Yet/Recorded"}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Action :
                        {result.resolution != null
                          ? result.resolution
                          : "Not Defined Yet/Recorded"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{kedb.paging.Page}</span> to{" "}
                    <span className="font-medium">
                      {kedb.paging.totalPages}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{kedb.paging.totalData}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <ReactPaginate
                    initialPage={kedb.paging.Page - 1}
                    pageCount={kedb.paging.totalPages} //page count
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
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default KnownError;
