import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import withSession from "lib/session";

export default function Tickets({ user }) {
  return (
    <LayoutPage session={user} pageTitle="Tickets - Shield">
      <LayoutPageHeader></LayoutPageHeader>
      <LayoutPageContent></LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permmanent: false,
      },
    };
  }

  return {
    props: {
      user: req.session.get("user"),
    },
  };
});
