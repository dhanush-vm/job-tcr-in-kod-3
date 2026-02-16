import { AppLayout } from "./components/layout/AppLayout";
import { ContextHeader } from "./components/layout/ContextHeader";
import { Button } from "./components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Copy, Terminal } from "lucide-react";

function App() {
  return (
    <AppLayout step={2} totalSteps={5} status="In Progress">
      <ContextHeader
        title="KodNest Premium Build System"
        description="A calm, coherent, and confident design system for serious B2C products."
      />

      <div className="mx-auto max-w-[1400px] px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Primary Workspace (70%) */}
          <div className="flex-1 space-y-8 lg:basis-[70%]">
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold">Primary Workspace</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Core Components</CardTitle>
                  <CardDescription>
                    These are the fundamental building blocks of the interface.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Input Field</label>
                    <Input placeholder="Enter your project name..." />
                  </div>

                  <div className="flex gap-4">
                    <Button>Primary Action</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Design Philosophy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    The design philosophy is calm, intentional, and coherent.
                    We avoid unnecessary noise, gradients, and flashy animations.
                    Everything serves a purpose.
                  </p>
                  <p>
                    Typography uses <strong>Lora</strong> for headings to convey confidence and
                    <strong> Inter</strong> for body text for readability.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Secondary Panel (30%) */}
          <aside className="space-y-6 lg:basis-[30%]">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl font-bold">Instructions</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Select a component from the workspace to edit its properties.
                Ensure all changes align with the design system guidelines.
              </p>

              <div className="space-y-4">
                <div className="relative rounded-md bg-muted p-4">
                  <code className="text-xs font-mono text-foreground">
                    npx shadcn@latest add button
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:bg-background"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" className="w-full text-xs">
                    Copy Code
                  </Button>
                  <Button variant="secondary" className="w-full text-xs">
                    Docs
                  </Button>
                </div>

                <Button className="w-full gap-2" variant="outline">
                  <Terminal className="h-4 w-4" />
                  Simulate Build
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-accent/50 p-6">
              <h4 className="mb-2 font-medium">Status</h4>
              <p className="text-sm text-muted-foreground">
                System is currently in <strong>Development</strong> mode.
                All components are isolated for testing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
