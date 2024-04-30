import withSession from "lib/session";
import { HeartIcon } from "@heroicons/react/outline";
import { CellMetric, CellResult } from "components/healthcheck/Cell";
import PageHeader from "components/problems/ProblemHeader";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import Approval from "components/healthcheck/Approval";

const styleHead =
  "px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider";

const HealthCheckDetail = ({ user, record }) => {
  let listIP = record.ipAddress.split(";");
  let listAppendix = record.appendix.split(";");
  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Health Check Detail"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="record-detail-section">
            <PageHeader title="Health Check Detail"></PageHeader>
            <div className="hidden sm:block">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <div className="max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-0 lg:max-w-full lg:px-0 lg:grid-flow-col-dense lg:grid-cols-3">
                  <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                    <section
                      aria-labelledby="record-detail"
                      className="space-y-6 lg:col-start-1 lg:col-span-2"
                    >
                      <div
                        className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:p-6"
                        // style={{ width: "60vw" }}
                      >
                        <div>
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <HeartIcon
                              className="h-6 w-6 text-green-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="mt-3 sm:mt-5">
                            <h3 className="leading-6 text-center font-medium text-gray-700">
                              <b className="text-lg">
                                {record.app.name} - {record.app.subName}
                              </b>
                              <p className="text-sm text-gray-500">
                                {record.healthcheckNumber}
                              </p>
                            </h3>
                            <div className="text-center">
                              <img
                                className="my-2 py-2"
                                style={{ width: "50%" }}
                                src={`${process.env.NEXT_PUBLIC_HOST_ADDRESS}/${listAppendix[0]}`}
                                alt={record.healthcheckNumber}
                              />
                            </div>
                            <div>
                              {/* Section IP Address */}
                              <table className="table-fixed my-2">
                                <thead>
                                  <tr className="border-t border-gray-200">
                                    <th className={styleHead}>
                                      List of IP Address
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                  {listIP.map((ip, i) => {
                                    return (
                                      <tr key={`list-ip-${i}`}>
                                        <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                          {ip}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              {/* <HCTabs /> */}

                              <table className="table-fixed">
                                <thead>
                                  <tr className="border-t border-gray-200">
                                    <th className={styleHead}>Metrics</th>
                                    <th className={styleHead}>Unit</th>
                                    <th className={styleHead}>Target</th>
                                    <th className={styleHead}>Description</th>
                                    <th className={styleHead}>Result</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                  {record.hcResults.map((row, i) => {
                                    if (i == 0 || i == 4 || i == 7 || i == 11) {
                                      return (
                                        <>
                                          <CellMetric row={row} i={i} />
                                          <CellResult row={row} i={i} />
                                        </>
                                      );
                                    } else {
                                      return <CellResult row={row} i={i} />;
                                    }
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <section
                    aria-labelledby="report-approval"
                    className="lg:col-start-3 lg:col-span-1"
                  >
                    <Approval record={record} user={user} />
                  </section>
                </div>
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
};

export const getServerSideProps = withSession(async function ({ req, params }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/hc/record/${params.id}`
  );
  const data = await res.json();

  return {
    props: {
      user: user,
      record: data.data,
      idRecord: params.id,
    },
  };
});

export default HealthCheckDetail;
