import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Users, StickyNote, Plus, AlertOctagon, Flag, Calendar } from "lucide-react";
import { Task } from "@/components/TaskCard";
import { Link } from "react-router-dom";

// Temporary mock data - replace with actual data fetching later
const mockUrgentTasks: Task[] = [
  {
    id: "1",
    title: "Complete Physics Assignment",
    description: "Chapter 4 exercises",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completed: false,
    inProgress: false,
    priority: "urgent"
  },
  {
    id: "2",
    title: "Math Project Submission",
    description: "Final review",
    startDate: new Date(),
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    completed: false,
    inProgress: false,
    priority: "moderate"
  }
];

const mockGroupUpdates = [
  {
    id: "1",
    message: "John added a file to Physics Project",
    timestamp: new Date(),
    groupId: "physics-101"
  },
  {
    id: "2",
    message: "Ana completed the 'Introduction' task",
    timestamp: new Date(),
    groupId: "history-202"
  }
];

const mockReminders = [
  {
    id: "1",
    text: "Study group meeting at 3 PM",
    date: new Date()
  },
  {
    id: "2",
    text: "Review calculus notes",
    date: new Date()
  }
];

const Dashboard = () => {
  const { toast } = useToast();

  const handleAddReminder = () => {
    toast({
      title: "Coming Soon",
      description: "Reminder creation will be available soon!",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "moderate":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Urgent Tasks Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUrgentTasks.map((task) => (
                <div key={task.id} className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {task.endDate?.toLocaleDateString()}
                      </div>
                    </div>
                    <Flag className={`h-5 w-5 ${getPriorityColor(task.priority || 'low')}`} />
                  </div>
                </div>
              ))}
              <Link to="/tasks" className="text-primary hover:underline text-sm block mt-4">
                View all tasks →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Group Updates Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Group Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGroupUpdates.map((update) => (
                <div key={update.id} className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <p className="text-sm">{update.message}</p>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {update.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Reminders Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Personal Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReminders.map((reminder) => (
                <div key={reminder.id} className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <p className="text-sm">{reminder.text}</p>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {reminder.date.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <Button
                onClick={handleAddReminder}
                variant="outline"
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;