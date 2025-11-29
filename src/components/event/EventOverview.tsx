import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, IndianRupee, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EventOverviewProps {
  event: any;
  onUpdate: () => void;
}

export function EventOverview({ event, onUpdate }: EventOverviewProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Event Name</p>
              <p className="text-lg font-semibold">{event.event_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Event Type</p>
              <p className="text-lg font-semibold">{event.event_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Event Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold">
                  {format(new Date(event.event_date), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-success" />
                <p className="text-lg font-semibold">
                  {Number(event.budget_total).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-warm border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete an event, there is no going back. Please be certain.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  event and all associated data including expenses, gifts, and checklist items.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
