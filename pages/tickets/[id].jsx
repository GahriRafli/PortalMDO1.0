import { useEffect, useState } from "react";
import withSession from "../../lib/session";
import { Tab } from "@headlessui/react";
import {
  ChatAltIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PencilIcon,
  UserCircleIcon as UserCircleIconSolid,
  UsersIcon,
} from "@heroicons/react/solid";
import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { DefaultCard } from "components/ui/card/default-card";
import { PrimaryButton, WhiteButton } from "components/ui/button/index";
import { TextareaInput } from "components/ui/forms";
import { formatDistanceToNowStrict } from "date-fns";
import { Space, Image as AntdImage } from "antd";
import { TicketRightSection } from "components/tickets/ticket-right-section";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { async } from "regenerator-runtime";
import axios from "axios";
import { useRouter } from "next/router";
import { Spinner } from "components/ui/svg/spinner";

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
  const { register, unregister, handleSubmit, reset, formState } = useForm();
  const { isSubmitting, errors } = formState;

  const [replyTo, setReplyTo] = useState(0);
  const [visibility, setVisibility] = useState({
    internalNote: "hidden",
    otherDepartment: "hidden",
  });
  const [required, setRequired] = useState({
    escalatedRole: false,
    idEscalatedGroup: false,
  });
  const [optionList, setOptionList] = useState({
    listGroup: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  console.log(isSubmitting);

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
    let optionsData = paramGroup.map((d) => ({
      value: d.id,
      label: d.groupName,
      prefix: d.prefix,
    }));
    optionsData.splice(
      optionsData.findIndex((e) => e.prefix === "SDK"),
      1
    );
    optionsData.splice(
      optionsData.findIndex((e) => e.prefix === "UKER"),
      1
    );
    setOptionList((optionList) => ({
      ...optionList,
      listGroup: optionsData,
    }));
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

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset({
  //       historyContent: "",
  //       escalatedRole: "",
  //       idEscalatedGroup: "",
  //     });
  //   }
  // }, [formState, reset, isSubmitSuccessful]);

  function onSubmit(data) {
    const formData = new FormData();
    formData.append("historyContent", data.historyContent);
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

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 20000);
    });

    axios
      .post(`${URL}/tickets/${ticketData.id}/history`, formData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => {
        if (res.status !== 200) {
          alert(res.status);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          alert(`Request: ${error.request}`);
        } else {
          alert(`Msg: ${error.message}`);
        }
      })
      .finally(() => {
        reset({
          historyContent: "",
          escalatedRole: "",
          idEscalatedGroup: "",
        });
        refreshData();
      });

    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`);
    // }

    // console.log(data);
  }

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
                      <WhiteButton type="button">
                        <PencilIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Edit</span>
                      </WhiteButton>
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
                      apps={ticketData.paramTicketApps?.name}
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
                                        <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                          <UserCircleIconSolid
                                            className="h-5 w-5 text-gray-500"
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
                                    {optionList.listGroup.map((group) => (
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

                              <div>
                                <label
                                  htmlFor="historyContent"
                                  className="sr-only"
                                >
                                  historyContent
                                </label>

                                <TextareaInput
                                  {...register("historyContent", {
                                    required: "This is required",
                                  })}
                                  placeholder="Add a reply..."
                                />

                                {errors.historyContent && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {errors.historyContent.message}
                                  </p>
                                )}
                              </div>

                              <div className="mt-6 flex items-center justify-end space-x-4">
                                <WhiteButton type="button">
                                  <CheckCircleIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-green-500"
                                    aria-hidden="true"
                                  />
                                  Close issue
                                </WhiteButton>
                                <PrimaryButton
                                  type="submit"
                                  className={
                                    isSubmitting
                                      ? "disabled:opacity-50 cursor-not-allowed"
                                      : ""
                                  }
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting && <Spinner />}
                                  Reply
                                </PrimaryButton>
                              </div>
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
                apps={ticketData.paramTicketApps?.name}
              />
            </aside>
            {/* Ticket left content (Desktop version) end */}
          </div>
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
    return {
      props: {
        user: req.session.get("user"),
        ticketData: data.ticketData,
        ticketHistoryData: data.ticketHistoryData.slice(0, -1),
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
