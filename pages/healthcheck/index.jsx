import PageHeader from "../../components/problems/ProblemHeader";
import withSession from "../../lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import format from "date-fns/format";
import { EyeIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { PriorityArrow, CountSummary } from "components/problems/ProblemBadge";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  const fetchHC = await fetch(`${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/all`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const getHC = await fetchHC.json();
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  if (getHC.status === 200) {
    return {
      props: {
        user: user,
        hc: getHC.data,
      },
    };
  } else if (getHC.status === 202) {
    return {
      props: {
        user: user,
        hc: getHC.data,
      },
    };
  } else {
    return {
      props: {
        user: user,
        hc: null,
      },
    };
  }
});

export default function HCReport({ user, hc }) {
  const styleHead =
    "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";
  const styleData = "px-6 py-3 text-base text-gray-500 text-center font-normal";

  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Health Check Report"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="report-list-section">
            {/* Page title & actions */}
            <PageHeader title="Health Check Report"></PageHeader>

            {/* Recommendation Tables table (small breakpoint and up) */}
            <div className="hidden sm:block mt-3">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-t border-gray-200">
                      <th className={styleHead}>No</th>
                      <th className={styleHead}>Report Number</th>
                      <th className={styleHead}>Application</th>
                      <th className={styleHead}>Summary</th>
                      <th className={styleHead}>Function</th>
                      <th className={styleHead}>Maker</th>
                      <th className={styleHead}>Status</th>
                      <th className={styleHead}>{null}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {hc.map((data) => {
                      let listAppendix = data.appendix.split(";");
                      return (
                        <tr key={`hc-data-${data.id}`}>
                          <td className={styleData}>{data.id}</td>
                          <td className={styleData}>
                            <div className="text-base text-gray-900 font-medium">
                              <a
                                className="text-gray-900"
                                href={`/healthcheck/${data.id}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {data.healthcheckNumber}
                              </a>
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(
                                new Date(data.createdAt),
                                "d LLLL yyyy HH:mm",
                                "id-ID"
                              )}
                            </div>
                          </td>
                          <td className={styleData}>
                            <div className="inline-flex items-center">
                              <PriorityArrow value={data.app.criticalityApp} />
                              <div className="ml-2">{data.app.subName}</div>
                            </div>
                          </td>
                          <td className={styleData}>
                            {data.summary != null
                              ? data.summary.split(";").map((count) => {
                                  return <CountSummary value={count} />;
                                })
                              : null}
                          </td>
                          <td className={styleData}>
                            {data.userGroup.groupName}
                          </td>
                          <td className={styleData}>
                            {data.created_by.fullName}
                          </td>
                          <td className={styleData}>{data.status}</td>
                          <td className={styleData}>
                            <div className="flex">
                              <a
                                href={`/healthcheck/${data.id}`}
                                className="text-gray-900"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <EyeIcon
                                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              </a>
                              {data.appendix != null ? (
                                <a
                                  href={listAppendix[1]}
                                  className="text-gray-900"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <DocumentTextIcon
                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                </a>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
}
