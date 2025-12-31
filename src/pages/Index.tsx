import { useState } from "react";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { useOrganizePrompt } from "@/hooks/useOrganizePrompt";

const Index = () => {
  const [input, setInput] = useState("");
  const { organize, isLoading, output, clearOutput } = useOrganizePrompt();

  const handleOrganize = () => {
    organize(input);
  };

  const handleClear = () => {
    setInput("");
    clearOutput();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        <main className="mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="glass-card rounded-2xl p-6 min-h-[500px]">
              <InputPanel
                value={input}
                onChange={setInput}
                onOrganize={handleOrganize}
                onClear={handleClear}
                isLoading={isLoading}
              />
            </div>

            {/* Output Panel */}
            <div className="glass-card rounded-2xl p-6 min-h-[500px]">
              <OutputPanel output={output} isLoading={isLoading} />
            </div>
          </div>

          {/* Features section */}
          <section className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Auto-Detect", desc: "Identifies JSON, prompts, or plain text automatically" },
              { title: "Fix Invalid", desc: "Repairs broken JSON and fills missing fields" },
              { title: "Restructure", desc: "Converts messy input into clean structure" },
              { title: "Export Ready", desc: "Copy or download your organized output" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
          <p>Powered by AI • Built with Lovable</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
