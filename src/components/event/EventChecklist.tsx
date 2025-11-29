import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
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

interface ChecklistItem {
  id: string;
  title: string;
  is_completed: boolean;
}

interface EventChecklistProps {
  eventId: string;
  eventType: string;
}

const DEFAULT_CHECKLISTS: Record<string, string[]> = {
  Wedding: [
    'Book venue',
    'Send invitations',
    'Arrange catering',
    'Book photographer',
    'Arrange music/DJ',
    'Buy wedding attire',
    'Book accommodation for guests',
    'Arrange transportation',
    'Create guest list',
    'Order wedding cake'
  ],
  Birthday: [
    'Send invitations',
    'Order cake',
    'Arrange decorations',
    'Plan games/activities',
    'Arrange return gifts',
    'Book venue (if needed)',
    'Order food/catering',
    'Create playlist'
  ],
  Diwali: [
    'Clean and decorate home',
    'Buy diyas and candles',
    'Prepare sweets',
    'Buy new clothes',
    'Purchase gifts',
    'Arrange rangoli materials',
    'Buy crackers (if applicable)',
    'Invite friends and family'
  ],
  Holi: [
    'Buy colors (gulal)',
    'Arrange water balloons',
    'Prepare snacks',
    'Buy new white clothes',
    'Invite friends',
    'Arrange music system',
    'Stock up on drinks'
  ],
  Default: [
    'Create guest list',
    'Send invitations',
    'Arrange venue',
    'Order food/catering',
    'Arrange decorations',
    'Plan activities',
    'Purchase supplies'
  ]
};

export function EventChecklist({ eventId, eventType }: EventChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    loadChecklist();
  }, [eventId]);

  const loadChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // If no items exist, populate with defaults
      if (!data || data.length === 0) {
        await populateDefaultChecklist();
      } else {
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateDefaultChecklist = async () => {
    try {
      const defaultItems = DEFAULT_CHECKLISTS[eventType] || DEFAULT_CHECKLISTS.Default;
      const itemsToInsert = defaultItems.map(title => ({
        event_id: eventId,
        title,
        is_completed: false
      }));

      const { data, error } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert)
        .select();

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error populating checklist:', error);
    }
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('checklist_items')
        .update({ is_completed: !isCompleted })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === id ? { ...item, is_completed: !isCompleted } : item
      ));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update item');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .insert([
          {
            event_id: eventId,
            title: newItemTitle,
            is_completed: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Item added successfully!');
      setItems([...items, data]);
      setNewItemTitle('');
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Item deleted successfully');
      setItems(items.filter(item => item.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const completedCount = items.filter(item => item.is_completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className="shadow-warm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Checklist</CardTitle>
          <CardDescription>
            {completedCount} of {items.length} tasks completed ({progress.toFixed(0)}%)
          </CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Checklist Item</DialogTitle>
              <DialogDescription>
                Add a new task to your event checklist
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Book photographer"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  id={item.id}
                  checked={item.is_completed}
                  onCheckedChange={() => handleToggle(item.id, item.is_completed)}
                />
                <label
                  htmlFor={item.id}
                  className={`flex-1 cursor-pointer ${
                    item.is_completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {item.title}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
