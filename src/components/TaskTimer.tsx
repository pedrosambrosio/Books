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
        
        const formattedDuration = formatDuration(duration, {
          format: ['hours', 'minutes', 'seconds'],
          zero: true,
          delimiter: ':',
          padding: true
        });
        
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