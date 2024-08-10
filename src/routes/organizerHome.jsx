import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TournamentCard from "../components/tournamentCard";

const OrganizerHome = () => {
  const [tournamentList, setTournamentList] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  useEffect(() => {
    getTournaments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (tournamentName.length == 0) {
      setError("No name for tournament");
      alert("no name!");
    } else {
      const res = await fetch(`${serviceurl}/events/create_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: tournamentName,
          max_participants: maxParticipants,
        }),
      }).catch((err) => {
        console.error(err);
        setError(err);
      });

      const response = await res.json();
      if (res.status == 200) {
        navigate(`/tournament/${response._id}`);
      }
    }
  };

  const handleChange = (e, value) => {
    if (value == "mp") {
      setMaxParticipants(e.target.value);
    }
    if (value == "name") {
      setTournamentName(e.target.value);
    }
  };

  const getTournaments = async () => {
    const res = await fetch(`${serviceurl}/events/getall`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).catch((err) => {
      console.error(err);
      setError(err);
    });

    const data = await res.json();
    console.log(data);
    setTournamentList(data);
  };

  const newTournamentDialog = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Plus className="size-full hover:text-gray-400" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new tournament</DialogTitle>
            <DialogDescription>
              Create a new tournament with basic details. Participants,
              individual sessions and other details can be added or edited in
              the tournament page once it is created.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Tournament name goes here."
                className="col-span-3"
                onChange={(e) => handleChange(e, "name")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startdate" className="text-right">
                Maximum number of participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                defaultValue="10"
                min="2"
                step="1"
                className="col-span-3"
                onChange={(e) => handleChange(e, "mp")}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={(e) => handleSubmit(e)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div>
        <h1>Organizer Home</h1>
        <p>This page will include a list of tournament</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {Object.keys(tournamentList).length !== 0 ? (
          <>
            {tournamentList.map((item, index) => (
              <TournamentCard key={index} props={item} />
            ))}
          </>
        ) : null}
        <Card>
          <CardContent className="content-center">
            {newTournamentDialog()}
          </CardContent>
          <CardFooter className="content-center">
            <p className="text-center">Add new tournament</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default OrganizerHome;
