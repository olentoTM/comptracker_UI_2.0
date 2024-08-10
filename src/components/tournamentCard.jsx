import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ props }) => {
  const navigate = useNavigate();
  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  const checkDate = (date) => {
    if (date == null) {
      return "N/A";
    } else {
      const origDate = new Date(date);
      return origDate.toLocaleTimeString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  const deleteDialog = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once a tournament is deleted, all data regarding it will be
              removed from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteEvent();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const deleteEvent = async () => {
    const res = await fetch(`${serviceurl}/events/delete/${props._id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    }).catch((err) => {
      console.error(err);
    });

    const response = await res.json();
    if (res.status == 200) {
      window.location.reload();
    } else {
      alert("Deleting failed. Check console.");
      console.error(response);
    }
  };

  return (
    <Card>
      <CardHeader>{props.event_name}</CardHeader>
      <CardContent>
        <p>
          Participants: {props.participants.length} / {props.max_participants}
        </p>
        <p>Starts: {checkDate(props.start_date)}</p>
        <p>Ends: {checkDate(props.end_date)}</p>
      </CardContent>
      <CardFooter>
        <div className="grid grid-cols-2 gap-4">
          <div className="justify-self-start">{deleteDialog()}</div>
          <div className="justify-self-end">
            <Link to={"/tournament/" + props._id}>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
