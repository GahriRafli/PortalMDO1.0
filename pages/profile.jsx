import Head from "next/head";
import axios from "axios";
import withSession from "lib/session";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { classNames } from "components/utils";
import { Spinner } from "components/ui/svg/spinner";
import { IdentificationIcon } from "@heroicons/react/solid";

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
      user: req.session.get("user"),
    },
  };
});

export default function Profile() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await axios
      .patch(`/api/profile`, data)
      .then(function (response) {
        if (response.status === 200) {
          !isSubmitting && toast.success("Profile updated");
          router.push("/");
        } else {
          toast.error(`Failed to update: ${error.response.data.message}`);
        }
      })
      .catch(function (error) {
        // Error 😨
        toast.error(`${error}`);
      });
  };

  return (
    <>
      <Head>
        <title>Profile - Shield</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-12 w-auto"
            src="/shie"
            alt="Shield"
          /> */}
          <img
            className="mx-auto h-12 ml-36"
            src="/shield-logo-new-black.png"
            alt="Shield logo"
          />
          <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update your profile
          </h3>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="fullname"
                    {...register("fullname", { required: true })}
                    type="text"
                    placeholder="Please input your full name"
                    autoComplete="fullname"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <select
                  id="position"
                  name="position"
                  className="mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled selected hidden>
                    Select your position
                  </option>
                  <option>USA</option>
                  <option>Canada</option>
                  <option>EU</option>
                </select>
              </div>
            </div> */}

              <div>
                <button
                  type="submit"
                  className={classNames(
                    isSubmitting
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : "",
                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
