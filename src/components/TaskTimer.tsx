import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

interface TaskTimerProps {
  startDate: Date;
  isPaused: boolean;
}

export const TaskTimer = ({ startDate, isPaused }: TaskTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [pausedTime, setPausedTime] = useState<string | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [lastPauseTime, setLastPauseTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      if (!isPaused) {
        const now = new Date();
        const baseTime = lastPauseTime ? accumulatedTime + (now.getTime() - startDate.getTime()) : now.getTime() - startDate.getTime();
        
        const duration = intervalToDuration({
          start: 0,
          end: baseTime
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
      if (lastPauseTime) {
        setAccumulatedTime(prev => prev + (new Date().getTime() - lastPauseTime.getTime()));
        setLastPauseTime(null);
      }
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setPausedTime(timeElapsed);
      setLastPauseTime(new Date());
    }

    return () => clearInterval(interval);
  }, [startDate, isPaused, lastPauseTime, accumulatedTime]);

  return (
    <div className="text-sm text-muted-foreground font-medium">
      Time elapsed: {isPaused ? pausedTime : timeElapsed}
    </div>
  );
};