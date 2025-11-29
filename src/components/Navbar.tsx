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
    <nav className="relative bg-[#FAF4E8] border-b border-[#E6D5BE] shadow-sm">

      {/* Decorative top border line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#E6D5BE] via-[#D6C2A8] to-[#E6D5BE]"></div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Brand / Logo */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-2xl font-heading font-bold text-primary hover:text-primary/80 transition"
        >
          <img 
            src="/logogbp.png" 
            alt="Logo" 
            className="h-8 w-8 rounded shadow-sm"
          />
          <span className="tracking-wide">
            Event & Gift Budget Planner
          </span>
        </button>

        {/* Right – Profile Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-[#E6D5BE]/40 rounded-full"
              >
                <User className="h-5 w-5 text-neutral-800" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end"
              className="bg-[#FAF4E8] border-[#E6D5BE] shadow-md"
            >
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="hover:bg-[#E6D5BE]/30"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={signOut}
                className="hover:bg-[#E6D5BE]/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Decorative bottom line */}
      <div className="h-[2px] bg-[#E6D5BE]/60"></div>
    </nav>
  );
}
