import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export function Footer2() {
  return (
    <footer className="w-full bg-[#FAF4E8] border-t border-[#E6D5BE]">
      <div className="
        max-w-screen-lg mx-auto px-4 
        flex flex-col items-center justify-center 
        gap-2 py-4
      ">

        {/* Icons Row */}
        <div className="flex items-center gap-4 text-neutral-700 leading-none">
          <Instagram className="h-4 w-4 hover:text-primary cursor-pointer transition" />
          <Facebook className="h-4 w-4 hover:text-primary cursor-pointer transition" />
          <Twitter className="h-4 w-4 hover:text-primary cursor-pointer transition" />
          <a
            href="mailto:support@eventplanner.in"
            className="flex items-center gap-1 hover:text-primary transition"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-neutral-600 leading-none">
          © {new Date().getFullYear()} Event & Gift Budget Planner
        </p>
      </div>
    </footer>
  );
}
