import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDownUp, Check, X } from "lucide-react";

/* eslint-disable react/prop-types */
export function LeadeboardListItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card className="h-44" ref={setNodeRef} style={style}>
      <CardHeader>
        <CardTitle>
          {(props.id.finished == true ? props.index + 1 : "DNF") +
            ": " +
            props.id.player.name}
        </CardTitle>
        <CardContent>
          {"Finished:   "}
          <Button variant="outline" onClick={() => props.changeDnf()}>
            <FontAwesomeIcon
              icon={props.id.finished == true ? faCheck : faXmark}
              color={props.id.finished == true ? "green" : "red"}
            />
          </Button>
        </CardContent>
        <CardFooter>
          {props.id.finished == true ? (
            <Button
              className="DragHandle justify-self-start"
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
            >
              <ArrowDownUp />
            </Button>
          ) : null}
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
