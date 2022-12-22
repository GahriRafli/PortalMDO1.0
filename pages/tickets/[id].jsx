import { useEffect, useState, Fragment } from "react";
import withSession from "../../lib/session";
import { Tab, Menu, Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PencilIcon,
  UserAddIcon,
  UserCircleIcon as UserCircleIconSolid,
  UsersIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { DefaultCard } from "components/ui/card/default-card";
import {
  PrimaryButton,
  SecondaryButton,
  WhiteButton,
} from "components/ui/button/index";
import { ReactSelect, TextareaInput } from "components/ui/forms";
import { formatDistanceToNowStrict } from "date-fns";
import { Space, Image as AntdImage, Upload } from "antd";
import { TicketRightSection } from "components/tickets/ticket-right-section";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { Spinner } from "components/ui/svg/spinner";
import { toast } from "react-hot-toast";
// Sepaket modal component start
import { Modal } from "components/ui/modal/modal";
import { ModalBody } from "components/ui/modal/modal-body";
import { ModalFooter } from "components/ui/modal/modal-footer";
// Sepaket modal component end
import { CustomAlert } from "components/ui/alert";
import AsyncSelect from "react-select/async";
import {
  createFileName,
  IconOption,
  styledReactSelect,
  ValueOption,
} from "components/utils";
import {
  getApplication,
  getPriorityTicket,
  getTicketType,
} from "lib/api-helper";
import {
  DocumentTextIcon,
  PaperClipIcon,
  RefreshIcon,
} from "@heroicons/react/outline";

const URL = process.env.NEXT_PUBLIC_API_URL;
const tabs = [
  { id: 0, name: "Reply to Uker" },
  { id: 1, name: "Internal Note" },
  { id: 2, name: "Other Department" },
];

export default function ReplyTicket({
  user,
  ticketData,
  ticketHistoryData,
  paramGroup,
}) {
  const router = useRouter();
  // react hook form for reply ticket
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // react hook form for close ticket
  const {
    register: register2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
    reset: reset2,
    handleSubmit: handleSubmit2,
  } = useForm();

  // react hook form for edit ticket
  const editDefaultValue = {
    idApps: ticketData.paramTicketApps
      ? {
          value: ticketData.paramTicketApps.id,
          label: ticketData.paramTicketApps.subName,
          criticality: ticketData.paramTicketApps.criticalityApp,
        }
      : false,
    idTicketType: {
      value: ticketData.paramTicketType?.id,
      label: ticketData.paramTicketType?.ticketType,
    },
    idPriorityTicket: ticketData.paramTicketPriority
      ? {
          value: ticketData.paramTicketPriority.id,
          label: ticketData.paramTicketPriority.priorityTicket,
        }
      : false,
    idEscalatedGroup: ticketData.paramTicketEscalatedGroup
      ? {
          value: ticketData.paramTicketEscalatedGroup.id,
          label: ticketData.paramTicketEscalatedGroup.groupName,
        }
      : false,
    escalatedRole: ticketData.escalatedRole,
  };
  const {
    formState: { errors: errors3, isSubmitting: isSubmitting3 },
    control: control3,
    handleSubmit: handleSubmit3,
    reset: reset3,
  } = useForm({ defaultValues: editDefaultValue });

  const [replyTo, setReplyTo] = useState(0);
  const [visibility, setVisibility] = useState({
    internalNote: "hidden",
    otherDepartment: "hidden",
    replyTextArea: "",
  });
  const [required, setRequired] = useState({
    escalatedRole: false,
    idEscalatedGroup: false,
    replyTextArea: "This is required",
  });
  const [optionList, setOptionList] = useState({
    listGroupReply: [],
    listGroupEdit: [],
    ticketType: [],
    ticketPriority: [],
  });

  // Loading handler
  const [replyIsLoading, setReplyIsLoading] = useState(false);
  const [editIsLoading, setEditIsLoading] = useState(false);
  const [solveIsLoading, setSolveIsLoading] = useState(false);
  const [assignIsLoading, setAssignIsLoading] = useState(false);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [solveModalIsOpen, setSolveModalIsOpen] = useState(false);
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  // Handle react-select dropdown position
  const [portalTarget, setPortalTarget] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      setPortalTarget(document.querySelector("body"));
    }
  }, []);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  function filterParamGroup(query) {
    const filtered = paramGroup.filter(
      (d) => d.prefix.toLowerCase() == query.toLowerCase()
    );
    return filtered;
  }

  // Get list Group
  useEffect(() => {
    let replyOptions = paramGroup.map((d) => ({
      value: d.id,
      label: d.groupName,
      prefix: d.prefix,
    }));

    const editOptions = paramGroup.map((d) => ({
      value: d.id,
      label: d.groupName,
      defaultRole: d.defaultRole,
    }));

    replyOptions.splice(
      replyOptions.findIndex((e) => e.prefix === "SDK"),
      1
    );
    replyOptions.splice(
      replyOptions.findIndex((e) => e.prefix === "UKER"),
      1
    );
    setOptionList((optionList) => ({
      ...optionList,
      listGroupReply: replyOptions,
      listGroupEdit: editOptions,
    }));
  }, []);

  // Get list Application
  const loadApplications = (value, callback) => {
    getApplication(value, callback);
  };

  // Get param ticket type
  useEffect(() => {
    getTicketType()
      .then((res) => {
        const options = res.data.map((d) => ({
          value: d.id,
          label: d.ticketType,
        }));

        setOptionList((optionList) => ({
          ...optionList,
          ticketType: options,
        }));
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          toast.error(`Request: ${error.request}`);
        } else {
          toast.error(`Msg: ${error.message}`);
        }
      });
  }, []);

  // Get param ticket priority
  useEffect(() => {
    getPriorityTicket().then((res) => {
      const options = res.data.map((d) => ({
        value: d.id,
        label: d.priorityTicket,
      }));

      setOptionList((optionList) => ({
        ...optionList,
        ticketPriority: options,
      }));
    });
  }, []);

  function getAssignees(role) {
    let roleName;
    switch (role) {
      case "0":
        roleName = "SDK Operator";
        break;
      case "1":
        roleName = "SDK Engineer";
        break;
      case "2":
        roleName = "Other Team (OPA)";
        break;
      case "3":
        roleName = "Other Department Engineer";
        break;
      default:
        roleName = "Not Defined";
    }

    return roleName;
  }

  const handleTicketDest = (index) => {
    setReplyTo(index);
    if (index === 2) {
      // Reply to Other Department
      setVisibility((visibility) => ({
        ...visibility,
        otherDepartment: "",
        internalNote: "hidden",
      }));
      setRequired((required) => ({
        ...required,
        idEscalatedGroup: true,
      }));
      unregister("escalatedRole");
    } else if (index === 1) {
      // Internal Note
      setVisibility((visibility) => ({
        ...visibility,
        internalNote: "",
        otherDepartment: "hidden",
      }));
      setRequired((required) => ({
        ...required,
        escalatedRole: "This is required",
      }));
      unregister("idEscalatedGroup");
    } else {
      // Reply to Uker
      setVisibility((visibility) => ({
        ...visibility,
        otherDepartment: "hidden",
        internalNote: "hidden",
      }));
      unregister(["idEscalatedGroup", "escalatedRole"]);
      setRequired((required) => ({
        ...required,
        escalatedRole: false,
        idEscalatedGroup: false,
      }));
    }
  };

  const handleAssignTicket = () => {
    setAssignIsLoading(true);
    axios
      .patch(`${URL}/tickets/${ticketData.id}/assign`, "", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error(res.status);
        } else {
          toast.success("Ticket successfully assigned.");
          refreshData();
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          toast.error(`Request: ${error.request}`);
        } else {
          toast.error(`Msg: ${error.message}`);
        }
      })
      .finally(() => {
        setAssignIsLoading(false);
        setAssignModalIsOpen(false);
      });
  };

  // handle on reply submit
  const [fileList, setFileList] = useState([]);
  const [showList, setShowList] = useState(true);

  const handleUpload = () => {
    unregister(["historyContent"]);
    setRequired((required) => ({
      ...required,
      replyTextArea: false,
    }));
    setVisibility((visibility) => ({
      ...visibility,
      replyTextArea: "hidden",
    }));
  };

  const handleResetButton = () => {
    register("historyContent", { required: "This is required" });
    setFileList([]);
    setShowList(false);
    setVisibility((visibility) => ({
      ...visibility,
      replyTextArea: "",
    }));
    reset({
      historyContent: "",
      escalatedRole: "",
      idEscalatedGroup: "",
    });
  };

  function onSubmit(data) {
    const formData = new FormData();
    // cek jika ada file yang diupload
    if (fileList.length !== 0) {
      formData.append("historyContent", fileList);
    } else {
      formData.append("historyContent", data.historyContent);
    }

    formData.append("isFromUker", "N");
    if (replyTo === 0) {
      // Reply to uker
      const { defaultRole, id } = filterParamGroup("UKER")[0];
      formData.append("idEscalatedGroup", id);
      formData.append("escalatedRole", defaultRole);
      formData.append("isSentToUker", "Y");
    } else if (replyTo === 1) {
      // Internal Note
      const { id } = filterParamGroup("SDK")[0];
      formData.append("idEscalatedGroup", id);
      formData.append("escalatedRole", data.escalatedRole);
      formData.append("isSentToUker", "N");
    } else {
      const { id, defaultRole } = filterParamGroup(data.idEscalatedGroup)[0];
      formData.append("isSentToUker", "N");
      formData.append("idEscalatedGroup", id);
      formData.append("escalatedRole", defaultRole);
    }

    setReplyIsLoading(true);
    axios
      .post(`${URL}/tickets/${ticketData.id}/history`, formData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error(res.status);
        } else {
          toast.success("Message successfully sent.");
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          toast.error(`Request: ${error.request}`);
        } else {
          toast.error(`Msg: ${error.message}`);
        }
      })
      .finally(() => {
        reset({
          historyContent: "",
          escalatedRole: "",
          idEscalatedGroup: "",
        });
        setReplyIsLoading(false);
        setFileList([]);
        setShowList(false);
        setVisibility((visibility) => ({
          ...visibility,
          replyTextArea: "",
        }));
        refreshData();
      });
  }

  const handleCloseSubmit = (data) => {
    setSolveIsLoading(true);
    axios
      .patch(`${URL}/tickets/${ticketData.id}/close`, data, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error(res.status);
        } else {
          toast.success("Ticket has been closed.");
          setSolveModalIsOpen(false);
          refreshData();
        }
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          toast.error(`Request: ${error.request}`);
        } else {
          toast.error(`Msg: ${error.message}`);
        }
      })
      .finally(() => {
        setSolveIsLoading(false);
        reset2({ resolution: "" });
      });
  };

  const OnEditSubmit = (data) => {
    const isFormChange =
      JSON.stringify(editDefaultValue) !== JSON.stringify(data);

    Object.assign(data, {
      idApps: data.idApps.value,
      idTicketType: data.idTicketType.value,
      idPriorityTicket: data.idPriorityTicket.value,
      escalatedRole: data.idEscalatedGroup.defaultRole,
      idEscalatedGroup: data.idEscalatedGroup.value,
    });

    if (isFormChange) {
      setEditIsLoading(true);
      axios
        .patch(`${URL}/tickets/${ticketData.id}`, data, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })
        .then((res) => {
          if (res.status !== 200) {
            toast.error(res.status);
          } else {
            toast.success("Ticket successfully edited.");
          }
        })
        .catch((error) => {
          if (error.response) {
            toast.error(
              `${error.response.data.message} (Code: ${error.response.status})`
            );
          } else if (error.request) {
            toast.error(`Request: ${error.request}`);
          } else {
            toast.error(`Msg: ${error.message}`);
          }
        })
        .finally(() => {
          refreshData();
          setEditIsLoading(false);
          reset3(editDefaultValue);
          setEditModalIsOpen(false);
        });
    }
    setEditModalIsOpen(false);
  };

  return (
    <LayoutPage session={user} pageTitle="Reply Tickets - Shield">
      <LayoutPageHeader></LayoutPageHeader>
      <LayoutPageContent>
        <DefaultCard>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
            <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
              <div>
                <div>
                  {/* Ticket header start */}
                  <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Ticket ID #{ticketData.id}
                      </h1>
                      <p className="mt-2 text-sm text-gray-500">
                        Opened by{" "}
                        <a href="#" className="font-medium text-gray-900">
                          {ticketData.picName} - {ticketData.picPN} •{" "}
                          {ticketData.branchName} ({ticketData.branchCode})
                        </a>
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-3 md:mt-0">
                      <WhiteButton type="button" onClick={() => refreshData()}>
                        <RefreshIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
                          aria-hidden="true"
                        />
                        Refresh
                      </WhiteButton>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        {({ open }) => (
                          <>
                            <div>
                              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                Options
                                <ChevronDownIcon
                                  className="-mr-1 ml-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>

                            <Transition
                              show={open}
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items
                                static
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                              >
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        onClick={() =>
                                          setAssignModalIsOpen(true)
                                        }
                                        className={clsx(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}
                                      >
                                        Assign to me
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        onClick={() => {
                                          reset3(editDefaultValue);
                                          setEditModalIsOpen(true);
                                        }}
                                        className={clsx(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}
                                      >
                                        Edit
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        onClick={() =>
                                          setSolveModalIsOpen(true)
                                        }
                                        className={clsx(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}
                                      >
                                        Close issue
                                      </a>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </>
                        )}
                      </Menu>
                    </div>
                  </div>
                  {/* Ticket header end */}

                  {/* Ticket left content (Mobile version) start */}
                  <aside className="mt-8 xl:hidden">
                    <TicketRightSection
                      ticketStatus={ticketData.ticketStatus}
                      totalReply={ticketHistoryData.length}
                      createdAt={ticketData.createdAt}
                      ticketOwner={ticketData.paramTicketOwner?.fullname}
                      escalatedRole={getAssignees(ticketData.escalatedRole)}
                      priority={ticketData.paramTicketPriority?.priorityTicket}
                      ticketType={ticketData.paramTicketType?.ticketType}
                      apps={ticketData.paramTicketApps?.subName}
                    />
                  </aside>
                  {/* Ticket left content (Mobile version) end */}

                  {/* Ticket main content start */}
                  <div className="py-3 xl:pt-6 xl:pb-0">
                    <h2 className="sr-only">Description</h2>
                    <div className="prose max-w-none">
                      <p>{ticketData.content}</p>
                    </div>
                  </div>
                  {/* Ticket main content end */}
                </div>
              </div>

              {/* Ticket reply section start */}
              <section
                aria-labelledby="activity-title"
                className="mt-8 xl:mt-10"
              >
                <div>
                  <div className="divide-y divide-gray-200">
                    <div className="pb-4">
                      <h2
                        id="activity-title"
                        className="text-lg font-medium text-gray-900"
                      >
                        Activity
                      </h2>
                    </div>
                    <div className="pt-6">
                      {/* Activity feed*/}
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {ticketHistoryData.map((item, itemIdx) => (
                            <li key={item.id}>
                              <div className="relative pb-8">
                                {itemIdx !== ticketHistoryData.length - 1 ? (
                                  <span
                                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex items-start space-x-3">
                                  <>
                                    {item.isFromUker === "N" ? (
                                      <div className="relative">
                                        <UserCircleIconSolid className="h-10 w-10 bg-white text-gray-500 flex items-center justify-center ring-8 ring-white" />

                                        <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                          <ChatAltIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="relative px-1">
                                        <div className="h-8 w-8 bg-blue-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                          <UserCircleIconSolid
                                            className="h-5 w-5 text-blue-500"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <div className="text-sm">
                                          <a
                                            href="#"
                                            className="font-medium text-gray-900"
                                          >
                                            {
                                              item.paramHistoryCreatedBy
                                                .fullname
                                            }
                                          </a>
                                        </div>
                                        <div className="mt-0.5 text-xs text-gray-500">
                                          Replied{" "}
                                          {formatDistanceToNowStrict(
                                            new Date(item.createdAt)
                                          )}{" "}
                                          ago
                                          {item.isSentToUker === "N" &&
                                            item.isFromUker === "N" && (
                                              <>
                                                <span className="ml-1 mr-2">
                                                  {" "}
                                                  &bull;
                                                </span>
                                                <Space>
                                                  <LockClosedIcon className="h-3 w-3" />{" "}
                                                </Space>
                                                {item.paramHistoryEscalatedGroup
                                                  .prefix === "SDK"
                                                  ? getAssignees(
                                                      item.escalatedRole
                                                    )
                                                  : item
                                                      .paramHistoryEscalatedGroup
                                                      .groupName}
                                              </>
                                            )}
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm text-gray-700">
                                        {item.historyType === "image" ? (
                                          <AntdImage
                                            width={200}
                                            className="rounded-md"
                                            src={item.historyContent}
                                            alt=""
                                          />
                                        ) : item.historyType === "document" ? (
                                          <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                            <div className="w-auto pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                              <div className="w-0 flex-1 flex items-center">
                                                <DocumentTextIcon
                                                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                                <span className="ml-2 flex-1 w-0 truncate">
                                                  {`Document ${createFileName(
                                                    ticketData.id,
                                                    item.id,
                                                    item.historyContent
                                                  )}`}
                                                </span>
                                              </div>
                                              <div className="ml-4 flex-shrink-0">
                                                <a
                                                  href={item.historyContent}
                                                  download={createFileName(
                                                    ticketData.id,
                                                    item.id,
                                                    item.historyContent
                                                  )}
                                                  className="font-medium text-blue-500 hover:text-blue-400"
                                                >
                                                  Download
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <p>{item.historyContent}</p>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Ticket reply textarea start */}
                      <div className="mt-6">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <UserCircleIconSolid className="h-10 w-10 text-gray-500 bg-white flex items-center justify-center ring-8 ring-white" />

                              <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                <ChatAltIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            {/* Tabs reply Start */}
                            <div className="hidden sm:block pb-4">
                              <div className="border-b border-gray-200">
                                <Tab.Group onChange={handleTicketDest}>
                                  <Tab.List className="-mb-px flex space-x-8">
                                    {tabs.map((tab, idx) => (
                                      <Tab
                                        key={idx}
                                        className={({ selected }) =>
                                          clsx(
                                            "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm",
                                            selected
                                              ? "border-blue-500 text-blue-600"
                                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                          )
                                        }
                                      >
                                        {tab.name}
                                      </Tab>
                                    ))}
                                  </Tab.List>
                                </Tab.Group>
                              </div>
                            </div>
                            {/* Tabs reply End */}
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div
                                className={clsx(
                                  "mb-4",
                                  visibility.otherDepartment
                                )}
                              >
                                <div className="mt-1 relative rounded-md shadow-sm w-1/2">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UsersIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <select
                                    {...register("idEscalatedGroup", {
                                      required: {
                                        value: required.idEscalatedGroup,
                                        message: "This is required",
                                      },
                                    })}
                                    name="idEscalatedGroup"
                                    className="focus:ring-blue-500 focus:border-blue-500 text-gray-700 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    defaultValue={null}
                                  >
                                    <option value="">Select...</option>
                                    {optionList.listGroupReply.map((group) => (
                                      <option
                                        value={group.prefix}
                                        key={group.value}
                                      >
                                        {group.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {errors.idEscalatedGroup && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.idEscalatedGroup.message}
                                  </p>
                                )}
                              </div>
                              {/* Internal SDK Destination Start */}
                              <div
                                className={clsx(
                                  "flex mb-4",
                                  visibility.internalNote
                                )}
                              >
                                <div className="flex items-center mr-4">
                                  <input
                                    {...register("escalatedRole", {
                                      required: required.escalatedRole,
                                    })}
                                    type="radio"
                                    value={0}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Operator
                                  </label>
                                </div>
                                <div className="flex items-center mr-4">
                                  <input
                                    {...register("escalatedRole", {
                                      required: required.escalatedRole,
                                    })}
                                    type="radio"
                                    value={1}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Engineer
                                  </label>
                                </div>
                                {errors.escalatedRole && (
                                  <p className="text-sm text-red-600">
                                    {errors.escalatedRole.message}
                                  </p>
                                )}
                              </div>
                              {/* Internal SDK Destination End */}
                              {/* Reply section (Textarea & Button) start */}
                              <div>
                                <div>
                                  <label
                                    htmlFor="historyContent"
                                    className="sr-only"
                                  >
                                    historyContent
                                  </label>

                                  <TextareaInput
                                    {...register("historyContent", {
                                      required: required.replyTextArea,
                                    })}
                                    placeholder="Add a reply..."
                                    className={visibility.replyTextArea}
                                  />

                                  {errors.historyContent && (
                                    <p className="mt-2 text-sm text-red-600">
                                      {errors.historyContent.message}
                                    </p>
                                  )}

                                  {/* Upload section start */}
                                  <div className="mt-2">
                                    <Upload
                                      beforeUpload={(file) => {
                                        setShowList(true);
                                        setFileList(file);
                                      }}
                                      onRemove={() => setFileList([])}
                                      listType="picture"
                                      maxCount={1}
                                      showUploadList={showList}
                                    >
                                      <button
                                        onClick={handleUpload}
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 text-sm italic rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                                      >
                                        <PaperClipIcon
                                          className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2"
                                          aria-hidden="true"
                                        />
                                        Attach a file or drag here
                                      </button>
                                    </Upload>
                                  </div>
                                  {/* Upload section end */}
                                </div>

                                <div className="mt-6 flex items-center justify-end space-x-3">
                                  <SecondaryButton
                                    type="button"
                                    onClick={handleResetButton}
                                  >
                                    Reset
                                  </SecondaryButton>
                                  <PrimaryButton
                                    type="submit"
                                    className={
                                      replyIsLoading
                                        ? "disabled:opacity-50 cursor-not-allowed"
                                        : ""
                                    }
                                    disabled={replyIsLoading}
                                  >
                                    {replyIsLoading ? (
                                      <>
                                        <Spinner /> Sending...
                                      </>
                                    ) : (
                                      "Reply"
                                    )}
                                  </PrimaryButton>
                                </div>
                              </div>
                              {/* Reply section (Textarea & Button) end */}
                            </form>
                          </div>
                        </div>
                      </div>
                      {/* Ticket reply textarea end */}
                    </div>
                  </div>
                </div>
              </section>
              {/* Ticket reply section end */}
            </div>
            {/* Ticket left content (Desktop version) start */}
            <aside className="hidden xl:block xl:pl-8">
              <TicketRightSection
                ticketStatus={ticketData.ticketStatus}
                totalReply={ticketHistoryData.length}
                createdAt={ticketData.createdAt}
                ticketOwner={ticketData.paramTicketOwner?.fullname}
                escalatedRole={getAssignees(ticketData.escalatedRole)}
                priority={ticketData.paramTicketPriority?.priorityTicket}
                ticketType={ticketData.paramTicketType?.ticketType}
                apps={ticketData.paramTicketApps?.subName}
              />
            </aside>
            {/* Ticket left content (Desktop version) end */}
          </div>
          {/* START -- place Modal component here */}
          <Modal
            show={solveModalIsOpen}
            onClose={setSolveModalIsOpen}
            size="medium"
          >
            <form key={2} onSubmit={handleSubmit2(handleCloseSubmit)}>
              <ModalBody>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Close Issue
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to close this issue? All of your
                        data will be saved. This action cannot be undone.
                      </p>
                      {errorMsg.length > 0 && (
                        <CustomAlert
                          type="danger"
                          title="Something went wrong!"
                          className="mt-2"
                          dismissButton={true}
                        >
                          <p>{errorMsg}</p>
                        </CustomAlert>
                      )}
                      <TextareaInput
                        {...register2("resolution", {
                          required: "This is required",
                        })}
                        className="mt-3"
                        placeholder="Add your resolution..."
                      />

                      {errors2.resolution && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors2.resolution.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <PrimaryButton
                  type="submit"
                  className={
                    solveIsLoading
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : ""
                  }
                  disabled={solveIsLoading}
                >
                  {solveIsLoading ? (
                    <>
                      <Spinner /> Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </PrimaryButton>
                <WhiteButton
                  type="button"
                  className="mr-2"
                  onClick={() => setSolveModalIsOpen(false)}
                >
                  Cancel
                </WhiteButton>
              </ModalFooter>
            </form>
          </Modal>

          <Modal
            show={editModalIsOpen}
            onClose={setEditModalIsOpen}
            size="x-large"
          >
            <form key={3} onSubmit={handleSubmit3(OnEditSubmit)}>
              <ModalBody>
                <div className="sm:flex sm:items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PencilIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit ticket
                    </h3>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-6">
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Application
                    </label>
                    <Controller
                      name="idApps"
                      control={control3}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <AsyncSelect
                          {...field}
                          name="idApps"
                          instanceId={"idApps"}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Search for application"
                          loadOptions={loadApplications}
                          components={{
                            Option: IconOption,
                            SingleValue: ValueOption,
                          }}
                        />
                      )}
                    />
                    {errors3.idApps && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors3.idApps.message}
                      </p>
                    )}
                    <span className="mt-2 text-xs italic font-normal text-gray-500">
                      Type at least 3 letters of application name
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Ticket Type
                    </label>
                    <Controller
                      name="idTicketType"
                      control={control3}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          instanceId={"idTicketType"}
                          options={optionList.ticketType}
                          isSearchable={false}
                        />
                      )}
                    />
                    {errors3.idTicketType && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors3.idTicketType.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Ticket Priority
                    </label>
                    <Controller
                      name="idPriorityTicket"
                      control={control3}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          instanceId={"idPriorityTicket"}
                          options={optionList.ticketPriority}
                          menuPortalTarget={portalTarget}
                          isSearchable={false}
                        />
                      )}
                    />
                    {errors3.idPriorityTicket && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors3.idPriorityTicket.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Escalated Group
                    </label>
                    <Controller
                      name="idEscalatedGroup"
                      control={control3}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          instanceId={"idEscalatedGroup"}
                          options={optionList.listGroupEdit}
                          menuPortalTarget={portalTarget}
                        />
                      )}
                    />
                    {errors3.idEscalatedGroup && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors3.idEscalatedGroup.message}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <PrimaryButton
                  type="submit"
                  className={
                    editIsLoading
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : ""
                  }
                  disabled={editIsLoading}
                >
                  {editIsLoading ? (
                    <>
                      <Spinner /> Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </PrimaryButton>
                <WhiteButton
                  type="button"
                  className="mr-2"
                  onClick={() => {
                    reset3(editDefaultValue);
                    setEditModalIsOpen(false);
                  }}
                >
                  Cancel
                </WhiteButton>
              </ModalFooter>
            </form>
          </Modal>

          <Modal show={assignModalIsOpen} onClose={setAssignModalIsOpen}>
            <ModalBody>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <UserAddIcon
                    className="h-6 w-6 text-blue-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Assign ticket
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to assign this ticket ? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <PrimaryButton
                type="button"
                onClick={handleAssignTicket}
                disabled={assignIsLoading}
                className={
                  assignIsLoading
                    ? "disabled:opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                {assignIsLoading ? (
                  <>
                    {" "}
                    <Spinner /> Assigning...
                  </>
                ) : (
                  "Assign"
                )}
              </PrimaryButton>
              <WhiteButton
                type="button"
                className="mr-2"
                onClick={() => setAssignModalIsOpen(false)}
              >
                Cancel
              </WhiteButton>
            </ModalFooter>
          </Modal>
          {/* END -- place Modal component here */}
        </DefaultCard>
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({
  req,
  res,
  params,
}) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  res = await fetch(`${URL}/tickets/${params.id}/history`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  const getListGroup = await fetch(
    `${URL}/parameters/group?isActive=Y&isTicket=Y`
  );
  const listGroup = await getListGroup.json();

  if (res.status === 200) {
    // Pass data to the page via props
    data.ticketHistoryData.shift();
    return {
      props: {
        user: req.session.get("user"),
        ticketData: data.ticketData,
        ticketHistoryData: data.ticketHistoryData,
        paramGroup: listGroup.data,
      },
    };
  } else if (res.status === 401) {
    if (data.code === 999) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    } else if (data.code === 401) {
      return {
        notFound: true,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});
