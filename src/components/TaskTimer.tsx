import { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

interface TaskTimerProps {
  startDate: Date;
  isPaused: boolean;
}

export const TaskTimer = ({ startDate, isPaused }: TaskTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [pausedTime, setPausedTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      if (!isPaused) {
        const duration = intervalToDuration({
          start: startDate,
          end: new Date()
        });
        
        // Manually pad numbers and create the time string
        const hours = String(duration.hours || 0).padStart(2, '0');
        const minutes = String(duration.minutes || 0).padStart(2, '0');
        const seconds = String(duration.seconds || 0).padStart(2, '0');
        
        const formattedDuration = `${hours}:${minutes}:${seconds}`;
        
        setTimeElapsed(formattedDuration);
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