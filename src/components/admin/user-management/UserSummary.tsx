
import { Card, CardContent } from "@/components/ui/card";

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
  startIndex,
  endIndex
}: UserSummaryProps) => {
  return (
    <Card>
      <CardContent className="p-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-between items-center">
          <span>
            Showing <span className="font-medium">{currentCount}</span> {currentCount === 1 ? 'user' : 'users'}
            {startIndex !== undefined && endIndex !== undefined && (
              <> ({startIndex + 1}-{endIndex})</>
            )}
          </span>
          <span>
            {filteredCount} filtered from <span className="font-medium">{totalCount}</span> total {totalCount === 1 ? 'user' : 'users'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
