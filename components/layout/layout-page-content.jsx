import clsx from "clsx";
import { Container } from "components/ui/container";

export const LayoutPageContent = ({ className, children, ...rest }) => {
  return (
    <div
      className={clsx("px-4 sm:px-6 md:px-8 pt-4 pb-6", className)}
      {...rest}
    >
      <Container>{children}</Container>
    </div>
  );
};

LayoutPageContent.displayName = "LayoutPageHeader";
