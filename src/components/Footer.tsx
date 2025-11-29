import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-[#FAF4E8] border-t text-neutral-800 relative overflow-hidden">

      {/* Decorative Top Divider */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 text-[#E6D5BE]"
          fill="currentColor"
        >
          <path d="M0,96L1440,0L1440,0L0,0Z"></path>
        </svg>
      </div>

      {/* Subtle decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none pattern-grid"></div>

    <div className="relative container mx-auto px-6 py-1 grid grid-cols-1 md:grid-cols-3 gap-12">


        {/* Brand + Logo */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logogbp.png"
              alt="Indian Event & Gift Budget Planner Logo"
              className="h-12 w-12 rounded-md shadow-sm"
            />
            <h2 className="text-2xl font-heading font-bold tracking-wide">
            Event & Gift Budget Planner
            </h2>
          </div>

          <p className="text-neutral-700 leading-relaxed max-w-sm">
            A culturally inspired planner for weddings, festivals, rituals, 
            and every beautiful Indian celebration.
          </p>
        </div>

        {/* Decorative Art Section (Replacing Quick Links) */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg
              width="140"
              height="140"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary opacity-70"
            >
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
              <path
                d="M50 10 L58 35 L85 35 L62 52 L70 80 L50 62 L30 80 L38 52 L15 35 L42 35 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <p className="text-center text-sm text-neutral-600 mt-3 font-heading">
              {/* Inspired by Indian  
              <br />Mandala Art */}
            </p>
          </div>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4">Connect</h3>

          <div className="flex gap-6 mb-4">
            <Instagram className="h-6 w-6 hover:text-primary cursor-pointer" />
            <Facebook className="h-6 w-6 hover:text-primary cursor-pointer" />
            <Twitter className="h-6 w-6 hover:text-primary cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 text-neutral-700 hover:text-primary cursor-pointer">
            <Mail className="h-5 w-5" />
            <a href="mailto:support@eventplanner.in" className="font-medium">
              support@eventplanner.in
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Decorative Divider */}
      <div className="w-full overflow-hidden rotate-180 -mt-2">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 text-[#E6D5BE]"
          fill="currentColor"
        >
          <path d="M0,96L1440,0L1440,0L0,0Z"></path>
        </svg>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-5 text-sm bg-[#F1E8DA] border-t">
        © {new Date().getFullYear()}  Event & Gift Budget Planner
      </div>
    </footer>
  );
}
