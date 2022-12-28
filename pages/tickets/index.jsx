import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import withSession from "lib/session";
import { PrimaryButton, SecondaryButton } from "components/ui/button";

export default function Tickets({ user }) {
  return (
    <LayoutPage session={user} pageTitle="Tickets - Shield">
      <LayoutPageHeader variant="alternate" pageTitle={"Ticket List"}>
        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start space-x-3">
          <PrimaryButton>New Ticket</PrimaryButton>
          <SecondaryButton>Print</SecondaryButton>
        </div>
      </LayoutPageHeader>
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
