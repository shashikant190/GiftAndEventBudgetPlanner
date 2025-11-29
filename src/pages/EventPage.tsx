import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../lib/auth';
import { Navbar } from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { EventOverview } from '../components/event/EventOverview';
import { EventBudget } from '../components/event/EventBudget';
import { EventGifts } from '../components/event/EventGifts';
import { EventChecklist } from '../components/event/EventChecklist';

export default function EventPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && eventId) {
      loadEvent();
    }
  }, [user, eventId]);

  const loadEvent = async () => {
    if (!user?.id || !eventId) return; // TS FIX

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen pattern-mandala">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-4xl font-heading font-bold">{event.event_name}</h1>
          <p className="text-muted-foreground mt-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded">
              {event.event_type}
            </span>
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="gifts">Gifts</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <EventOverview event={event} onUpdate={loadEvent} />
          </TabsContent>

          <TabsContent value="budget">
            <EventBudget eventId={event.id} budgetTotal={event.budget_total} />
          </TabsContent>

          <TabsContent value="gifts">
            <EventGifts eventId={event.id} eventType={event.event_type} />
          </TabsContent>

          <TabsContent value="checklist">
            <EventChecklist eventId={event.id} eventType={event.event_type} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
