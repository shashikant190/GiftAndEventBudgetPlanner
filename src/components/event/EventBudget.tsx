import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Plus, IndianRupee, Trash2 } from 'lucide-react';
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

interface Expense {
  id: string;
  category: string;
  title: string;
  amount: number;
}

interface EventBudgetProps {
  eventId: string;
  budgetTotal: number;
}

export function EventBudget({ eventId, budgetTotal }: EventBudgetProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    amount: ''
  });

  useEffect(() => {
    loadExpenses();
  }, [eventId]);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([
          {
            event_id: eventId,
            category: formData.category,
            title: formData.title,
            amount: parseFloat(formData.amount)
          }
        ]);

      if (error) throw error;

      toast.success('Expense added successfully!');
      setDialogOpen(false);
      setFormData({ category: '', title: '', amount: '' });
      loadExpenses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Expense deleted successfully');
      loadExpenses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete expense');
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const progress = budgetTotal > 0 ? (totalSpent / Number(budgetTotal)) * 100 : 0;

  // Group expenses by category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Track your spending against the budget</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense for this event
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Venue, Catering, Decorations"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Wedding Hall Booking"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit">Add Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold flex items-center text-primary">
                <IndianRupee className="h-6 w-6 mr-1" />
                {totalSpent.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-3xl font-bold flex items-center justify-end">
                <IndianRupee className="h-6 w-6 mr-1" />
                {Number(budgetTotal).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className={progress > 100 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
              {progress.toFixed(1)}% of budget used
            </span>
            <span className={progress > 100 ? 'text-destructive font-semibold' : 'text-success'}>
              ₹{(Number(budgetTotal) - totalSpent).toLocaleString('en-IN')} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => {
        const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        return (
          <Card key={category} className="shadow-warm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{category}</CardTitle>
                <p className="text-lg font-semibold flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {categoryTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryExpenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{expense.title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {Number(expense.amount).toLocaleString('en-IN')}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {expenses.length === 0 && !loading && (
        <Card className="p-12 text-center shadow-warm">
          <IndianRupee className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No expenses yet</CardTitle>
          <CardDescription className="mb-6">
            Start tracking your event expenses
          </CardDescription>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Add First Expense
          </Button>
        </Card>
      )}
    </div>
  );
}
