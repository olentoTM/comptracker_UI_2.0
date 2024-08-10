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
import { useEffect, useState } from "react";

import { LeadeboardListItem } from "./sessionLeaderboardListItem";
import { Button } from "@/components/ui/button";

const LeaderboardList = ({ props, score }) => {
  const [leaderboard, setLeaderboard] = useState([]);
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

  // const submitChanges = () => {
  //   let newLeaderboard;
  //   if (score != undefined || score != null) {
  //     //Tänne tietokantahaku
  //   } else {
  //     newLeaderboard = checkPoints();
  //   }
  //   //Tämän jälkeen leaderboard muutoset lähtee bäkkäriin
  // };

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
    // return finalList;
  };

  console.log("RENDER");

  return (
    <>
      <Button
        onClick={() => {
          checkPoints();
        }}
      >
        Save Changes
      </Button>
      {leaderboard.filter((item) => {
        return item.finished == true;
      }).length > 0 ? (
        <h2 className="text-start">Finished:</h2>
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
        </SortableContext>
      </DndContext>
      {leaderboard.filter((item) => {
        return item.finished == false;
      }).length > 0 ? (
        <h2 className="text-start">Unfinished:</h2>
      ) : null}
      <div>
        {leaderboard
          .filter((item) => {
            return item.finished == false;
          })
          .map((id, index) => (
            <LeadeboardListItem
              key={index}
              id={id}
              index={index}
              dnf={true}
              changeDnf={() => changeDnf(id._id)}
            />
          ))}
      </div>
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
