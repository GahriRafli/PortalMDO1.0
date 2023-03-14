import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { DefaultCard } from "components/ui/card/default-card";
import Table from "components/ui/table";
import { format } from "date-fns";
import withSession from "lib/session";
import { useMemo, useReducer, useState } from "react";
import { PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
// Sepaket modal component start
import { Modal } from "components/ui/modal/modal";
import { ModalBody } from "components/ui/modal/modal-body";
import { ModalFooter } from "components/ui/modal/modal-footer";
import { PrimaryButton, WhiteButton } from "components/ui/button";
import axios from "axios";
import { async } from "regenerator-runtime";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Impact({ user, data }) {
  // Table column variable
  const columns = useMemo(
    () => [
      {
        Header: "impact",
        accessor: "impact",
        disableSortBy: true,
      },
      {
        Header: "paramCategory",
        accessor: "paramCategory.category",
        disableSortBy: true,
      },
      {
        Header: "isActive",
        accessor: "isActive",
        disableSortBy: true,
      },
      {
        Header: "createdAt",
        accessor: "createdAt",
        Cell: (props) => format(new Date(props.value), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        Header: "",
        accessor: "id",
        disableSortBy: true,
        Cell: (props) => (
          <a
            href="#"
            onClick={() => handleBeforeEdit(props.value)}
            className="text-blue-500 hover:text-blue-900"
          >
            <PencilAltIcon className="h-3 w-3" />
          </a>
        ),
      },
    ],
    []
  );

  const [modal, updateModal] = useReducer(
    (data, partialData) => ({
      ...data,
      ...partialData,
    }),
    { add: false, edit: false }
  );

  async function getImpactById(id) {
    try {
      const response = await axios.get(`${API_URL}/parameters/${id}/impact`);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data} ${error.response.status}`);
      } else if (error.request) {
        toast.error(error.request);
      } else {
        toast.error("Error", error.message);
      }
      return error;
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: "onBlur" });

  const handleBeforeEdit = async (id) => {
    updateModal({ edit: true });
    const getValues = await getImpactById(id);
    setValue("impact", getValues.impact);
  };

  const OnEditSubmit = (data) => console.log(data);
  // console.log(errors);

  return (
    <LayoutPage session={user} pageTitle={"Parameters Impact - Shield"}>
      <LayoutPageHeader pageTitle={"Param Impact"} variant="alternate">
        <PrimaryButton onClick={() => updateModal({ add: true })}>
          Add Impact
        </PrimaryButton>
      </LayoutPageHeader>
      <LayoutPageContent>
        <DefaultCard>
          <Table columns={columns} data={data} initialPageSize={10} />
        </DefaultCard>

        <Modal show={modal.add} onClose={() => updateModal({ add: false })}>
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
                  Add Impact Parameters
                </h3>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal show={modal.edit} onClose={() => updateModal({ edit: false })}>
          <form key={2} onSubmit={handleSubmit(OnEditSubmit)}>
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
                    Edit Impact Parameters
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-5">
                <div className="col-span-2 sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Impact
                  </label>
                  <textarea
                    {...register("impact", {
                      required: "This is required",
                    })}
                    id="impact"
                    name="impact"
                    rows={3}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <PrimaryButton
                type="button"
                // className={"disabled:opacity-50 cursor-not-allowed"}
              >
                Submit
              </PrimaryButton>
              <WhiteButton
                type="button"
                className="mr-2"
                onClick={() => updateModal({ edit: false })}
              >
                Cancel
              </WhiteButton>
            </ModalFooter>
          </form>
        </Modal>
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permmanent: false,
      },
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/parameters/impact`
  );
  const data = await res.json();

  return {
    props: {
      user: req.session.get("user"),
      data: data.data,
    },
  };
});
