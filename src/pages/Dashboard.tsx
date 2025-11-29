import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { Navbar } from '../components/Navbar';

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  budget_total: number;
}

interface EventWithProgress extends Event {
  spent: number;
  progress: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user?.id) return; // TS FIX

    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id) // now always string
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      const eventsWithProgress = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { data: expenses } = await supabase
            .from('expenses')
            .select('amount')
            .eq('event_id', event.id);

          const spent = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
          const progress = event.budget_total > 0 ? (spent / Number(event.budget_total)) * 100 : 0;

          return {
            ...event,
            spent,
            progress: Math.min(progress, 100)
          };
        })
      );

      setEvents(eventsWithProgress);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date());
  const totalBudget = events.reduce((sum, e) => sum + Number(e.budget_total), 0);

  return (
    <div className="min-h-screen pattern-mandala">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your events and celebrations</p>
          </div>
          <Button onClick={() => navigate('/create-event')} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-lg">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{events.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-success">{upcomingEvents.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-lg">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-secondary flex items-center">
                <IndianRupee className="h-8 w-8 mr-1" />
                {totalBudget.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">Your Events</h2>
          {loading ? (
            <Card className="p-8 text-center shadow-warm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            </Card>
          ) : events.length === 0 ? (
            <Card className="p-12 text-center shadow-warm">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No events yet</CardTitle>
              <CardDescription className="mb-6">
                Create your first event to start planning your celebration
              </CardDescription>
              <Button onClick={() => navigate('/create-event')}>
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Event
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow shadow-warm"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{event.event_name}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                            {event.event_type}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(event.event_date), 'MMMM dd, yyyy')}
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Budget Used</span>
                        <span className="font-semibold">
                          ₹{event.spent.toLocaleString('en-IN')} / ₹{Number(event.budget_total).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Progress 
                        value={event.progress} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.progress.toFixed(0)}% spent
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
