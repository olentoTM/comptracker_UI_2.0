import LeaderboardList from "../components/sessionLeaderboardList2";
import TournamentTable from "../components/tables/tournamentTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const SessionResults = () => {
  let { id } = useParams();
  let { state } = useLocation();
  const [sessionData, setSessionData] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  useEffect(() => {
    getSessionData();
  }, [id]);

  const getSessionData = async () => {
    const res = await fetch(`${serviceurl}/sessions/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).catch((err) => {
      console.error(err);
      setError(err);
    });

    const data = await res.json();

    console.log(data);
    setSessionData(data);
  };

  return (
    <>
      <div className="grid-col-1">
        <h1>Session results for {sessionData.map}</h1>
      </div>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-4">
          {Object.keys(sessionData).length != 0 ? (
            <LeaderboardList
              props={sessionData.results}
              score={sessionData.score}
              eventId={state.eventId}
            />
          ) : (
            <p>No Players</p>
          )}
        </div>
      </div>
    </>
  );
};
export default SessionResults;
