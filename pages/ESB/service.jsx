import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ESBHeader from "../../components/ESB/ESBHeader";
import withSession from "lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { Input, Modal, Form, Button } from "antd";
import { SearchIcon } from "@heroicons/react/outline";
import axios from "axios";

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

const ServicePage = ({ user }) => {
  const [serviceData, setServiceData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedServiceId, setUpdatedServiceId] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null); // State untuk menyimpan status pembaruan
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.pathname;
    router.push(currentPath);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setServiceData(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching service data:", error.message);
    }
  };

  const onServiceIdSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = e.target.value;
      setSearchKeyword(keyword);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/configs/esb-service?serviceId=${keyword}`;
      fetchData(url);
    }
  };

  const onServiceNameSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const name = e.target.value;
      setSearchName(name);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/configs/esb-service?esbSvcName=${name}`;
      fetchData(url);
    }
  };

  const showModal = (serviceId) => {
    setUpdatedServiceId(serviceId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/configs/${updatedServiceId}/esb-service`,
        {
          newServiceId: values.newServiceId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log("Update successful:", response.data);
      handleCancel();
      // Atur status pembaruan menjadi berhasil
      setUpdateStatus("success");
    } catch (error) {
      console.error("Error updating service:", error);
      // Atur status pembaruan menjadi gagal
      setUpdateStatus("failed");
    }
  };

  return (
    <>
      <LayoutPage session={user} pageTitle="ESB - Service" isShowNotif={false}>
        <LayoutPageHeader></LayoutPageHeader>
        <LayoutPageContent>
          <section id="service">
            <ESBHeader title="ESB - Service"></ESBHeader>

            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="my-3 max-w-full lg:max-w-full">
                  <div className="flex gap-x-2">
                    <div className="flex-auto">
                      <label
                        htmlFor="search"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Service ID
                      </label>
                      <form action="#" method="GET">
                        <Input
                          onKeyPress={onServiceIdSearch}
                          disabled={false}
                          allowClear
                          placeholder="Search here..."
                          prefix={
                            <SearchIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          }
                          style={{
                            borderRadius: "0.375rem",
                            height: "38px",
                          }}
                        />
                      </form>
                    </div>
                    <div className="flex-auto">
                      <label
                        htmlFor="search"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Service Name
                      </label>
                      <form action="#" method="GET">
                        <Input
                          onKeyPress={onServiceNameSearch}
                          disabled={false}
                          allowClear
                          placeholder="Search here..."
                          prefix={
                            <SearchIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          }
                          style={{
                            borderRadius: "0.375rem",
                            height: "38px",
                          }}
                        />
                      </form>
                    </div>
                  </div>
                </div>
                {showTable && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-2">Service ID</th>
                          <th className="px-3 py-2">Service Name</th>
                          <th className="px-3 py-2">ESBMonolithDC Status</th>
                          <th className="px-3 py-2">ESBMonolithDRC Status</th>
                          <th className="px-3 py-2">ESBMonolithODC Status</th>
                          <th className="px-3 py-2">ESBMSR Status</th>
                          <th className="px-3 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-3 py-2">
                            {
                              serviceData.responseData.ESBMonolithDCData[0]
                                .serviceId
                            }
                          </td>
                          <td className="border px-3 py-2">
                            {
                              serviceData.responseData.ESBMonolithDCData[0]
                                .esbSvcName
                            }
                          </td>
                          <td className="border px-3 py-2">
                            <Button type="text">
                              {serviceData.responseData.ESBMonolithDCStatus
                                ? "✅"
                                : "❌"}
                            </Button>
                          </td>
                          <td className="border px-3 py-2">
                            <Button type="text">
                              {serviceData.responseData.ESBMonolithDRCStatus
                                ? "✅"
                                : "❌"}
                            </Button>
                          </td>
                          <td className="border px-3 py-2">
                            <Button type="text">
                              {serviceData.responseData.ESBMonolithODCStatus
                                ? "✅"
                                : "❌"}
                            </Button>
                          </td>
                          <td className="border px-3 py-2">
                            <Button type="text">
                              {serviceData.responseData.ESBMSRStatus
                                ? "✅"
                                : "❌"}
                            </Button>
                          </td>
                          <td className="border px-3 py-2">
                            <button
                              onClick={() =>
                                showModal(
                                  serviceData.responseData.ESBMonolithDCData[0]
                                    .serviceId
                                )
                              }
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </LayoutPageContent>
      </LayoutPage>
      <Modal
        title="Update Service ID"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="newServiceId"
            label="New Service ID"
            initialValue={updatedServiceId}
            rules={[
              { required: true, message: "Please input the new service ID!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Pesan pop-up */}
      {updateStatus === "success" && (
        <Modal title="Success" visible={updateStatus === "success"} onCancel={() => setUpdateStatus(null)}>
          <p>Service ID successfully updated!</p>
        </Modal>
      )}
      {updateStatus === "failed" && (
        <Modal title="Failed" visible={updateStatus === "failed"} onCancel={() => setUpdateStatus(null)}>
          <p>Failed to update service ID. Please try again later.</p>
        </Modal>
      )}
    </>
  );
};

export default ServicePage;
