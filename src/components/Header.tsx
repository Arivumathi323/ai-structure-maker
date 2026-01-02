import { Sparkles, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="relative py-8">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Auth controls */}
      <div className="absolute top-4 right-0 flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="max-w-[150px] truncate">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        )}
      </div>

      <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
            <img
              src="/aarvan-tech-logo.png"
              alt="AARVAN TECH"
              className="w-full h-auto max-h-40 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient">Prompt</span>
            <span className="text-foreground">Organizer</span>
            <span className="text-primary">AI</span>
          </h1>
        </div>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Paste any prompt or JSON and let AI convert it into a clean, structured format instantly
        </p>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Auto-detect format
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Fix invalid JSON
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Smart restructure
          </div>
        </div>
      </div>
    </header>
  );
}
