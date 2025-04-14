
interface UserSummaryProps {
  currentCount: number;
  filteredCount: number;
  totalCount: number;
  startIndex?: number;
  endIndex?: number;
}

export const UserSummary = ({
  currentCount,
  filteredCount,
  totalCount,
  startIndex = 0,
  endIndex = 0
}: UserSummaryProps) => {
  return (
    <div className="text-sm text-muted-foreground">
      {startIndex !== undefined && endIndex !== undefined ? (
        <>
          Showing {currentCount > 0 ? `${startIndex + 1}-${endIndex}` : "0"} of {filteredCount} users
          {totalCount !== filteredCount && ` (filtered from ${totalCount})`}
        </>
      ) : (
        <>
          Showing {currentCount} of {filteredCount} users
          {totalCount !== filteredCount && ` (filtered from ${totalCount})`}
        </>
      )}
    </div>
  );
};
