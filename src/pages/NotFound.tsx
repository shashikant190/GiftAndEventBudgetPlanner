import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer2 } from "@/components/Footer2";
import { Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col pattern-mandala">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md p-8 bg-white/70 backdrop-blur shadow-warm rounded-xl border border-primary/10">
          
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-primary drop-shadow-sm" />
          </div>

          <h1 className="text-5xl font-heading font-bold mb-3 text-primary">
            404
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            Looks like the page you're searching for got lost in the celebration.
          </p>

          <Button 
            size="lg" 
            onClick={() => (window.location.href = "/")}
            className="font-heading"
          >
            Return to Home
          </Button>
        </div>
      </main>

      <Footer2 />
    </div>
  );
};

export default NotFound;
