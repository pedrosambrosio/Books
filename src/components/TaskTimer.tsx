import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";

interface TaskTimerProps {
  startDate: Date;
}

export const TaskTimer = ({ startDate }: TaskTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      if (!isPaused) {
        setTimeElapsed(formatDistanceStrict(startDate, new Date()));
      }
    };

    if (!isPaused) {
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setPausedTime(timeElapsed);
    }

    return () => clearInterval(interval);
  }, [startDate, isPaused]);

  return (
    <div className="text-sm text-muted-foreground font-medium">
      Time elapsed: {isPaused ? pausedTime : timeElapsed}
    </div>
  );
};