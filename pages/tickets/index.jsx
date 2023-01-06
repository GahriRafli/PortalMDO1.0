import { LayoutPage, LayoutPageContent } from "components/layout/index";
import withSession from "lib/session";
import { Controller, useForm } from "react-hook-form";
import { Input as InputTag, Tooltip as TooltipTag, Space } from "antd";
import DateRangeFilter from "components/tickets/daterange-filter";
import Link from "next/link";
import AvatarCell from "components/tickets/avatar-cell";
import PageHeader from "components/tickets/page-header";
import Table from "components/tickets/table";
import CardStats from "components/tickets/card-stats";
import {
  ChevronUpIcon,
  DotsVerticalIcon,
  CheckCircleIcon,
  UserAddIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
// import {
//   SelectColumnFilter,
//   StatusFilter,
// } from "components/tickets/dropdown-filter";
// import Grid from 'antd/lib/card/Grid';
import axios from "axios";
import format from "date-fns/format";
import { useMemo, Fragment } from "react";
import {
  getApplication,
  getPriorityTicket,
  getTicketType,
} from "lib/api-helper";
import {
  StatusPill,
  StatusText,
  StatusTicket,
} from "components/tickets/status-pill";
import {
  PlusSmIcon,
  SearchIcon,
  UserGroupIcon,
  UserIcon,
  // LinkIcon,
  MailOpenIcon,
  MailIcon,
  // InboxInIcon,
  // DocumentSearchIcon,
  InformationCircleIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";
import {
  PrimaryButton,
  // SecondaryButton,
  WhiteButton,
} from "components/ui/button/index";
import { ReactSelect, TextareaInput } from "components/ui/forms";
import AsyncSelect from "react-select/async";
import {
  styledReactSelect,
  createParam,
  IconOption,
  ValueOption,
} from "components/utils";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime";
import { Disclosure, Menu, Tab, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { Spinner } from "components/ui/svg/spinner";
import { CustomAlert } from "components/ui/alert";
// Modal component start
import { Modal } from "components/ui/modal/modal";
import { ModalBody } from "components/ui/modal/modal-body";
import { ModalFooter } from "components/ui/modal/modal-footer";
// Modal component end

export default function TicketList(props) {
  const [tableData, setTableData] = useState([]);
  // const [ticketNumber, setTicketNumber] = useState("");
  // const [apps, setApps] = useState('');
  // const [ticketType, setTicketType] = useState('');
  const [TicketTypeOptions, setTicketTypeOptions] = useState([]);
  // const [ticketStatus, setTicketStatus] = useState('');
  // const [createdAt, setCreatedTime] = useState('');
  // const [closedAt, setClosedTime] = useState('');
  const [portalTarget, setPortalTarget] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const router = useRouter();
  const [ticketID, setTicketID] = useState("");
  const [editID, setEditID] = useState("");
  const [closeID, setCloseID] = useState("");
  // Assign
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);
  const [assignIsLoading, setAssignIsLoading] = useState(false);
  //errmsgclose
  const [errorMsg, setErrorMsg] = useState([]);
  //Edit
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editIsLoading, setEditIsLoading] = useState(false);
  //Close
  const [solveModalIsOpen, setSolveModalIsOpen] = useState(false);
  const [solveIsLoading, setSolveIsLoading] = useState(false);
  const tableInstance = useRef(null);
  const count = tableData.length;
  const [value, setValue] = useState(""); // tableInstance.current.state.globalFilter

  const [optionList, setOptionList] = useState({
    listGroupReply: [],
    listGroupEdit: [],
    ticketType: [],
    ticketPriority: [],
  });

  const ticketStatusOptions = [
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
  ];

  const escalatedGroupOptions = [
    { value: "0", label: "SDK Operator" },
    { value: "1", label: "SDK Engineer" },
    { value: "2", label: "Other Team (OPA)" },
    { value: "3", label: "Other Department Engineer" },
  ];

  const perPageOptions = [
    { value: "10", label: "Showing 10" },
    { value: "25", label: "Showing 25" },
    { value: "50", label: "Showing 50" },
  ];

  // const editDefaultValue = {
  //   idApps: props.paramTicketApps
  //     ? {
  //         value: props.paramTicketApps.id,
  //         label: props.paramTicketApps.subName,
  //         criticality: props.paramTicketApps.criticalityApp,
  //       }
  //     : false,
  //   idTicketType: {
  //     value: props.paramTicketType?.id,
  //     label: props.paramTicketType?.ticketType,
  //   },
  //   idPriorityTicket: props.paramTicketPriority
  //     ? {
  //         value: props.paramTicketPriority.id,
  //         label: props.paramTicketPriority.priorityTicket,
  //       }
  //     : false,
  //   idEscalatedGroup: props.paramTicketEscalatedGroup
  //     ? {
  //         value: props.paramTicketEscalatedGroup.id,
  //         label: props.paramTicketEscalatedGroup.groupName,
  //       }
  //     : false,
  //   escalatedRole: props.escalatedRole,
  // };

  const editDefaultValue = {
    idApps: {
      value: "",
      label: "",
    },
    idTicketType: {
      value: "",
      label: "",
    },
    idPriorityTicket: {
      value: "",
      label: "",
    },
    idEscalatedGroup: {
      value: "",
      label: "",
    },
    escalatedRole: "",
  };

  const [newEditDefaultValues, setNewEditDefaultValues] =
    useState(editDefaultValue);
  console.log(newEditDefaultValues);

  const {
    formState: { errors: errors3, isSubmitting: isSubmitting3 },
    control: control3,
    handleSubmit: handleSubmit3,
    reset: reset3,
  } = useForm({ defaultValues: newEditDefaultValues });

  const refreshData = () => {
    router.replace(router.asPath);
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

  //Pagination
  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  // Get data aplikai async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${value}&status=A`
        )
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: d.subName,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  // Get data ticket type
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/tickettype?isActive=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.ticketType,
        }));
        setTicketTypeOptions(data);
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
  }, []);

  // Get data param group
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/group?isActive=Y&isTicket=Y`
      )
      .then((res) => {
        const data = res.data.data.map((d) => ({
          value: d.id,
          label: d.groupName,
          defaultRole: d.defaultRole,
        }));
        setOptionList((optionList) => ({
          ...optionList,
          listGroupEdit: data,
        }));
      })
      .catch((err) => toast.error(`Fu Plan ${err}`));
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

  //Handlesubmitclose
  const {
    register: register2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
    reset: reset2,
    handleSubmit: handleSubmit2,
  } = useForm();

  // Handle react-select dropdown position
  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      setPortalTarget(document.querySelector("body"));
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Ticket Name",
        accessor: "content",
        Cell: (props) => {
          return (
            <div className="mt-4">
              <Link href={`/tickets/${props.row.original.id}`}>
                <a className="text-blue-500 hover:text-blue-900">
                  {props.value.length > 100
                    ? `${props.value.substring(0, 150).concat("...")}`
                    : `${props.value}`}
                </a>
              </Link>

              <div className="mt-6">
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  {props.row.original.picName
                    ? `@${props.row.original.picName} - `
                    : ""}
                  {props.row.original.id
                    ? `${props.row.original.branchCode}`
                    : ""}
                  <p>
                    {props.row.original.id ? `${props.row.original.id}` : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Application",
        accessor: "paramTicketApps.subName",
        Cell: (props) => {
          return (
            <div>
              <p className="mb-2 text-black">
                {props.row.original.paramTicketApps
                  ? ` ${props.row.original.paramTicketApps.subName}`
                  : "-"}
              </p>
              <p className="mb-2 text-gray-500">
                {props.row.original.paramTicketType
                  ? ` ${props.row.original.paramTicketType.ticketType}`
                  : ""}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Priority",
        accessor: "paramTicketPriority.priorityTicket",
        Cell: StatusPill,
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "ticketStatus",
        Cell: StatusTicket,
        disableSortBy: true,
      },
      {
        Header: "Started At",
        accessor: "createdAt",
        Cell: (props) => {
          return (
            <div>
              <div className="text-xs text-gray-900">
                {format(
                  new Date(props.row.original.createdAt),
                  "dd MMM yyyy HH:mm"
                )}
              </div>
              <div className="text-xs text-gray-500">
                {props.row.original.closedAt ? (
                  <span className="text-xs">
                    {props.row.original.closedAt} minutes
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Reporter",
        accessor: "paramCreatedBy.fullname",
        Cell: AvatarCell,
        disableSortBy: true,
      },
      {
        Header: " ",
        accessor: "paramTicketEscalatedGroup.groupName",
        Cell: (props) => {
          return (
            <div>
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                        <DotsVerticalIcon
                          className="w-5 h-5 ml-5 text-black"
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
                        className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link href={`/tickets/${props.row.original.id}`}>
                                <a
                                  className={clsx(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  View
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => {
                                  setAssignModalIsOpen(true);
                                  setTicketID(props.row.original.id);
                                }}
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
                          {/* Dimatikan dulu karena masih belum sempirna */}
                          {/* <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  onClick={() => {
                                    const row = props.row.original;
                                    // reset3(newEditDefaultValues);
                                    setEditModalIsOpen(true);
                                    setEditID(row.id)
                                    setNewEditDefaultValues((newEditDefaultValues) => ({
                                      ...newEditDefaultValues,
                                      idApps : {
                                        value: row.paramTicketApps?.id,
                                        label: row.paramTicketApps?.subName,
                                        criticality: row.paramTicketApps?.criticality
                                      },
                                      idTicketType: {
                                        value: row.paramTicketType?.id,
                                        label: row.paramTicketType?.ticketType
                                      },
                                      idPriorityTicket: {
                                        value: row.paramTicketPriority?.id,
                                        label: row.paramTicketPriority?.priorityTicket
                                      },
                                      idEscalatedGroup: {
                                        value: row.paramTicketEscalatedGroup?.id,
                                        label: row.paramTicketEscalatedGroup?.groupName
                                      },
                                      escalatedRole: row.escalatedRole || null
                                    }));
                                  }}
                                  className={clsx(
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                  )}
                                >
                                  Edit
                                </a>
                              )}
                            </Menu.Item> */}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => {
                                  setSolveModalIsOpen(true);
                                  setCloseID(props.row.original.id);
                                }}
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
          );
        },
        disableSortBy: true,
      },
    ],
    []
  );

  // Coba HandleAssign
  const handleAssignTicket = () => {
    setAssignIsLoading(true);
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketID}/assign`,
        "",
        {
          headers: { Authorization: `Bearer ${props.user.accessToken}` },
        }
      )
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

  //Handle edit
  const OnEditSubmit = (data) => {
    const isFormChange = true; // JSON.stringify(editDefaultValue) !== JSON.stringify(data);

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
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${editID}`, data, {
          headers: { Authorization: `Bearer ${props.user.accessToken}` },
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
          // reset3(newEditDefaultValues);
          setEditModalIsOpen(false);
        });
    }
    setEditModalIsOpen(false);
  };

  //HandleClose
  const handleCloseSubmit = (data) => {
    setSolveIsLoading(true);
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${closeID}/close`,
        data,
        {
          headers: { Authorization: `Bearer ${props.user.accessToken}` },
        }
      )
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

  //Handler Pagination
  const paginationHandler = (page) => {
    const currentPath = router.pathname; // '/tickets/search'
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;
    setSelectedPage(currentQuery.page);

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  //Handle Tiket Number
  const handleTicketNumChange = (value) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value === "") {
      let param = new URLSearchParams(currentQuery);
      param.delete("id");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      currentQuery.id = value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  //Handle branch
  const handleBranchChange = (value) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value === "") {
      let param = new URLSearchParams(currentQuery);
      param.delete("branchCode");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      currentQuery.branchCode = value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  //Handle Search
  const handleSearchChange = (value) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value === "") {
      let param = new URLSearchParams(currentQuery);
      param.delete("content");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else if (value.length >= 3) {
      currentQuery.content = value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else {
      return false;
    }
  };

  //Handle Application
  const handleAppChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.idApps = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("idApps");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  //Handle Ticket Type
  const handleTicketTypeChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.idTicketType = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("idTicketType");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  //Handle Ticket Status
  const handleTicketStatusChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.ticketStatus = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("ticketStatus");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  //Handle Page
  const handleperPageChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.perPage = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("perPage");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  //Handle Date
  const handleDateChange = (value, dateString) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (value == null) {
      let param = new URLSearchParams(currentQuery);
      param.delete("startCreatedAt");
      param.delete("endCreatedAt");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      currentQuery.startCreatedAt = dateString[0];
      currentQuery.endCreatedAt = dateString[1];
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    }
  };

  //Handle Escalated Role
  const handleEscalatedRoleChange = (e, { action }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };

    if (action === "select-option") {
      currentQuery.escalatedRole = e.value;
      router.push({
        pathname: currentPath,
        query: currentQuery,
      });
    } else if (action === "clear") {
      let param = new URLSearchParams(currentQuery);
      param.delete("escalatedRole");
      router.push({
        pathname: currentPath,
        query: createParam(param.toString()),
      });
    } else {
      return false;
    }
  };

  // Hande Global Change
  const handleGlobalChange = useAsyncDebounce((value) => {
    tableInstance.current.setGlobalFilter(value || undefined);
  }, 1000);

  return (
    <LayoutPage session={props.user} pageTitle="Ticket - Shield">
      <PageHeader title="Tickets Management">
        <Link href="/tickets/add" passHref>
          <PrimaryButton>
            <PlusSmIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            New Tickets
          </PrimaryButton>
        </Link>
      </PageHeader>
      <LayoutPageContent>
        {/* Start Filter Panel */}
        <section
          aria-labelledby="filter-incident"
          className="mb-5 lg:col-start-3 lg:col-span-1"
        >
          {/* Cards */}
          <div className="px-3 mx-3 mt-3 mb-16 sm:px-7 lg:px-9">
            <ul className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
              <CardStats
                id="1"
                bgColor="bg-red-400"
                initials={<MailOpenIcon className="w-6 h-6" />}
                title="Ticket Open"
                total="0"
                desc="View All"
              />
              <CardStats
                id="2"
                bgColor="bg-green-400"
                initials={<MailIcon className="w-6 h-6" />}
                title="Ticket Closed "
                total="0"
                desc="View All"
              />
              <CardStats
                id="3"
                bgColor="bg-yellow-300"
                initials={<UserIcon className="w-6 h-6" />}
                title="Ticket in Operator"
                total="0"
                desc="View All"
              />
              <CardStats
                id="4"
                bgColor="bg-blue-400"
                initials={<UserGroupIcon className="w-6 h-6" />}
                title="Ticket in Engineer"
                total="0"
                desc="View All"
              />
            </ul>
          </div>
          <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:px-6">
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-start justify-between w-full text-base text-left text-gray-400">
                    <Space>
                      <SearchIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-base font-normal">
                        Search in Ticket
                      </span>
                    </Space>
                    <span className="flex items-center ml-6 h-7">
                      <AdjustmentsIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-3">
                    <hr className="mb-3 divide-y divide-gray-200" />
                    <div className="grid grid-cols-4 gap-4 ">
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="search"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Search
                        </label>
                        <InputTag
                          allowClear
                          onChange={(e) => handleSearchChange(e.target.value)}
                          placeholder={`${count} records...`}
                          prefix={
                            <SearchIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          }
                          style={{
                            borderRadius: "0.375rem",
                            width: "100%",
                            height: "38px",
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Ticket Number
                        </label>
                        <InputTag
                          allowClear
                          onPressEnter={(e) =>
                            handleTicketNumChange(e.target.value)
                          }
                          onChange={(e) =>
                            handleTicketNumChange(e.target.value)
                          }
                          placeholder=" "
                          suffix={
                            <TooltipTag title="Press Enter to Search">
                              <InformationCircleIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </TooltipTag>
                          }
                          style={{
                            borderRadius: "0.375rem",
                            height: "38px",
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Application
                        </label>
                        <AsyncSelect
                          isClearable
                          id="application"
                          instanceId={"application"}
                          defaultValue={""}
                          loadOptions={loadApplications}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-300 focus:border-blue-300"
                          onChange={handleAppChange}
                          menuPortalTarget={portalTarget}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Ticket Type
                        </label>
                        <ReactSelect
                          id="TicketTypeOptions"
                          instanceId={"TicketTypeOptions"}
                          defaultValue={""}
                          options={TicketTypeOptions}
                          isClearable
                          onChange={handleTicketTypeChange}
                          menuPortalTarget={portalTarget}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <ReactSelect
                          id="ticketStatus"
                          instanceId={"ticketStatus"}
                          defaultValue={""}
                          options={ticketStatusOptions}
                          isClearable
                          onChange={handleTicketStatusChange}
                          menuPortalTarget={portalTarget}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Date
                        </label>
                        <DateRangeFilter onChange={handleDateChange} />
                      </div>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Branch Code
                        </label>
                        <InputTag
                          allowClear
                          onPressEnter={(e) =>
                            handleBranchChange(e.target.value)
                          }
                          onChange={(e) => handleBranchChange(e.target.value)}
                          placeholder=" "
                          suffix={
                            <TooltipTag title="Press Enter to Search">
                              <InformationCircleIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </TooltipTag>
                          }
                          style={{
                            borderRadius: "0.375rem",
                            height: "38px",
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2 xxl:col-span-1">
                        <label
                          htmlFor="date-filter"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Eskalasi
                        </label>
                        <ReactSelect
                          id="escalatedRole"
                          instanceId={"escalatedRole"}
                          defaultValue={""}
                          options={escalatedGroupOptions}
                          isClearable
                          onChange={handleEscalatedRoleChange}
                          menuPortalTarget={portalTarget}
                        />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </section>
        {/* End of Filter Panel */}

        <Table columns={columns} data={props.data} ref={tableInstance} />

        {/* START -- place Modal component here */}
        <Modal
          show={solveModalIsOpen}
          onClose={setSolveModalIsOpen}
          size="medium"
        >
          <form key={2} onSubmit={handleSubmit2(handleCloseSubmit)}>
            <ModalBody>
              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <CheckCircleIcon
                    className="w-6 h-6 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
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
                  solveIsLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
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

        {/* Coba Modal Edit */}
        <Modal
          show={editModalIsOpen}
          onClose={setEditModalIsOpen}
          size="x-large"
        >
          <form key={3} onSubmit={handleSubmit3(OnEditSubmit)}>
            <ModalBody>
              <div className="sm:flex sm:items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-gray-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <PencilIcon
                    className="w-6 h-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit ticket
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-5">
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
                  editIsLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
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
                  // reset3(newEditDefaultValues);
                  setEditModalIsOpen(false);
                }}
              >
                Cancel
              </WhiteButton>
            </ModalFooter>
          </form>
        </Modal>

        {/* Coba Modal Assigne */}
        <Modal show={assignModalIsOpen} onClose={setAssignModalIsOpen}>
          <ModalBody>
            <div className="sm:flex sm:items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <UserAddIcon
                  className="w-6 h-6 text-blue-500"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
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
                assignIsLoading ? "disabled:opacity-50 cursor-not-allowed" : ""
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

        {/* Awal pagination */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="text-sm ">
              {/* Showing{" "} */}
              <div className="flex gap-x-1">
                <div>
                  <ReactSelect
                    id="perPage"
                    instanceId={"perPage"}
                    defaultValue={10}
                    options={perPageOptions}
                    placeholder="Shows"
                    className="ml-1 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={handleperPageChange}
                  />
                </div>
                <div className="mt-2 ml-2">
                  <span className="font-medium">Page {props.currentPage}</span>{" "}
                  to <span className="font-medium">{props.pageCount}</span> of{" "}
                  <span className="font-medium">{props.totalCount}</span>{" "}
                  results
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 mb-5">
            <ReactPaginate
              initialPage={props.currentPage - 1}
              pageCount={props.pageCount} //page count
              previousLabel={"Prev"}
              onPageChange={paginationHandler}
              containerClassName={
                "relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              }
              pageLinkClassName={
                "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              }
              previousLinkClassName={
                "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              }
              nextLinkClassName={
                "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              }
              breakLabel={"..."}
              breakLinkClassName={
                "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              }
              activeLinkClassName={
                "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
              }
            />
          </div>
        </div>
        {/* Akhir pagination */}
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tickets`);

  const page = query.page || 1;
  const perPage = query.perPage || "";
  const apps = query.idApps || "";
  const ticketType = query.idTicketType || "";
  const ticketStatus = query.ticketStatus || "";
  const createdAt = query.startCreatedAt || "";
  const closedAt = query.endCreatedAt || "";
  const id = query.id || "";
  const branchCode = query.branchCode || "";
  const escalatedRole = query.escalatedRole || "";
  const content = query.content || "";

  if (
    query.page ||
    query.perPage ||
    query.idApps ||
    query.idTicketType ||
    query.ticketStatus ||
    query.startCreatedAt ||
    query.endCreatedAt ||
    query.id ||
    query.branchCode ||
    query.escalatedRole ||
    query.content
  ) {
    url.searchParams.append("page", page);
    url.searchParams.append("perPage", perPage);
    url.searchParams.append("idApps", apps);
    url.searchParams.append("idTicketType", ticketType);
    url.searchParams.append("ticketStatus", ticketStatus);
    url.searchParams.append("startCreatedAt", createdAt);
    url.searchParams.append("endCreatedAt", closedAt);
    url.searchParams.append("id", id);
    url.searchParams.append("branchCode", branchCode);
    url.searchParams.append("escalatedRole", escalatedRole);
    url.searchParams.append("content", content);
  } else {
    url.searchParams.append("page", page);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: user,
        data: data.ticketData,
        totalCount: data.ticketPaging.totalData,
        pageCount: Math.ceil(
          data.ticketPaging.totalData / data.ticketPaging.perPage
        ),
        currentPage: data.ticketPaging.page,
        perPage: data.ticketPaging.perPage,
        isLoading: false,
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
        user: user,
        search: data.code,
        isLoading: false,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});
