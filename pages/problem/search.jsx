import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import withSession from "lib/session";
import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import { SearchIcon, CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";
import { Spin, Alert } from "antd";
import { PrimaryAnchorButton as Button } from "components/ui/button/primary-anchor-button";
import { Input } from "antd";

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

  let res, getSearch;
  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/matching/search`
  );
  const paramLength = Object.keys(query).length;

  if (paramLength > 0) {
    if (query.q && paramLength === 1) {
      url.searchParams.append("q", query.q);
    } else if (paramLength === 2) {
      if (query.q && query.perPage) {
        url.searchParams.append("q", query.q);
        // url.searchParams.append("page", page);
        url.searchParams.append("perPage", query.perPage);
      } else if (query.q && query.page) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", query.page);
      }
    } else if (paramLength === 3) {
      if (query.q && query.page && query.perPage) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", query.page);
        url.searchParams.append("perPage", query.perPage);
      }
    } else {
      return true;
    }
  }

  // Jika ada Query Paramnya
  res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  getSearch = await res.json();

  if (res.status === 200) {
    return {
      props: {
        user: user,
        keyword: query.q,
        search: getSearch,
      },
    };
  } else if (res.status === 201) {
    return {
      props: {
        user: user,
        keyword: query.q,
        search: getSearch,
      },
    };
  } else if (res.status === 202) {
    return {
      props: {
        user: user,
        search: getSearch,
      },
    };
  }
});

// const ProblemSearch = ({ user, search }) => {
const ProblemSearch = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const router = useRouter();
  const PER_PAGE = 5;

  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  // Handle On Enter Search Form
  const onSearch = (e) => {
    const keyword = e.target.value;
    if (e.key === "Enter" && keyword) {
      e.preventDefault();
      const currentPath = router.pathname;
      router.push({
        pathname: currentPath,
        query: { q: keyword, page: 1, perPage: PER_PAGE },
      });
    }
  };

  const paginationHandler = (page) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    setSelectedPage(currentQuery.page);
    if (currentQuery.hasOwnProperty("q")) {
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  let content = null;
  content = (
    <>
      <Spin
        style={{
          marginTop: "10vh",
          marginBottom: "10vh",
          display: "block",
          justifyContent: "center",
        }}
        size="large"
        spinning={isLoading}
        tip="Loading..."
      />
      {props.keyword !== undefined ? (
        <h1 className="mt-3">
          {props.search.data.count} results about&nbsp;
          <span className="font-semibold">{props.keyword}</span>
        </h1>
      ) : null}
      <ul className="divide-y divide-gray-200">
        {/* Ini kalau ketemu */}
        {props.search && props.search.data.count > 0
          ? props.search.data.rows.map((result) => (
              <li
                key={result.idproblem}
                className="relative bg-white sm:rounded-lg my-5 py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/problem/${result.idProblem}`}>
                      <a
                        href={`/problem/${result.idProblem}`}
                        className="block focus:outline-none"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm text-gray-500">
                          <span className="font-bold">
                            {result.problemNumber}{" "}
                          </span>
                          {result.problemName}
                        </p>
                        <div className="mt-1 flex space-x-4">
                          <p className="flex items-center text-sm text-gray-500 truncate">
                            <CodeIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                              aria-hidden="true"
                            />{" "}
                            {result.problemApp}
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
                                : result.problemStatus === "Waiting for Review"
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
                    dateTime={result.problemCreatedAt}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                  >
                    {result.problemCreatedAt}
                  </time>
                </div>
                <div className="mt-4">
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Impacted System :{" "}
                    {result.problemImpactedSystem != null
                      ? result.problemImpactedSystem
                      : "Not Defined Yet/Recorded"}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Root Cause :{" "}
                    {result.problemRootCause != null
                      ? result.problemRootCause
                      : "Not Defined Yet/Recorded"}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Action :{" "}
                    {result.problemResolution != null
                      ? result.problemResolution
                      : "Not Defined Yet/Recorded"}
                  </p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </>
  );

  return (
    <>
      <Layout session={props.user}>
        <Head>
          <title>Problem Search</title>
        </Head>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mt-10 mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-12">
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
                    placeholder="Search problem name, root cause &amp; action"
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

            {props.search && props.search.status > 400 ? (
              <>
                <Alert
                  message="This page is specifically for searches related to problem name, root causes and actions of problems. Please type a word related to these three things"
                  type="info"
                  showIcon
                  style={{ borderRadius: "0.375rem" }}
                />
                <div className="relative mx-auto">
                  <div className="relative">
                    <img
                      className="mx-auto w-2/5"
                      src="/search-engines-rafiki.svg"
                      alt="Workcation"
                    />
                    <div className="-mt-12 mb-3 max-w-3xl mx-auto text-center">
                      <Link href="/problem" passHref>
                        <Button>Back to Problem List</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : props.search &&
              props.search.status !== 400 &&
              props.search.data.count === 0 ? (
              <div className="relative mx-auto">
                <div className="relative">
                  <img
                    className="mx-auto w-2/5"
                    src="/nodata-rafiki.svg"
                    alt="Workcation"
                  />
                  <div className="-mt-16 mb-3 max-w-3xl mx-auto text-center leading-9">
                    <p className="text-2xl font-bold text-gray-900">
                      Oops, Problems not found
                    </p>
                    <p className="mb-3">
                      Try another keyword or back to problem list
                    </p>
                    <Link
                      href={{
                        pathname: "list",
                      }}
                      passHref
                    >
                      <Button>Back to Problem List</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {content}

                {props.keyword !== undefined ? (
                  <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {props.search.paging.Page}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {props.search.paging.totalPages}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {props.search.paging.totalData}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <ReactPaginate
                        initialPage={props.search.paging.Page - 1}
                        pageCount={props.search.paging.totalPages} //page count
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
                ) : null}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProblemSearch;
