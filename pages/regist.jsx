import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import fetchJson from "lib/fetchJson";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Spinner } from "components/ui/svg/spinner";
import clsx from "clsx";
import { CustomAlert } from "components/ui/alert";
import Modal from "react-modal";

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await fetchJson("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowSuccess(true); // Menampilkan pop-up berhasil
        console.log("berhasil register");
      }
    } catch (error) {
      setErrorMsg(`${error}`);
      console.log("gagal register");
    }
  };

  const handleOkClick = () => {
    setShowSuccess(false); // Menyembunyikan pop-up
    router.push("/auth"); // Mengarahkan ke halaman otentikasi
  };

  return (
    <>
      <Head>
        <title>Portal MDO</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-20 ml-40"
            src="/mdo_no_bg.png"
            alt="MDO logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register your account
          </h2>
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
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("username", {
                        required: "Username cannot be blank!",
                        pattern: {
                          value: /^\S*$/,
                          message: "Username cannot contain spaces.",
                        },
                      })}
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className={clsx(
                        "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                        errors.username && "border-red-500"
                      )}
                    />
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
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
                      required: "Password cannot be blank!",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
                        message:
                          "Password must contain at least 8 characters, including one uppercase letter, one number, and one special character.",
                      },
                    })}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    {...register("email", {
                      required: "Email cannot be blank!",
                    })}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <div className="mt-1">
                  <input
                    {...register("fullname", {
                      required: "Nama lengkap cannot be blank!",
                    })}
                    id="fullname"
                    name="fullname"
                    type="text"
                    autoComplete="fullname"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.fullname && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  Register
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Already have Personal Number{" "}
                <Link href="/auth">
                  <a className="hover:underline hover:text-blue-600">
                    Login here
                  </a>
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Copyright &#169; {new Date().getFullYear()} MDO - BRI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pop-up untuk registrasi berhasil */}
      {showSuccess && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Registration Successful
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your account has been successfully registered.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => setShowSuccess(false)}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
