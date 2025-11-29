import { Button } from '../components/ui/button';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function Navbar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card shadow-warm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xl font-heading font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <Calendar className="h-6 w-6" />
          Event Planner
        </button>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
