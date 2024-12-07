import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

interface TaskTimerProps {
  startDate: Date;
  isPaused: boolean;
}

export const TaskTimer = ({ startDate, isPaused }: TaskTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [pausedTime, setPausedTime] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState(0);
  const [lastTickTime, setLastTickTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      if (!isPaused) {
        const now = new Date();
        if (lastTickTime) {
          setActiveTime(prev => prev + (now.getTime() - lastTickTime.getTime()));
        }
        setLastTickTime(now);
        
        const duration = intervalToDuration({
          start: 0,
          end: activeTime
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
      if (!lastTickTime) {
        setLastTickTime(new Date());
      }
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setPausedTime(timeElapsed);
      setLastTickTime(null);
    }

    return () => clearInterval(interval);
  }, [isPaused, activeTime, lastTickTime]);

  return (
    <div className="text-sm text-muted-foreground font-medium">
      Time elapsed: {isPaused ? pausedTime : timeElapsed}
    </div>
  );
};