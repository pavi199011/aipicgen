
interface UserSummaryProps {
  currentCount: number;
  filteredCount: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
}

export const UserSummary = ({
  currentCount,
  filteredCount,
  totalCount,
  startIndex,
  endIndex
}: UserSummaryProps) => {
  return (
    <div className="text-sm text-muted-foreground">
      Showing {currentCount > 0 ? `${startIndex + 1}-${endIndex}` : "0"} of {filteredCount} users
      {totalCount !== filteredCount && ` (filtered from ${totalCount})`}
    </div>
  );
};
