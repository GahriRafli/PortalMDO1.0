import Head from "next/head";
import Image from "next/image";
import loginPic from "public/shield-logo-new-black.png";
import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Spinner } from "components/ui/svg/spinner";
import clsx from "clsx";
import { CustomAlert } from "components/ui/alert";

export default function Auth() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await fetchJson("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        !isSubmitting;
        if (response.data.fullname === null) {
          router.push("/profile");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setErrorMsg(`${error.data.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Shield - Incident & Problem Management</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
          alt="Workflow"
        /> */}
          <img
            className="mx-auto h-12 ml-36"
            src="/shield-logo-new-black.png"
            alt="Shield logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              register if you don't have a personal number
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                {errorMsg && (
                  <CustomAlert
                    type="danger"
                    title="Something went wrong!"
                    className="mb-5"
                  >
                    <p>{errorMsg}</p>
                  </CustomAlert>
                )}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Personal Number / Username
                </label>
                <div className="mt-1">
                  <input
                    {...register("username", {
                      required: "Username can not be blank!",
                    })}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    {...register("password", {
                      required: "Password required!",
                    })}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={clsx(
                    isSubmitting
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : "",
                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Copyright &#169; {new Date().getFullYear()} APP - BRI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
