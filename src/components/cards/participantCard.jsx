import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ParticipantCard = ({ props }) => {
  return (
    <>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 justify-items-stretch">
            <div className="justify-start">
              <p className="text-xl text-left">{props.player.name}</p>
            </div>
            <div>
              <Button variant="outline" className="justfiy-end">
                <X />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ParticipantCard;
