import Head from "next/head";
import { LayoutNav } from "./layout-nav";
import { LayoutMain } from "./layout-main";
import { LayoutRoot } from "./layout-root";
import { LayoutSidebar } from "./layout-sidebar";
import { Toaster } from "react-hot-toast";

export const LayoutPage = ({
  children,
  session,
  pageTitle,
  isShowNotif = true,
}) => {
  return (
    <LayoutRoot>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Shield is incident and problem management application developed by SDK and AES Team APP Division. Inspired by SHIELD on the MCU which taking care of every single problem."
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            maxWidth: 800,
          },
          success: {
            iconTheme: {
              primary: "#48DD85",
            },
          },
        }}
      />
      <LayoutSidebar session={session} />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <LayoutNav session={session} isShowNotif={isShowNotif} />
        <LayoutMain>{children}</LayoutMain>
      </div>
    </LayoutRoot>
  );
};
