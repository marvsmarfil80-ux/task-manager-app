import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <History className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Activity tracking isn&apos;t available yet — this needs an activity
          log added to the backend before this section can show real data.
        </p>
      </CardContent>
    </Card>
  );
}