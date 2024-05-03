import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ESBHeader from "../../components/ESB/ESBHeader";
import withSession from "lib/session";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { Input, Modal, Form, Button, Checkbox, Row, Col } from "antd";
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
  const [updatedServiceName, setUpdatedServiceName] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [error, setError] = useState(null);
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
      setServiceData(response.data.responseData);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching service data:", error.message);
      setError("Failed to fetch service data. Please try again later.");
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

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
    if (e.target.value === "") {
      router.push(router.pathname); // Reload page when input is cleared
    }
  };

  const showModal = (serviceId, serviceName) => {
    setUpdatedServiceId(serviceId);
    setUpdatedServiceName(serviceName);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      const requestData = {
        siteDBESB: serviceData.siteDBESB, // Menggunakan nilai dari response API
        esbSvcName: updatedServiceName, // Menggunakan nilai yang disimpan dalam state
        newServiceId: values.newServiceId, // Menggunakan nilai dari form input
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/configs/${updatedServiceId}/esb-service`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json", // Set header untuk menyatakan bahwa body adalah JSON
          },
        }
      );

      console.log("Update successful:", response.data);
      handleCancel();
      setUpdateStatus("success");
    } catch (error) {
      console.error("Error updating service:", error);
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
                          onChange={handleInputChange} // Add onChange handler
                          value={searchKeyword}
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
                          onChange={(e) => setSearchName(e.target.value)}
                          value={searchName}
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
                {error && <div className="text-red-500">{error}</div>}
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
                        {serviceData.ESBMonolithDCStatus === false &&
                        serviceData.ESBMonolithDRCStatus === false &&
                        serviceData.ESBMonolithODCStatus === false &&
                        serviceData.ESBMSRStatus === false ? (
                          <tr>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                            <td className="border px-3 py-2">Tidak Tersedia</td>
                          </tr>
                        ) : (
                          //disini looping tr nya
                          <tr>
                            <td className="border px-3 py-2">
                              {serviceData.ESBMonolithDCStatus
                                ? serviceData.ESBMonolithDCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.serviceId}</div>
                                    )
                                  )
                                : serviceData.ESBMonolithDRCStatus
                                ? serviceData.ESBMonolithDRCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.serviceId}</div>
                                    )
                                  )
                                : serviceData.ESBMonolithODCStatus
                                ? serviceData.ESBMonolithODCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.serviceId}</div>
                                    )
                                  )
                                : serviceData.ESBMSRStatus
                                ? serviceData.ESBMSRData.map((item, index) => (
                                    <div key={index}>{item.serviceId}</div>
                                  ))
                                : "-"}
                            </td>
                            <td className="border px-3 py-2">
                              {serviceData.ESBMonolithDCStatus
                                ? serviceData.ESBMonolithDCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.esbSvcName}</div>
                                    )
                                  )
                                : serviceData.ESBMonolithDRCStatus
                                ? serviceData.ESBMonolithDRCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.esbSvcName}</div>
                                    )
                                  )
                                : serviceData.ESBMonolithODCStatus
                                ? serviceData.ESBMonolithODCData.map(
                                    (item, index) => (
                                      <div key={index}>{item.esbSvcName}</div>
                                    )
                                  )
                                : serviceData.ESBMSRStatus
                                ? serviceData.ESBMSRData.map((item, index) => (
                                    <div key={index}>{item.esbSvcName}</div>
                                  ))
                                : "-"}
                            </td>
                            <td className="border px-3 py-2">
                              <Button type="text">
                                {serviceData.ESBMonolithDCStatus
                                  ? "Tersedia"
                                  : "Tidak Tersedia"}
                              </Button>
                            </td>
                            <td className="border px-3 py-2">
                              <Button type="text">
                                {serviceData.ESBMonolithDRCStatus
                                  ? "Tersedia"
                                  : "Tidak Tersedia"}
                              </Button>
                            </td>
                            <td className="border px-3 py-2">
                              <Button type="text">
                                {serviceData.ESBMonolithODCStatus
                                  ? "Tersedia"
                                  : "Tidak Tersedia"}
                              </Button>
                            </td>
                            <td className="border px-3 py-2">
                              <Button type="text">
                                {serviceData.ESBMSRStatus
                                  ? "Tersedia"
                                  : "Tidak Tersedia"}
                              </Button>
                            </td>
                            <td className="border px-3 py-2">
                              <button
                                onClick={() => {
                                  let serviceId = "-";
                                  let esbSvcName = "-";

                                  if (serviceData.ESBMonolithDCStatus) {
                                    serviceId =
                                      serviceData.ESBMonolithDCData.length > 0
                                        ? serviceData.ESBMonolithDCData[0]
                                            .serviceId
                                        : "-";
                                    esbSvcName =
                                      serviceData.ESBMonolithDCData.length > 0
                                        ? serviceData.ESBMonolithDCData[0]
                                            .esbSvcName
                                        : "-";
                                  } else if (serviceData.ESBMonolithDRCStatus) {
                                    serviceId =
                                      serviceData.ESBMonolithDRCData.length > 0
                                        ? serviceData.ESBMonolithDRCData[0]
                                            .serviceId
                                        : "-";
                                    esbSvcName =
                                      serviceData.ESBMonolithDRCData.length > 0
                                        ? serviceData.ESBMonolithDRCData[0]
                                            .esbSvcName
                                        : "-";
                                  } else if (serviceData.ESBMonolithODCStatus) {
                                    serviceId =
                                      serviceData.ESBMonolithODCData.length > 0
                                        ? serviceData.ESBMonolithODCData[0]
                                            .serviceId
                                        : "-";
                                    esbSvcName =
                                      serviceData.ESBMonolithODCData.length > 0
                                        ? serviceData.ESBMonolithODCData[0]
                                            .esbSvcName
                                        : "-";
                                  } else if (serviceData.ESBMSRStatus) {
                                    serviceId =
                                      serviceData.ESBMSRData.length > 0
                                        ? serviceData.ESBMSRData[0].serviceId
                                        : "-";
                                    esbSvcName =
                                      serviceData.ESBMSRData.length > 0
                                        ? serviceData.ESBMSRData[0].esbSvcName
                                        : "-";
                                  }

                                  showModal(serviceId, esbSvcName);
                                }}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        )}
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
          <Form.Item label="Service Name">
            <Input value={updatedServiceName} disabled />
          </Form.Item>
          <Form.Item label="SiteDBESB">
            <Checkbox.Group
              value={
                serviceData.siteDBESB ? serviceData.siteDBESB.split(",") : []
              }
              onChange={(values) =>
                setServiceData((prev) => ({
                  ...prev,
                  siteDBESB: values.join(","),
                }))
              }
            >
              <Row>
                <Col span={24}>
                  <Checkbox value="ESB_MONOLITH_DC">ESB MONOLITH DC</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="ESB_MONOLITH_DRC">ESB MONOLITH DRC</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="ESB_MONOLITH_ODC">ESB MONOLITH ODC</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="ESB_MSR">ESB MSR</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
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

      {updateStatus === "success" && (
        <Modal
          title="Success"
          visible={updateStatus === "success"}
          onCancel={() => setUpdateStatus(null)}
          footer={[
            <Button key="cancel" onClick={() => setUpdateStatus(null)}>
              Cancel
            </Button>,
            <Button
              key="ok"
              type="primary"
              onClick={() => setUpdateStatus(null)}
            >
              OK
            </Button>,
          ]}
        >
          <p>Service ID successfully updated!</p>
        </Modal>
      )}
    </>
  );
};

export default ServicePage;
