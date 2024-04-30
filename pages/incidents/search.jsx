import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import withSession from "lib/session";
import {
  SearchIcon,
  CalendarIcon,
  FolderIcon,
  DesktopComputerIcon,
} from "@heroicons/react/solid";
import { format } from "date-fns";
import { Spin } from "antd";
import {
  LayoutPage,
  LayoutPageHeader,
  LayoutPageContent,
} from "components/layout/index";
import clsx from "clsx";

export default function SearchIncident(props) {
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
    const currentPath = router.pathname; // route to : '/incidents/search'
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    setSelectedPage(currentQuery.page);

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  const emptyStates = (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents</h3>
      <p className="mt-1 text-sm text-gray-500">
        Please type a word related to these three things
      </p>
    </div>
  );

  function getIncidenStatus(status) {
    let color;
    switch (status.toLowerCase()) {
      case "open":
        color = "bg-red-100 text-red-800";
        break;
      case "resolved":
        color = "bg-green-100 text-green-800";
        break;
      case "investigate":
        color = "bg-blue-100 text-blue-800";
        break;
      default:
        color = "";
    }
    return color;
  }

  return (
    <LayoutPage session={props.user} pageTitle="Incident Matching - Shield">
      <LayoutPageHeader
        variant="alternate"
        pageTitle={"Incident Matching"}
        pageSubTitle="This page is specifically for searches related to incident name,
                root causes and actions of incidents"
        backButton={true}
        href="/incidents"
      >
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <label htmlFor="incident-search" className="sr-only">
            Search
          </label>
          <div className="flex rounded-md shadow-sm">
            <div className="relative flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="incident-search"
                id="incident-search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search incidents"
                onKeyPress={onSearch}
              />
              <input
                type="text"
                name="incident-search"
                id="incident-search"
                className="hidden focus:ring-blue-500 focus:border-blue-500 w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search incidents"
                onKeyPress={onSearch}
              />
            </div>
          </div>
        </div>
      </LayoutPageHeader>
      <LayoutPageContent>
        {props.search === 400 ? (
          emptyStates
        ) : props.search !== 400 && props.search.length === 0 ? (
          emptyStates
        ) : (
          <>
            <Spin size="large" spinning={isLoading} tip="Loading...">
              <h1 className="mb-3">
                {props.totalCount} results about{" "}
                <span className="font-semibold">{props.keyword}</span>
              </h1>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {props.search.map((result) => (
                    <li key={result.id}>
                      <Link href={`/incidents/${result.id}`}>
                        <a className="block hover:bg-gray-50">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {result.incidentName}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p
                                  className={clsx(
                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                    getIncidenStatus(result.incidentStatus)
                                  )}
                                >
                                  {result.incidentStatus}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
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
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <DesktopComputerIcon
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  {result.paramApps.subName}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <FolderIcon
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  {result.paramIncidentType
                                    ? result.paramIncidentType.incidentType
                                    : "-"}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <CalendarIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <p>
                                  Started at{" "}
                                  <time dateTime={result.logStartTime}>
                                    {result.logStartTime
                                      ? format(
                                          new Date(result.logStartTime),
                                          "dd MMMM yyyy HH:mm",
                                          "id-ID"
                                        )
                                      : "-"}{" "}
                                  </time>
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Spin>

            <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{props.currentPage}</span> to{" "}
                  <span className="font-medium">{props.pageCount}</span> of{" "}
                  <span className="font-medium">{props.totalCount}</span>{" "}
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
                    "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  }
                />
              </div>
            </div>
          </>
        )}
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL_V2}/incidents/search`);
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
