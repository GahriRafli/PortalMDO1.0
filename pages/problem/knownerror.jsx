import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "lib/session";
import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import { SearchIcon, CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";
import { Spin, Alert } from "antd";
import { PrimaryAnchorButton as Button } from "components/ui/button/primary-anchor-button";
import { Input } from "antd";

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

  const getKEDB = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/rootcause/all`
  );
  const knownerror = await getKEDB.json();

  if (getKEDB.status >= 200) {
    return {
      props: {
        user: user,
        kedb: knownerror.data,
      },
    };
  }
});

const KnownError = ({ user, kedb }) => {
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
            <div className="mt-10 mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-12">
              <div className="flex gap-x-2">
                <div className="flex-auto">
                  <label
                    htmlFor="search"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Ini Harusnya Label
                  </label>
                </div>
              </div>

              <h4>Ini yang berhasil</h4>
              <ul className="divide-y divide-gray-200">
                <li
                  key={kedb[0].id}
                  className="relative bg-white sm:rounded-lg my-5 py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                >
                  <div className="flex justify-between space-x-3">
                    <div className="min-w-0 flex-1">
                      <Link href={`/problem/${kedb[0].problem.id}`}>
                        <a
                          href={`/problem/${kedb[0].problem.id}`}
                          className="block focus:outline-none"
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-500">
                            <span className="font-bold">
                              {kedb[0].problem.problemNumber}
                            </span>
                            {kedb[0].problem.problemName}
                          </p>
                          <div className="mt-1 flex space-x-4">
                            <p className="flex items-center text-sm text-gray-500 truncate">
                              <CodeIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                                aria-hidden="true"
                              />{" "}
                              {kedb[0].app.subname}
                            </p>
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {kedb[0].problemType
                                ? kedb[0].problemType
                                : "Not Defined Problem Type"}
                            </p>
                            <p
                              className={classNames(
                                kedb[0].problemStatus === "Unassigned"
                                  ? "bg-red-100 text-gray-800"
                                  : kedb[0].problemStatus ===
                                    "Waiting for Review"
                                  ? "bg-gray-100 text-gray-800"
                                  : kedb[0].problemStatus === "Ongoing at JIRA"
                                  ? "bg-blue-100 text-gray-800"
                                  : kedb[0].problemStatus === "Done"
                                  ? "bg-green-100 text-gray-800"
                                  : "bg-gray-100 text-gray-800",
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              )}
                            >
                              {kedb[0].problemStatus == null
                                ? "Problem Status Not Defined"
                                : kedb[0].problemStatus}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                    <time
                      dateTime={kedb[0].createdAt}
                      className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                    >
                      {kedb[0].createdAt}
                    </time>
                  </div>
                  <div className="mt-4">
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Impacted System :{" "}
                      {kedb[0].impactSystem != null
                        ? kedb[0].impactSystem
                        : "Not Defined Yet/Recorded"}
                    </p>
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Root Cause :
                      {kedb[0].rca != null
                        ? kedb[0].rca
                        : "Not Defined Yet/Recorded"}
                    </p>
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Action :
                      {kedb[0].resolution != null
                        ? kedb[0].resolution
                        : "Not Defined Yet/Recorded"}
                    </p>
                  </div>
                </li>
              </ul>

              <h4>Ini yang di test</h4>
              <ul className="divide-y divide-gray-200">
                {kedb.map((result) => {
                  console.log(result)
                })}
                <li
                  key={kedb[0].id}
                  className="relative bg-white sm:rounded-lg my-5 py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                >
                  <div className="flex justify-between space-x-3">
                    <div className="min-w-0 flex-1">
                      <Link href={`/problem/${kedb[0].problem.id}`}>
                        <a
                          href={`/problem/${kedb[0].problem.id}`}
                          className="block focus:outline-none"
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-500">
                            <span className="font-bold">
                              {kedb[0].problem.problemNumber}
                            </span>
                            {kedb[0].problem.problemName}
                          </p>
                          <div className="mt-1 flex space-x-4">
                            <p className="flex items-center text-sm text-gray-500 truncate">
                              <CodeIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                                aria-hidden="true"
                              />{" "}
                              {kedb[0].app.subname}
                            </p>
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {kedb[0].problemType
                                ? kedb[0].problemType
                                : "Not Defined Problem Type"}
                            </p>
                            <p
                              className={classNames(
                                kedb[0].problemStatus === "Unassigned"
                                  ? "bg-red-100 text-gray-800"
                                  : kedb[0].problemStatus ===
                                    "Waiting for Review"
                                  ? "bg-gray-100 text-gray-800"
                                  : kedb[0].problemStatus === "Ongoing at JIRA"
                                  ? "bg-blue-100 text-gray-800"
                                  : kedb[0].problemStatus === "Done"
                                  ? "bg-green-100 text-gray-800"
                                  : "bg-gray-100 text-gray-800",
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              )}
                            >
                              {kedb[0].problemStatus == null
                                ? "Problem Status Not Defined"
                                : kedb[0].problemStatus}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                    <time
                      dateTime={kedb[0].createdAt}
                      className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                    >
                      {kedb[0].createdAt}
                    </time>
                  </div>
                  <div className="mt-4">
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Impacted System :{" "}
                      {kedb[0].impactSystem != null
                        ? kedb[0].impactSystem
                        : "Not Defined Yet/Recorded"}
                    </p>
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Root Cause :
                      {kedb[0].rca != null
                        ? kedb[0].rca
                        : "Not Defined Yet/Recorded"}
                    </p>
                    <p className="line-clamp-2 text-sm text-gray-600 truncate">
                      Action :
                      {kedb[0].resolution != null
                        ? kedb[0].resolution
                        : "Not Defined Yet/Recorded"}
                    </p>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default KnownError;
