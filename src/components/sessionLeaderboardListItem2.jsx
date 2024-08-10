import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
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
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="font-medium">
        {props.id.finished == true ? props.index + 1 : "DNF"}
      </TableCell>
      <TableCell>{props.id.player.name}</TableCell>
      <TableCell>{props.id.score}</TableCell>
      <TableCell className="text-right">
        {" "}
        <Button variant="outline" onClick={() => props.changeDnf()}>
          <FontAwesomeIcon
            icon={props.id.finished == true ? faCheck : faXmark}
            color={props.id.finished == true ? "green" : "red"}
          />
        </Button>
      </TableCell>
      <TableCell>
        {props.id.finished == true ? (
          <Button
            variant="ghost"
            className="DragHandle justify-self-start"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <ArrowDownUp />
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
