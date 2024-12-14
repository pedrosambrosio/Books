import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = ({ className, fallback, alt, ...props }: ImageProps) => {
  const [error, setError] = useState(false);

  if (error && fallback) {
    return (
      <img
        {...props}
        src={fallback}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={cn("", className)}
      onError={() => setError(true)}
    />
  );
};

export default Image;