import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LeadeboardListItem } from "./sessionLeaderboardListItem2";
import { Button } from "@/components/ui/button";

const LeaderboardList = ({ props, score, eventId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  let { id } = useParams();
  const serviceurl = import.meta.env.VITE_SERVICE_URL;
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  useEffect(() => {
    // Asetetaan Leaderboard vain jos siinä ei ole valmiiksi jo mitään.
    // Tietokantapäivityksen jälkeen täytyy muistaa tyhjentää Leaderboard useState.
    if (props.length != 0 && leaderboard.length == 0) {
      const sortedLeaderboard = props.sort((a, b) => {
        const playerA = a.position;
        const playerB = b.position;
        if (playerA == playerB) {
          return 0;
        }
        if (playerA == 0) {
          return 1;
        }
        if (playerB == 0) {
          return -1;
        }
        if (playerA < playerB) {
          return -1;
        }
        if (playerA > playerB) {
          return 1;
        }
      });
      setLeaderboard(sortedLeaderboard);
    }
  }, [props, leaderboard]);

  console.log(leaderboard);

  const changeDnf = (id) => {
    const lastPlace = Math.max(...leaderboard.map((p) => p.position));
    const updatedLb = leaderboard.map((lbItem) =>
      lbItem._id == id
        ? {
            ...lbItem,
            finished: !lbItem.finished,
            position: !lbItem.finished == true ? lastPlace + 1 : 0,
          }
        : lbItem
    );

    setLeaderboard(updatedLb);
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    const newLeaderboard = checkPoints();
    if (
      newLeaderboard.filter((item) => {
        return item.finished == true;
      }).length == 0
    ) {
      alert("At least 1 player has to finish the session.");
    } else {
      const res = await fetch(`${serviceurl}/sessions/update_results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId,
          sessionId: id,
          leaderboard: newLeaderboard,
        }),
      }).catch((err) => {
        console.error(err);
      });

      // const response = await res.json();
      if (res.status == 200) {
        window.location.reload();
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const checkPoints = () => {
    let p = props.length - 1;
    const modifiedList = leaderboard.map((item, index) => {
      if (item.position != index + 1 && item.finished != false) {
        return { ...item, position: index + 1 };
      } else {
        return item;
      }
    });

    const finalList = modifiedList.map((item) => {
      if (item.finished == true && p != 0) {
        const modded = { ...item, score: p };
        p--;
        return modded;
      } else {
        return { ...item, score: 0 };
      }
    });

    console.log("FINAL LIST: ", finalList);
    return finalList;
  };

  console.log("RENDER");

  return (
    <>
      {leaderboard.filter((item) => {
        return item.finished == true;
      }).length > 0 ? (
        <h2 className="text-start">Finished players:</h2>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={leaderboard}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Position</TableHead>
                <TableHead className="text-center">Player Name</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-right">Has finished?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard
                .filter((item) => {
                  return item.finished == true;
                })
                .map((id, index) => (
                  <LeadeboardListItem
                    key={index}
                    id={id}
                    index={index}
                    dnf={false}
                    changeDnf={() => changeDnf(id._id)}
                  />
                ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
      {leaderboard.filter((item) => {
        return item.finished == true;
      }).length > 0 ? (
        <h2 className="text-start">Have not finish:</h2>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Position</TableHead>
            <TableHead className="text-center">Player Name</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-right">Has finished?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard
            .filter((item) => {
              return item.finished == false;
            })
            .map((id, index) => (
              <LeadeboardListItem
                key={index}
                id={id}
                index={index}
                dnf={false}
                changeDnf={() => changeDnf(id._id)}
              />
            ))}
        </TableBody>
      </Table>
      <p>Score does not update until you have saved the changes</p>
      <Button
        onClick={(event) => {
          submitChanges(event);
        }}
      >
        Save Changes
      </Button>
    </>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.data.id !== over.id) {
      setLeaderboard((item) => {
        const oldIndex = item.indexOf(active.id);
        const newIndex = item.indexOf(over.id);

        return arrayMove(item, oldIndex, newIndex);
      });
    }
  }
};

export default LeaderboardList;
