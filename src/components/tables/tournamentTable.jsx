import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import { TournamentTableItem } from "./tournamentTableItem";

const TournamentTable = ({ props }) => {
  console.log("These are the props: ", props);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Position</TableHead>
          <TableHead>Player Name</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.map((item, index) => (
          <TournamentTableItem
            key={index}
            position={item.position}
            name={item.player.name}
            points={item.points}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TournamentTable;
