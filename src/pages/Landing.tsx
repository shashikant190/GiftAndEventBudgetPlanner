import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar, IndianRupee, Gift, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Event Planning',
      description: 'Plan weddings, festivals, birthdays, and more with ease'
    },
    {
      icon: IndianRupee,
      title: 'Budget Tracking',
      description: 'Track expenses and stay within your budget effortlessly'
    },
    {
      icon: Gift,
      title: 'Gift Management',
      description: 'Manage gifts to give and received with smart suggestions'
    },
    {
      icon: CheckCircle2,
      title: 'Smart Checklists',
      description: 'Pre-built checklists for every occasion to keep you organized'
    }
  ];

  return (
    <div className="min-h-screen pattern-mandala">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
            Plan Your Perfect Indian Celebration
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From weddings to festivals, manage budgets, track gifts, and organize every detail
            of your special events with our culturally-inspired planner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg font-heading"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
          Everything You Need for Perfect Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 shadow-warm hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="p-12 gradient-festive text-center shadow-warm">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust us to make their celebrations memorable
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-lg font-heading"
          >
            Create Your First Event
          </Button>
        </Card>
      </section>
    </div>
  );
}
