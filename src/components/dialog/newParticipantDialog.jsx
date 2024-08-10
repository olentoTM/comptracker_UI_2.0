import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useParams } from "react-router-dom";

const NewParticipantDialog = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  let { id } = useParams();
  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username.length == 0) {
      setError("No name provided");
      alert("Please provide a name.");
    } else {
      const res = await fetch(`${serviceurl}/participants/create_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          playerName: username,
        }),
      }).catch((err) => {
        console.error(err);
        setError(err);
      });

      const response = await res.json();
      if (res.status == 200) {
        window.location.reload();
      } else {
        alert(response);
      }
    }
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new participant</DialogTitle>
          <DialogDescription>
            All that is needed is the name of the participant. If you already
            have sessions created, the new participant will be added
            automatically to all sessions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Name
            </Label>
            <Input
              id="username"
              placeholder="Name of the participant here."
              className="col-span-3"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={(e) => handleSubmit(e)}>Add to event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewParticipantDialog;
