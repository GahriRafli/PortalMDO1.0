import { useState, useEffect, useReducer } from "react";
import { LayoutPage, LayoutPageHeader } from "components/layout/index";
import withSession from "lib/session";
import { Verified } from "components/ui/svg/verified-icon";
import { OfficeBuildingIcon } from "@heroicons/react/solid";
import { getNickName } from "components/utils";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  AreaChart,
  Title,
  BarChart,
  Subtitle,
  Flex,
  BarList,
  Text,
  DateRangePicker,
  DonutChart,
  Legend,
  Divider,
  Metric,
  Toggle,
  ToggleItem,
} from "@tremor/react";
import { DotBlink } from "components/ui/svg/spinner";

export default function Home({ user, statsIncidentData }) {
  return (
    <LayoutPage session={user} pageTitle="Home Dashboard - MDO">
      <LayoutPageHeader>
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            {/* Profile */}
            <div className="flex items-center">
              {/* <img
                loading="lazy"
                className="h-16 w-16 text-gray-500 sm:block"
                // src={user.photo}
                src="/Slightly_Smiling_Face.png"
                alt="User Proflie"
              /> */}
              <div>
                <div className="flex items-center">
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                    Welcome back,{" "}
                    {user.fullname ? getNickName(user.fullname) : user.username}{" "}
                  </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Company</dt>
                  <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                    <OfficeBuildingIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Bank Rakyat Indonesia
                  </dd>
                  <dt className="sr-only">Account status</dt>
                  <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                    <Verified
                      className="flex-shrink-0 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Verified Bristars account
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </LayoutPageHeader>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const myApi = {
    url: process.env.NEXT_PUBLIC_API_URL,
    urlv2: process.env.NEXT_PUBLIC_API_URL_V2,
    headers: { Authorization: `Bearer ${user.accessToken}` },
  };

  // Lakukan pengambilan data lainnya dari API atau sumber eksternal lainnya jika diperlukan

  return {
    props: {
      user,
    },
  };
});
