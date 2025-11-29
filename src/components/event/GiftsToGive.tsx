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

interface GiftToGive {
  id: string;
  recipient_name: string;
  budget: number;
  gift_item: string | null;
  status: string;
}

interface GiftsToGiveProps {
  eventId: string;
}

export function GiftsToGive({ eventId }: GiftsToGiveProps) {
  const [gifts, setGifts] = useState<GiftToGive[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: '',
    budget: '',
    gift_item: ''
  });

  useEffect(() => {
    loadGifts();
  }, [eventId]);

  const loadGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts_to_give')
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
        .from('gifts_to_give')
        .insert([
          {
            event_id: eventId,
            recipient_name: formData.recipient_name,
            budget: parseFloat(formData.budget),
            gift_item: formData.gift_item || null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Gift added successfully!');
      setDialogOpen(false);
      setFormData({ recipient_name: '', budget: '', gift_item: '' });
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add gift');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'purchased' : 'pending';
      const { error } = await supabase
        .from('gifts_to_give')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Gift marked as ${newStatus}`);
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update gift');
    }
  };

  const handleDeleteGift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gifts_to_give')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Gift deleted successfully');
      loadGifts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gift');
    }
  };

  const totalBudget = gifts.reduce((sum, gift) => sum + Number(gift.budget), 0);
  const purchasedCount = gifts.filter(g => g.status === 'purchased').length;

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gifts To Give</CardTitle>
            <CardDescription>
              {purchasedCount} of {gifts.length} gifts purchased
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
                <DialogTitle>Add Gift To Give</DialogTitle>
                <DialogDescription>
                  Plan a gift for someone special
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGift}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_name">Recipient Name *</Label>
                    <Input
                      id="recipient_name"
                      placeholder="Enter recipient name"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₹) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gift_item">Gift Idea (optional)</Label>
                    <Input
                      id="gift_item"
                      placeholder="What do you plan to give?"
                      value={formData.gift_item}
                      onChange={(e) => setFormData({ ...formData, gift_item: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit">Add Gift</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {totalBudget.toLocaleString('en-IN')}
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
                    <p className="font-semibold">{gift.recipient_name}</p>
                    <Badge variant={gift.status === 'purchased' ? 'default' : 'secondary'}>
                      {gift.status}
                    </Badge>
                  </div>
                  {gift.gift_item && (
                    <p className="text-sm text-muted-foreground">{gift.gift_item}</p>
                  )}
                  <p className="text-sm font-semibold flex items-center mt-1">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {Number(gift.budget).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={gift.status === 'purchased' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleToggleStatus(gift.id, gift.status)}
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
                <p className="text-muted-foreground">No gifts added yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
