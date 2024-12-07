import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";

interface TaskTimerProps {
  startDate: Date;
}

export const TaskTimer = ({ startDate }: TaskTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      setTimeElapsed(formatDistanceStrict(startDate, new Date()));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="text-sm text-muted-foreground font-medium">
      Time elapsed: {timeElapsed}
    </div>
  );
};