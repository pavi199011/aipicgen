
import { ReactNode } from "react";
import { Table } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserTableContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  className?: string;
  bordered?: boolean;
  isCompact?: boolean;
}

const UserTableContainer = ({
  children,
  title,
  description,
  headerContent,
  footerContent,
  isLoading = false,
  loadingRows = 3,
  className,
  bordered = true,
  isCompact = false,
}: UserTableContainerProps) => {
  // Generate loading skeleton rows
  const renderLoadingSkeleton = () => {
    return Array(loadingRows)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex items-center space-x-4 py-4">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[15%]" />
          <Skeleton className="h-4 w-[15%]" />
        </div>
      ));
  };

  // Card wrapper classes
  const cardClasses = cn(
    "overflow-hidden",
    bordered ? "border" : "border-0",
    isCompact ? "p-0" : "",
    className
  );

  return (
    <Card className={cardClasses}>
      {/* Render header if title, description or headerContent exists */}
      {(title || description || headerContent) && (
        <CardHeader className={isCompact ? "p-3 pb-0" : ""}>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {headerContent}
        </CardHeader>
      )}

      <CardContent className={isCompact ? "p-0" : "pt-0"}>
        {isLoading ? (
          <div className="p-4">{renderLoadingSkeleton()}</div>
        ) : (
          <div className={cn("rounded-md", bordered ? "border" : "")}>
            <Table>{children}</Table>
          </div>
        )}
      </CardContent>

      {/* Render footer if footerContent exists */}
      {footerContent && (
        <CardFooter className={isCompact ? "p-3 pt-0" : "pt-0"}>
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};

export default UserTableContainer;
