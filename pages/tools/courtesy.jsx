import {
  LayoutPage,
  LayoutPageContent,
  LayoutPageHeader,
} from "components/layout/index";
import { PrimaryButton, SecondaryButton } from "components/ui/button";
import { TextareaInput } from "components/ui/forms";
import Select from "react-select";
import withSession from "lib/session";
import { useState, useEffect } from "react";
import { getBroadcastRecipient, getCategoryBroadcast } from "lib/api-helper";
import { Empty, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import { styledReactSelect } from "components/utils";
import { Spinner } from "components/ui/svg/spinner";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ExclamationIcon } from "@heroicons/react/solid";

export default function Courtesy({ user }) {
  const defaultValues = {
    categoryName: null,
    broadcastType: null,
    broadcastMessage: "",
  };

  const { register, handleSubmit, formState, control, reset } = useForm({
    defaultValues: defaultValues,
  });
  const { errors, isSubmitting } = formState;

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    getCategoryBroadcast()
      .then((data) => {
        const optionList = data.data.map((d) => ({
          value: d.id,
          label: d.categoryName,
        }));
        setCategoryOptions(optionList);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  function handleCategoryChange(event) {
    if (!event) {
      setRecipient([]);
    } else {
      setIsLoading(true);
      getBroadcastRecipient(event.value)
        .then((data) => {
          setRecipient(data.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  }

  const onSubmit = async (data) => {
    await sleep(1000);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/broadcast/${data.categoryName.value}/courtesy`,
        {
          broadcastType: data.broadcastType.toUpperCase(),
          broadcastMessage: data.broadcastMessage,
        },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((res) => {
        reset(defaultValues);
        refreshData();
        toast.success("Message successfully sent.");
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
  };

  return (
    <LayoutPage session={user} pageTitle="Courtesy - Shield">
      <LayoutPageHeader variant="alternate" pageTitle="Courtesy" />
      <LayoutPageContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Card Start */}
              <div className="static overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                  <div className="grid grid-cols-6 gap-6">
                    {/* Card Content Start */}
                    <div className="col-span-3 sm:col-span-3">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <Controller
                        name="categoryName"
                        control={control}
                        rules={{
                          required: "This is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            instanceId="categoryName"
                            options={categoryOptions}
                            onChange={(event) => {
                              handleCategoryChange(event);
                              field.onChange(event);
                            }}
                            isClearable
                            styles={styledReactSelect}
                            className="text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      />
                      {errors.categoryName && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.categoryName.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-3 sm:col-span-3"></div>
                    <div className="col-span-6 flex">
                      <div className="flex items-center mr-4">
                        <input
                          {...register("broadcastType", {
                            required: "This is required!",
                          })}
                          type="radio"
                          value="new"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          New
                        </label>
                      </div>
                      <div className="flex items-center mr-4">
                        <input
                          {...register("broadcastType", {
                            required: "This is required!",
                          })}
                          type="radio"
                          value="update"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Update
                        </label>
                      </div>
                      {errors.broadcastType && (
                        <p className="text-sm text-red-600">
                          {errors.broadcastType.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-6 sm:col-span-6">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Messages
                      </label>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2 mb-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationIcon
                              className="h-5 w-5 text-yellow-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              You don't need to add headers and footers like{" "}
                              <span className="font-medium text-yellow-700 hover:text-yellow-600">
                                Yth. Bapak/Ibu, IT Command Center
                              </span>{" "}
                              and{" "}
                              <span className="font-medium text-yellow-700 hover:text-yellow-600">
                                Timestamp
                              </span>
                              . Let&apos;s make life easier dude! 🤙
                            </p>
                          </div>
                        </div>
                      </div>
                      <TextareaInput
                        {...register("broadcastMessage", {
                          required: "This is required!",
                        })}
                        placeholder="Write messages here..."
                        rows="9"
                      />
                      {errors.broadcastMessage && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.broadcastMessage.message}
                        </p>
                      )}
                    </div>
                    {/* Card Content End */}
                  </div>
                </div>

                {/* Card Footer Start */}
                <div className="px-4 py-3 space-x-2 text-right bg-gray-50 sm:px-6">
                  <PrimaryButton
                    type="submit"
                    className={
                      isSubmitting
                        ? "disabled:opacity-50 cursor-not-allowed"
                        : ""
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner /> Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </PrimaryButton>
                  <SecondaryButton
                    type="button"
                    onClick={() => reset(defaultValues)}
                  >
                    Reset
                  </SecondaryButton>
                </div>
                {/* Card Footer End */}
              </div>
              {/* Card End */}
            </form>
          </div>
          <div className="col-span-1">
            {/* Righ Section Start */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-3 py-3 sm:px-6 border-b border-gray-200">
                <h2
                  id="card-title"
                  className="text-base leading-6 font-medium text-gray-900"
                >
                  Broadcast Recipient
                </h2>
              </div>
              <Spin size="large" spinning={isLoading} tip="Loading...">
                <ul className="divide-y divide-gray-200">
                  {recipient.length ? (
                    recipient.map((recipient) => (
                      <li key={recipient.id}>
                        <div className="px-3 py-3 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-500 truncate">
                              {recipient.fullname}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {recipient.broadcastDestination}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </ul>
              </Spin>
            </div>
            {/* Righ Section End */}
          </div>
        </div>
      </LayoutPageContent>
    </LayoutPage>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permmanent: false,
      },
    };
  }

  return {
    props: {
      user: req.session.get("user"),
    },
  };
});
