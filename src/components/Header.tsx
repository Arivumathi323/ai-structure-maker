import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative py-8 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-xl border border-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
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
    </header>
  );
}
