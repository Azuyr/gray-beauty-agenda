
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeSlotsProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlots = ({ selectedTime, onTimeSelect }: TimeSlotsProps) => {
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30"
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Clock className="h-5 w-5 mr-2" />
          Horários Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              size="sm"
              onClick={() => onTimeSelect(time)}
              className={`${
                selectedTime === time 
                  ? "bg-blue-600 border-blue-500 text-white" 
                  : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlots;
