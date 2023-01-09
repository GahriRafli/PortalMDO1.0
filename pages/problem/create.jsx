import PageHeader from "../../components/problems/ProblemHeader";
import CreateForm from "components/problems/CreateForm";
import withSession from "../../lib/session";
import * as ProblemHelper from "../../components/problems/ProblemHelper";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";

function CreateNew({ user }) {
  return (
    <>
      <LayoutPage
        session={user}
        pageTitle="Problem Non-Incident Ticket"
        isShowNotif={false}
      >
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section>
            <PageHeader title="Problem Non-Incident Ticket" />

            <div className="hidden sm:block">
              <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <CreateForm user={user} />
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
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
