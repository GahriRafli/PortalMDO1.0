import Head from "next/head";
import Image from "next/image";
import loginPic from "public/cover-photo.jpg";
import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { classNames } from "components/utils";
import { Spinner } from "components/ui/svg/spinner";
import { FingerPrintIcon, KeyIcon } from "@heroicons/react/solid";

export default function Auth() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await fetchJson("/api/users/login", {
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
        <title>Portal MDO</title>
      </Head>
      <div className="min-h-screen bg-white flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-12 w-auto"
                src="/shield-logo.png"
                alt="Workflow"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    {errorMsg && (
                      <p className="mb-1 text-sm text-red-600">{errorMsg}</p>
                    )}
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FingerPrintIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="username"
                        {...register("username", { required: true })}
                        type="text"
                        placeholder="Personal Number"
                        autoComplete="username"
                        required
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="password"
                        {...register("password", { required: true })}
                        type="password"
                        placeholder="Bristars password if you have one"
                        autoComplete="password"
                        required
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Don't have a personal number?{" "}
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Register here
                      </a>
                    </div>
                  </div>

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
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={loginPic}
            layout="fill"
            placeholder="blur"
            alt="Login Cover Photo"
          />
        </div>
      </div>
    </>
  );
}
