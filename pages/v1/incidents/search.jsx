import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import withSession from "lib/session";
import { async } from "regenerator-runtime";
import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import { SearchIcon, CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";
import { format } from "date-fns";
import { Spin, Alert } from "antd";
import { PrimaryAnchorButton as Button } from "components/ui/button/primary-anchor-button";

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/incidents/search`);
  const paramLength = Object.keys(query).length;

  if (paramLength > 0) {
    if (query.q && paramLength === 1) {
      url.searchParams.append("q", query.q);
    } else if (paramLength === 2) {
      if (query.q && query.perPage) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("perPage", query.perPage);
      } else if (query.q && query.page) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", query.page);
      }
    } else if (paramLength === 3) {
      if (query.q && query.page && query.perPage) {
        // let page = query.page;
        // pageCount += Math.ceil(data.paging.totalData / query.perPage);
        // page > pageCount ? (page = 1) : page;

        url.searchParams.append("q", query.q);
        url.searchParams.append("page", query.page);
        url.searchParams.append("perPage", query.perPage);
      }
    } else {
      return false;
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (data.code === 400) {
    return {
      props: {
        user: user,
        search: data.code,
        isLoading: false,
      },
    };
  } else {
    return {
      props: {
        user: user,
        keyword: query.q,
        totalCount: data.paging.totalData,
        pageCount: Math.ceil(data.paging.totalData / data.paging.perPage),
        currentPage: data.paging.page,
        perPage: data.paging.perPage,
        search: data.data,
        isLoading: false,
      }, // will be passed to the page component as props
    };
  }
});

function SearchIncident(props) {
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

  // Handle on enter search
  const onSearch = (e) => {
    const keyword = e.target.value;
    if (e.key === "Enter" && keyword) {
      e.preventDefault();
      const currentPath = router.pathname;
      router.push({
        pathname: currentPath,
        query: { q: keyword, perPage: PER_PAGE },
      });
    }
  };

  const paginationHandler = (page) => {
    const currentPath = router.pathname; // '/incidents/search'
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    setSelectedPage(currentQuery.page);

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  let content = null;
  content = (
    <>
      <Spin size="large" spinning={isLoading} tip="Loading...">
        <h1 className="mb-3">
          {props.totalCount} results about{" "}
          <span className="font-semibold">{props.keyword}</span>
        </h1>
        <ul className="divide-y divide-gray-200">
          {props.search !== 400 &&
            props.search.map((result) => (
              <li
                key={result.id}
                className="relative bg-white sm:rounded-lg py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/incidents/${result.id}`}>
                      <a className="block focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-bold text-gray-900">
                          {result.incidentName}
                        </p>
                        <div className="mt-1 flex space-x-4">
                          <p className="flex items-center text-sm text-gray-500 truncate">
                            <CodeIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                              aria-hidden="true"
                            />{" "}
                            {result.paramApps.subName}
                          </p>
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {result.paramIncidentType
                              ? result.paramIncidentType.incidentType
                              : "-"}
                          </p>
                          <p
                            className={classNames(
                              result.incidentStatus === "Open"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800",
                              "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            )}
                          >
                            {result.incidentStatus}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <time
                    dateTime={result.logStartTime}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                  >
                    {result.logStartTime
                      ? format(
                          new Date(result.logStartTime),
                          "dd MMMM yyyy HH:mm",
                          "id-ID"
                        )
                      : "-"}{" "}
                  </time>
                </div>
                <div className="mt-4">
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Impacted System : {result.impactedSystem}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Root Cause : {result.rootCause}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600 truncate">
                    Action : {result.actionItem}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </Spin>
    </>
  );

  return (
    <>
      <Layout session={props.user}>
        <Head>
          <title>Incident Search - Shield</title>
        </Head>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search incident report
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon
                          className="flex-shrink-0 h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        name="search"
                        id="incident-search"
                        className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                        placeholder="Search incident name, root cause &amp; action"
                        type="search"
                        onKeyPress={onSearch}
                      />
                      <input
                        name="search"
                        id="search-field"
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search incident name, root cause &amp; action"
                        type="search"
                        onKeyPress={onSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-10 mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-12">
            {/* Pengecekan untuk landing pa */}
            {props.search === 400 ? (
              <>
                <Alert
                  message="This page is specifically for searches related to incident name, root causes and actions of incidents. Please type a word related to these three things"
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
                      <Link href="/incidents" passHref>
                        <Button>Back to incident menu</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : props.search !== 400 && props.search.length === 0 ? (
              <div className="relative mx-auto">
                <div className="relative">
                  <img
                    className="mx-auto w-2/5"
                    src="/nodata-rafiki.svg"
                    alt="Workcation"
                  />
                  <div className="-mt-16 mb-3 max-w-3xl mx-auto text-center leading-9">
                    <p className="text-2xl font-bold text-gray-900">
                      Oops, Incident not found
                    </p>
                    <p className="mb-3">
                      Try another keyword or back to incident menu
                    </p>
                    <Link
                      href={{
                        pathname: "search",
                      }}
                      passHref
                    >
                      <Button>Back to incident menu</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {content}
                <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{props.currentPage}</span>{" "}
                      to <span className="font-medium">{props.pageCount}</span>{" "}
                      of <span className="font-medium">{props.totalCount}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <ReactPaginate
                      initialPage={props.currentPage - 1}
                      pageCount={props.pageCount} //page count
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
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SearchIncident;
