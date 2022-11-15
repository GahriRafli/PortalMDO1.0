import clsx from "clsx";
import { Container } from "components/ui/container";

export const LayoutPageHeader = ({
  className,
  pageTitle,
  children,
  variant = "default",
  ...rest
}) => {
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
          {pageTitle && (
            <h1 className="text-2xl font-semibold text-gray-900 pt-5">
              {pageTitle}
            </h1>
          )}
          {children}
        </Container>
      </div>
    </>
  );
};

LayoutPageHeader.displayName = "LayoutPageHeader";
