import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SessionCard = ({ id, eventId, map, date, number }) => {
  const formattedDate = (date) => {
    const origDate = new Date(date);
    return origDate.toLocaleTimeString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24h clock is the only true clock in this application!
    });
  };

  return (
    <Card>
      <CardHeader>Session {number}</CardHeader>
      <CardContent>
        <CardTitle>{map}</CardTitle>
        <CardDescription>{formattedDate(date)}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={"/session/" + id} state={{ eventId: eventId }}>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
