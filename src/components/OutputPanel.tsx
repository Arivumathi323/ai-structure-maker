import { Button } from "@/components/ui/button";
import { Copy, Download, FileJson, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OutputPanelProps {
  output: string;
  isLoading: boolean;
}

export function OutputPanel({ output, isLoading }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "organized-prompt.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "JSON file saved",
    });
  };

  const formatJSON = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Output</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={handleCopy}
            disabled={!output}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={handleDownload}
            disabled={!output}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 bg-input/30 rounded-lg border border-border overflow-hidden">
        {isLoading && !output && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-primary/20 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">AI is organizing...</p>
            </div>
          </div>
        )}
        
        {!output && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FileJson className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Structured output will appear here
              </p>
            </div>
          </div>
        )}

        {output && (
          <pre className="h-full overflow-auto p-4 text-sm font-mono text-foreground/90 whitespace-pre-wrap">
            <code>{formatJSON(output)}</code>
          </pre>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-input/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
