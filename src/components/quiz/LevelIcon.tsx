import { Brain, Star, BookOpen, Lightbulb, Compass } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface LevelIconProps {
  level: 'mestre' | 'avancado' | 'intermediario' | 'iniciante' | 'explorador';
  className?: string;
}

const LEVEL_CONFIG = {
  mestre: {
    icon: Brain,
    color: "text-purple-500",
    description: "Você domina este capítulo"
  },
  avancado: {
    icon: Star,
    color: "text-yellow-500",
    description: "Conhecimento avançado do conteúdo"
  },
  intermediario: {
    icon: BookOpen,
    color: "text-blue-500",
    description: "Bom entendimento do material"
  },
  iniciante: {
    icon: Lightbulb,
    color: "text-green-500",
    description: "Começando a entender o conteúdo"
  },
  explorador: {
    icon: Compass,
    color: "text-gray-500",
    description: "Explorando o conteúdo"
  }
};

export function LevelIcon({ level, className }: LevelIconProps) {
  const config = LEVEL_CONFIG[level];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Icon className={cn("h-4 w-4", config.color, className)} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}