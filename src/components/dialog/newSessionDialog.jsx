import { useState } from "react";
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
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from "react-router-dom";

const NewSessionDialog = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    new Date()
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(".", ":")
  );
  const [error, setError] = useState("");

  let { id } = useParams();
  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  const handleChange = (e, type) => {
    if (type == "location") {
      setLocation(e.target.value);
    } else if (type == "date") {
      setDate(e.target.value);
    } else if (type == "time") {
      setTime(e.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (location.length == 0) {
      setError("No name for event");
      alert("No name for event!");
    } else {
      const sessionDate = formDateTime();
      const res = await fetch(`${serviceurl}/sessions/create_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          map: location,
          date: sessionDate,
        }),
      }).catch((err) => {
        console.error(err);
        setError(err);
      });

      // const response = await res.json();
      if (res.status == 200) {
        window.location.reload();
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const formDateTime = () => {
    const finalDate = new Date(date);
    const hours = Number.parseInt(time.split(":")[0] || "00", 10);
    const minutes = Number.parseInt(time.split(":")[1] || "00", 10);
    return finalDate.setHours(hours, minutes, 0);
  };

  const datePicker = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add New
          <Plus className="size-full hover:text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new session to the tournament</DialogTitle>
          <DialogDescription>
            This will create a new session that will be added to the tournament.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="map" className="text-right">
              Location
            </Label>
            <Input
              id="name"
              placeholder="Track / map name here."
              className="col-span-3"
              onChange={(e) => handleChange(e, "location")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startdate" className="text-right">
              Date
            </Label>
            {datePicker()}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startdate" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={time}
              onChange={(e) => handleChange(e, "time")}
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

export default NewSessionDialog;
