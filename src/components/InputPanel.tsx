import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2 } from "lucide-react";

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onOrganize: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export function InputPanel({ value, onChange, onOrganize, onClear, isLoading }: InputPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">Input</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {value.length} chars
        </span>
      </div>
      
      <div className="relative flex-1 min-h-0">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your prompt, JSON, or plain text here..."
          className="h-full min-h-[300px] resize-none font-mono text-sm bg-input/50 border-border focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none rounded-b-lg" />
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          variant="glow"
          size="lg"
          onClick={onOrganize}
          disabled={!value.trim() || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Organize
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onClear}
          disabled={!value.trim() || isLoading}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
