import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ESBHeader from "../../components/ESB/ESBHeader";
import withSession from "lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { Input } from "antd";
import axios from "axios";
import { SearchIcon } from "@heroicons/react/outline";

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

  return {
    props: {
      user: user,
    },
  };
});

const UserManagementPage = ({ user }) => {
  const [userData, setUserData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.pathname;
    router.push(currentPath);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1.0/users/list`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      console.log("Response:", response.data);
      setUserData(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      // Handle error
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Fetch user data on initial render

  return (
    <>
      <LayoutPage session={user} pageTitle="User Management" isShowNotif={false}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="user-management">
            <ESBHeader title="User Management"></ESBHeader>

            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                {showTable && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-2">User ID</th>
                          <th className="px-3 py-2">Username</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Role</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.map((user) => (
                          <tr key={user.id}>
                            <td className="border px-3 py-2">{user.id}</td>
                            <td className="border px-3 py-2">{user.username}</td>
                            <td className="border px-3 py-2">{user.email}</td>
                            <td className="border px-3 py-2">{user.role}</td>
                            <td className="border px-3 py-2">{user.status}</td>
                            <td className="border px-3 py-2">Action</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
    </>
  );
};

export default UserManagementPage;
