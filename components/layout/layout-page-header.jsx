import Link from "next/link";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { Container } from "components/ui/container";
import { useRouter } from "next/router";

export const LayoutPageHeader = ({
  className,
  pageTitle,
  pageSubTitle,
  children,
  backButton = false,
  routerBack,
  href = "#",
  variant = "default",
  ...rest
}) => {
  const router = useRouter();
  const textHeading = (
    <>
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      {pageSubTitle && (
        <p className="mt-1 text-sm text-gray-500 overflow-hidden overflow-ellipsis">
          {pageSubTitle}
        </p>
      )}
    </>
  );

  return (
    <>
      <div
        className={clsx(
          "px-4 sm:px-6 md:px-8",
          variant === "default" && "bg-white shadow",
          className
        )}
        {...rest}
      >
        <Container>
          {variant === "alternate" ? (
            <div className="mt-5 pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
              <div className="flex flex-row space-x-4">
                {backButton && (
                  <div className="flex w-8 h-8 items-center justify-center">
                    <Link href={href}>
                      <a
                        aria-label="Kembali"
                        className="text-blue-500 hover:text-blue-700"
                        title="Kembali"
                      >
                        <ArrowCircleLeftIcon aria-hidden className="w-8 h-8" />
                      </a>
                    </Link>
                  </div>
                )}
                {routerBack && (
                  <div className="flex w-8 h-8 items-center justify-center">
                    <button
                      onClick={() => router.back()}
                      type="button"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ArrowCircleLeftIcon aria-hidden className="w-8 h-8" />
                    </button>
                  </div>
                )}
                <div>{textHeading}</div>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">{children}</div>
            </div>
          ) : (
            children
          )}
        </Container>
      </div>
    </>
  );
};

LayoutPageHeader.displayName = "LayoutPageHeader";
