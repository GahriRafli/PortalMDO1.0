import Head from "next/head";
import PageHeader from "../../components/problems/ProblemHeader";
import CreateForm from "components/problems/CreateForm";
import withSession from "../../lib/session";
import * as ProblemHelper from "../../components/problems/ProblemHelper";
import { LayoutRoot } from "components/layout/layout-root";
import { CustomToaster } from "components/ui/notifications/custom-toast";
import { LayoutSidebar } from "components/layout/layout-sidebar";
import { LayoutNav } from "components/layout/layout-nav";

function CreateNew({ user }) {
  return (
    <>
      <LayoutRoot>
        <Head>
          <title>Problem Non-Incident Ticket</title>
          <meta
            name="description"
            content="Shield is incident and problem management application developed by SDK and AES Team APP Division. Inspired by SHIELD on the MCU which taking care of every single problem."
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="robots" content="noindex,nofollow" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <CustomToaster />
        <LayoutSidebar session={user} />
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <LayoutNav session={user} searchNotif={false} />
          <section>
            <PageHeader title="Problem Non-Incident Ticket" />

            <div className="hidden sm:block">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <CreateForm user={user} />
              </div>
            </div>
          </section>
        </div>
      </LayoutRoot>
    </>
  );
}

export default CreateNew;

export const getServerSideProps = withSession(async function ({ req }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  } else if (!ProblemHelper.checkMemberAES(user)) {
    return {
      redirect: {
        destination: "/problem/list",
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
