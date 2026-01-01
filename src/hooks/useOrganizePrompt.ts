import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ORGANIZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/organize-prompt`;

export function useOrganizePrompt() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveToHistory = async (input: string, output: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("prompt_history")
      .insert({ input, output, user_id: user.id });

    if (error) {
      console.error("Failed to save to history:", error);
    } else {
      setHistoryRefresh((prev) => prev + 1);
    }
  };

  const organize = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch(ORGANIZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("Usage limit reached. Please add credits to continue.");
        }
        throw new Error(errorData.error || "Failed to process input");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setOutput(fullContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setOutput(fullContent);
            }
          } catch {
            /* ignore */
          }
        }
      }

      // Clean up markdown code blocks if present
      let cleanOutput = fullContent;
      if (cleanOutput.startsWith("```json")) {
        cleanOutput = cleanOutput.slice(7);
      } else if (cleanOutput.startsWith("```")) {
        cleanOutput = cleanOutput.slice(3);
      }
      if (cleanOutput.endsWith("```")) {
        cleanOutput = cleanOutput.slice(0, -3);
      }
      const finalOutput = cleanOutput.trim();
      setOutput(finalOutput);

      // Save to history (only if user is logged in)
      if (user) {
        await saveToHistory(input, finalOutput);
      }

      toast({
        title: "Success!",
        description: user 
          ? "Your prompt has been organized and saved" 
          : "Your prompt has been organized (sign in to save history)",
      });
    } catch (error) {
      console.error("Error organizing prompt:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to organize prompt",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const clearOutput = useCallback(() => {
    setOutput("");
  }, []);

  const setOutputManually = useCallback((value: string) => {
    setOutput(value);
  }, []);

  return { organize, isLoading, output, clearOutput, setOutputManually, historyRefresh };
}
