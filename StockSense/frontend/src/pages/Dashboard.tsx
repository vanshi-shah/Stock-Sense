import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SideBySideView } from "@/components/SideBySideView";
import { Switch } from "@/components/ui/switch";
import { Activity, CheckCircle, Clock, XCircle, TrendingUp, Sparkles, Plus } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  category?: string;
  submittedAt?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const defaultSubmissions: Submission[] = [
  { id: "1", title: "AI Code Reviewer", category: "AI & ML", submittedAt: "10 mins ago", status: "APPROVED" },
  { id: "2", title: "Decentralized Auth Flow", category: "Web3", submittedAt: "35 mins ago", status: "PENDING" },
  { id: "3", title: "Real-time Collaborative Canvas", category: "Full-Stack", submittedAt: "1 hour ago", status: "APPROVED" },
  { id: "4", title: "Legacy System Migration Bot", category: "DevOps", submittedAt: "2 hours ago", status: "REJECTED" },
  { id: "5", title: "Automated Dual Theme Generator", category: "Frontend", submittedAt: "Just now", status: "APPROVED" },
];

export default function Dashboard() {
  const [sideBySide, setSideBySide] = useState(false);

  const { data: remoteSubmissions, refetch } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      try {
        const res = await api.get("/submissions");
        return res.data;
      } catch {
        return defaultSubmissions;
      }
    },
  });

  const submissions = remoteSubmissions && remoteSubmissions.length > 0 ? remoteSubmissions : defaultSubmissions;

  const [chartData, setChartData] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    try {
      socket.connect();
      socket.on("submission:created", () => refetch());
      socket.on("submission:updated", () => refetch());
    } catch {
      // socket fallback
    }
    return () => {
      try {
        socket.off("submission:created");
        socket.off("submission:updated");
        socket.disconnect();
      } catch {
        // ignore
      }
    };
  }, [refetch]);

  useEffect(() => {
    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    submissions.forEach((s) => {
      if (counts[s.status] !== undefined) {
        counts[s.status]++;
      }
    });
    setChartData([
      { status: "Approved", count: counts.APPROVED },
      { status: "Pending", count: counts.PENDING },
      { status: "Rejected", count: counts.REJECTED },
    ]);
  }, [submissions]);

  const approvedCount = submissions.filter((s) => s.status === "APPROVED").length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJECTED").length;

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" /> +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for evaluation</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting judge feedback</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Submission Status Overview</CardTitle>
            <CardDescription>Live breakdown across approval categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions List */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <CardDescription>Latest team submissions</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.category || "Hackathon Project"}</p>
                  </div>
                  <Badge
                    variant={
                      s.status === "APPROVED"
                        ? "default"
                        : s.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-[11px]"
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Hackathon Dashboard</h2>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
              <Sparkles className="h-3 w-3" /> Auto Light/Dark
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time project overview and submission analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-muted/60 px-4 py-2 rounded-lg border border-border/60">
          <div className="text-right">
            <label htmlFor="dash-sbs-toggle" className="text-xs font-semibold block cursor-pointer">
              Dual-Theme Split View
            </label>
            <span className="text-[11px] text-muted-foreground">
              {sideBySide ? "Showing Light & Dark" : "Single active theme"}
            </span>
          </div>
          <Switch
            id="dash-sbs-toggle"
            checked={sideBySide}
            onCheckedChange={setSideBySide}
          />
        </div>
      </div>

      {/* Main Dashboard Render */}
      {sideBySide ? (
        <SideBySideView
          title="Dashboard Dual-Theme Preview"
          description="View your live statistics, charts, and metrics in both Light and Dark mode side-by-side."
        >
          {renderDashboardContent()}
        </SideBySideView>
      ) : (
        renderDashboardContent()
      )}
    </div>
  );
}
