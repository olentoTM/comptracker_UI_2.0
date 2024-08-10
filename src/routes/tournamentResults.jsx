import { useState, useEffect } from "react";
import SessionCard from "../components/cards/sessionCard";
import TournamentTable from "../components/tables/tournamentTable";
import ParticipantCard from "../components/cards/participantCard";
import { useParams } from "react-router-dom";
import NewSessionDialog from "../components/dialog/newSessionDialog";
import NewParticipantDialog from "../components/dialog/newParticipantDialog";

const TournamentResults = () => {
  let { id } = useParams();
  const [tournamentData, setTournamentData] = useState({});
  const [sessionData, setSessionData] = useState([]);
  const [error, setError] = useState("");

  const serviceurl = import.meta.env.VITE_SERVICE_URL;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch(`${serviceurl}/events/event_sessions/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).catch((err) => {
      console.error(err);
      setError(err);
    });

    const data = await res.json();

    console.log(data);
    setTournamentData(data);

    const sortedSessionData = data.sessions.sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    });

    setSessionData(sortedSessionData);
  };

  console.log("TOURNAMENT DATA: ", tournamentData);

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <h1 className="text-left col-span-2">Leaderboard</h1>
        <h1 className="text-left col-span-2">Tournament sessions</h1>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          {Object.keys(tournamentData).length !== 0 &&
          tournamentData.participants.length !== 0 ? (
            <TournamentTable props={tournamentData.participants} />
          ) : null}
          {Object.keys(tournamentData).length !== 0 &&
          tournamentData.participants.length !== 0 ? (
            <div>
              <h1 className="text-left">Participating Players</h1>
              {tournamentData.participants.map((item, index) => (
                <ParticipantCard key={index} props={item} />
              ))}
            </div>
          ) : (
            <div>
              <h1 className="text-center">No participants</h1>
              <p className="text-center">Add some now!</p>
            </div>
          )}
          <div>
            <NewParticipantDialog />
          </div>
        </div>
        <div className="col-span-4">
          {/* Uusi grid columnin sisällä. Tähän listataan yksittäiset eventit */}

          {Object.keys(sessionData).length !== 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {sessionData.map((item, index) => (
                <SessionCard
                  key={index}
                  id={item._id}
                  eventId={id}
                  map={item.map}
                  date={item.date}
                  number={index + 1}
                />
              ))}
            </div>
          ) : (
            <div>
              <h1 className="text-center">No sessions</h1>
              <p className="text-center">You should probably add some!</p>
            </div>
          )}
          <div>
            <NewSessionDialog />
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentResults;
