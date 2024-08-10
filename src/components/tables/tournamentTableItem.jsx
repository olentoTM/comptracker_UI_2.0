import { TableCell, TableRow } from "@/components/ui/table";

/* eslint-disable react/prop-types */
export const TournamentTableItem = ({ position, name, points }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{position}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell className="text-right">{points}</TableCell>
    </TableRow>
  );
};
