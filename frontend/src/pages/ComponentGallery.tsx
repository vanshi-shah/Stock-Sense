import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SideBySideView } from "@/components/SideBySideView";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1.5">{title}</h3>
      <div className="flex flex-wrap gap-3 items-center">{children}</div>
    </div>
  );
}

const sampleUsers = [
  { name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { name: "Bob", email: "bob@example.com", role: "User", status: "Inactive" },
  { name: "Charlie", email: "charlie@example.com", role: "Editor", status: "Active" },
];

export function ComponentGallery() {
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [sideBySideMode, setSideBySideMode] = useState(true);

  // Renders the primitives section
  const renderPrimitives = () => (
    <div className="space-y-6">
      <Section title="Button Variants">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </Section>

      <Section title="Badge Variants">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </Section>

      <Section title="Avatar">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-accent text-accent-foreground font-semibold">MK</AvatarFallback>
        </Avatar>
      </Section>

      <Section title="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a dual-theme tooltip!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Active Subscription
              </CardTitle>
              <CardDescription>Pro Plan ($29/mo)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All components automatically render with semantic color variables.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                API Usage
              </CardTitle>
              <CardDescription>84% of monthly quota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%] rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Accordion">
        <div className="w-full max-w-md">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does dual-theme work?</AccordionTrigger>
              <AccordionContent>
                All styles use standard CSS custom properties (`hsl(var(--background))`, `hsl(var(--card))`, etc.) mapped to Tailwind utilities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it automatic for new components?</AccordionTrigger>
              <AccordionContent>
                Yes! Any component built with shadcn/ui or Tailwind semantic classes automatically renders perfectly in both light and dark themes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </div>
  );

  // Renders the forms section
  const renderForms = () => (
    <div className="space-y-6">
      <Section title="Inputs & Textareas">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          <Input placeholder="Type something..." />
          <Input placeholder="Disabled input" disabled />
          <div className="sm:col-span-2">
            <Textarea placeholder="Enter description..." rows={3} />
          </div>
        </div>
      </Section>

      <Section title="Select dropdown">
        <Select defaultValue="admin">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="user">Standard User</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
      </Section>

      <Section title="Switches & Checkboxes">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={checked}
              onCheckedChange={(val) => setChecked(!!val)}
            />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              Accept terms & conditions
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="toggle" />
            <label htmlFor="toggle" className="text-sm font-medium cursor-pointer">
              {switchOn ? "Notifications On" : "Notifications Off"}
            </label>
          </div>
        </div>
      </Section>

      <Section title="Modal Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Test Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                This modal automatically respects both light and dark backgrounds with proper contrast and backdrop blur.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="default">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  );

  // Renders the data display section
  const renderDataDisplay = () => (
    <div className="space-y-6">
      <Section title="Data Table">
        <div className="w-full rounded-md border border-border/80 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </div>
  );

  // Renders the feedback section
  const renderFeedback = () => (
    <div className="space-y-6">
      <Section title="Alerts">
        <div className="w-full space-y-3">
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Automatic Dual Theme Enabled
            </AlertTitle>
            <AlertDescription>
              Any changes made to components or pages automatically support both Light and Dark themes simultaneously.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>Destructive alerts maintain high visibility across themes.</AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Skeleton Loading">
        <div className="space-y-2.5 w-full max-w-sm">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </Section>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Banner & Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight">Component Gallery</h2>
            <Badge variant="secondary" className="gap-1 font-semibold">
              <Sparkles className="h-3 w-3 text-primary" /> Dual Theme
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Build once, automatically rendered in Light and Dark themes side-by-side.
          </p>
        </div>

        {/* Side-by-Side Toggle switch */}
        <div className="flex items-center gap-3 bg-muted/60 px-4 py-2 rounded-lg border border-border/60">
          <div className="text-right">
            <label htmlFor="sbs-toggle" className="text-xs font-semibold block cursor-pointer">
              Side-by-Side Dual View
            </label>
            <span className="text-[11px] text-muted-foreground">
              {sideBySideMode ? "Showing Light & Dark simultaneously" : "Showing single active theme"}
            </span>
          </div>
          <Switch
            id="sbs-toggle"
            checked={sideBySideMode}
            onCheckedChange={setSideBySideMode}
          />
        </div>
      </div>

      <Tabs defaultValue="primitives" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="primitives">Primitives</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* PRIMITIVES */}
        <TabsContent value="primitives" className="mt-6 space-y-6">
          {sideBySideMode ? (
            <SideBySideView
              title="Primitives Showcase"
              description="Buttons, badges, avatars, tooltips, cards, and accordions in Light & Dark modes."
            >
              {renderPrimitives()}
            </SideBySideView>
          ) : (
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
              {renderPrimitives()}
            </div>
          )}
        </TabsContent>

        {/* FORMS */}
        <TabsContent value="forms" className="mt-6 space-y-6">
          {sideBySideMode ? (
            <SideBySideView
              title="Form Controls"
              description="Inputs, selects, textareas, checkboxes, switches, and modal dialogs."
            >
              {renderForms()}
            </SideBySideView>
          ) : (
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
              {renderForms()}
            </div>
          )}
        </TabsContent>

        {/* DATA DISPLAY */}
        <TabsContent value="data" className="mt-6 space-y-6">
          {sideBySideMode ? (
            <SideBySideView
              title="Data Display & Tables"
              description="Tables, rows, and responsive data containers."
            >
              {renderDataDisplay()}
            </SideBySideView>
          ) : (
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
              {renderDataDisplay()}
            </div>
          )}
        </TabsContent>

        {/* FEEDBACK */}
        <TabsContent value="feedback" className="mt-6 space-y-6">
          {sideBySideMode ? (
            <SideBySideView
              title="Feedback & Loading States"
              description="Alert messages, skeleton loaders, and status badges."
            >
              {renderFeedback()}
            </SideBySideView>
          ) : (
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
              {renderFeedback()}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
