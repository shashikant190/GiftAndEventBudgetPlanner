import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

const EVENT_TYPES = [
  'Wedding',
  'Diwali',
  'Holi',
  'Birthday',
  'Rakhi',
  'Anniversary',
  'Housewarming',
  'Baby Shower',
  'Engagement',
  'Navratri',
  'Durga Puja',
  'Ganesh Chaturthi',
  'Custom'
];

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: '',
    event_date: '',
    budget_total: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            user_id: user.id,
            event_name: formData.event_name,
            event_type: formData.event_type,
            event_date: formData.event_date,
            budget_total: parseFloat(formData.budget_total)
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Event created successfully!');
      navigate(`/event/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pattern-mandala">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-3xl font-heading">Create New Event</CardTitle>
            <CardDescription>
              Set up your celebration with all the essential details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name *</Label>
                <Input
                  id="event_name"
                  placeholder="e.g., Rahul's Wedding, Diwali 2025"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_total">Total Budget (₹) *</Label>
                <Input
                  id="budget_total"
                  type="number"
                  placeholder="Enter your total budget"
                  value={formData.budget_total}
                  onChange={(e) => setFormData({ ...formData, budget_total: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
