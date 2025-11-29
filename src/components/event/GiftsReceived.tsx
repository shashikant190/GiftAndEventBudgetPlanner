import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, IndianRupee, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GiftReceived {
  id: string;
  giver_name: string;
  gift_item: string;
  gift_value: number;
  return_status: string;
}

interface GiftsReceivedProps {
  eventId: string;
}

export function GiftsReceived({ eventId }: GiftsReceivedProps) {
  const [gifts, setGifts] = useState<GiftReceived[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    giver_name: '',
    gift_item: '',
    gift_value: ''
  });

  useEffect(() => {
    loadGifts();
  }, [eventId]);

  const loadGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts_received')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error loading gifts:', error);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('gifts_received')
        .insert([
          {
            event_id: eventId,
            giver_name: formData.giver_name,
            gift_item: formData.gift_item,
            gift_value: parseFloat(formData.gift_value),
            return_status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Gift recorded successfully!');
      setDialogOpen(false);
      setFormData({ giver_name: '', gift_item: '', gift_value: '' });
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record gift');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
      const { error } = await supabase
        .from('gifts_received')
        .update({ return_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Return gift marked as ${newStatus}`);
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update gift');
    }
  };

  const handleDeleteGift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gifts_received')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Gift deleted successfully');
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gift');
    }
  };

  const totalValue = gifts.reduce((sum, gift) => sum + Number(gift.gift_value), 0);
  const returnedCount = gifts.filter(g => g.return_status === 'done').length;

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gifts Received</CardTitle>
            <CardDescription>
              {returnedCount} of {gifts.length} return gifts sent
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Gift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Gift Received</DialogTitle>
                <DialogDescription>
                  Keep track of gifts you received
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGift}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="giver_name">Giver Name *</Label>
                    <Input
                      id="giver_name"
                      placeholder="Who gave this gift?"
                      value={formData.giver_name}
                      onChange={(e) => setFormData({ ...formData, giver_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gift_item">Gift Item *</Label>
                    <Input
                      id="gift_item"
                      placeholder="What did you receive?"
                      value={formData.gift_item}
                      onChange={(e) => setFormData({ ...formData, gift_item: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gift_value">Estimated Value (₹) *</Label>
                    <Input
                      id="gift_value"
                      type="number"
                      placeholder="Approximate value"
                      value={formData.gift_value}
                      onChange={(e) => setFormData({ ...formData, gift_value: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit">Record Gift</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {totalValue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="space-y-3">
            {gifts.map((gift) => (
              <div 
                key={gift.id} 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{gift.giver_name}</p>
                    <Badge variant={gift.return_status === 'done' ? 'default' : 'secondary'}>
                      Return: {gift.return_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gift.gift_item}</p>
                  <p className="text-sm font-semibold flex items-center mt-1">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {Number(gift.gift_value).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={gift.return_status === 'done' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleToggleStatus(gift.id, gift.return_status)}
                    title="Toggle return gift status"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGift(gift.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {gifts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No gifts received yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
