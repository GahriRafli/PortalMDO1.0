import { LayoutNav } from "./layout-nav";
import { LayoutMain } from "./layout-main";
import { LayoutRoot } from "./layout-root";
import { LayoutSidebar } from "./layout-sidebar";
import Head from "next/head";

export const LayoutPage = ({ children, session, pageTitle }) => {
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
      <LayoutSidebar session={session} />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <LayoutNav session={session} />
        <LayoutMain>{children}</LayoutMain>
      </div>
    </LayoutRoot>
  );
};
