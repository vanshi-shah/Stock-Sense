import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle, Activity, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  // State to hold dynamic data instead of hardcoded values
  const [stats, setStats] = useState({
    receipt: { pending: 0, late: 0, operations: 0 },
    delivery: { pending: 0, late: 0, waiting: 0, operations: 0 },
    overview: { totalItems: 0, lowStockAlerts: 0, recentActivity: 0 }
  });

  useEffect(() => {
    // TODO: Replace with real data fetching hook when backend is ready
    // Example: fetchDashboardStats().then(data => setStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EC] font-['Inter'] selection:bg-[#B7A58A] selection:text-white pb-12">
      
      {/* Top Header / Welcome Section */}
      <div className="bg-[#292B2A] px-6 py-12 md:py-20 rounded-b-[48px] shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A66A4C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#B7A58A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/4 translate-y-1/4" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#F5F2EC] font-['Outfit'] tracking-tight mb-3">
                Overview
              </h1>
              <p className="text-[#B7A58A] text-lg font-medium max-w-lg">
                Monitor your operations, receipts, and deliveries at a glance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[#F5F2EC]/80 text-sm font-medium tracking-wide uppercase">System Healthy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Operations: Receipt & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Receipt Card */}
          <div className="bg-white rounded-[32px] p-8 border-2 border-[#EAE6DE] shadow-sm hover:border-[#A66A4C] hover:shadow-[0_8px_30px_rgb(166,106,76,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col gap-6">
            <h2 className="text-[28px] font-bold text-[#292B2A] font-['Outfit']">Receipt</h2>
            
            <div className="flex items-center gap-8 mt-2">
              <Button 
                onClick={() => navigate('/operations/receipt')}
                className="h-14 px-8 rounded-xl bg-white border-2 border-[#A66A4C] text-[#A66A4C] hover:bg-[#A66A4C] hover:text-white font-semibold text-lg transition-all shadow-sm"
              >
                {stats.receipt.pending} to receive
              </Button>
              
              <div className="flex flex-col text-[15px] font-medium text-[#73716C] gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#A66A4C] font-bold w-4">{stats.receipt.late}</span> Late
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#292B2A] font-bold w-4">{stats.receipt.operations}</span> operations
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-white rounded-[32px] p-8 border-2 border-[#EAE6DE] shadow-sm hover:border-[#A66A4C] hover:shadow-[0_8px_30px_rgb(166,106,76,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col gap-6">
            <h2 className="text-[28px] font-bold text-[#292B2A] font-['Outfit']">Delivery</h2>
            
            <div className="flex items-center gap-8 mt-2">
              <Button 
                onClick={() => navigate('/operations/delivery')}
                className="h-14 px-8 rounded-xl bg-white border-2 border-[#A66A4C] text-[#A66A4C] hover:bg-[#A66A4C] hover:text-white font-semibold text-lg transition-all shadow-sm"
              >
                {stats.delivery.pending} to Deliver
              </Button>
              
              <div className="flex flex-col text-[15px] font-medium text-[#73716C] gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#A66A4C] font-bold w-4">{stats.delivery.late}</span> Late
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#B7A58A] font-bold w-4">{stats.delivery.waiting}</span> waiting
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#292B2A] font-bold w-4">{stats.delivery.operations}</span> operations
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legend / Info */}
        <div className="flex items-start gap-2 bg-[#EAE6DE]/50 p-4 rounded-xl border border-[#EAE6DE]">
          <Info className="h-5 w-5 text-[#A66A4C] shrink-0 mt-0.5" />
          <div className="text-[13px] font-medium text-[#73716C] space-y-1">
            <p><span className="text-[#292B2A] font-semibold">Late:</span> schedule date &lt; today's date</p>
            <p><span className="text-[#292B2A] font-semibold">Operations:</span> schedule date &gt; today's date</p>
            <p><span className="text-[#292B2A] font-semibold">Waiting:</span> Waiting for the stocks</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-semibold text-[#73716C] uppercase tracking-wider">Total Items</CardTitle>
              <Package className="h-5 w-5 text-[#B7A58A]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-4xl font-bold text-[#292B2A] font-['Outfit']">{stats.overview.totalItems}</div>
              <p className="text-[13px] font-medium text-[#73716C] mt-2 flex items-center gap-1.5">
                No data available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-semibold text-[#73716C] uppercase tracking-wider">Low Stock Alerts</CardTitle>
              <AlertCircle className="h-5 w-5 text-[#A66A4C]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-4xl font-bold text-[#A66A4C] font-['Outfit']">{stats.overview.lowStockAlerts}</div>
              <p className="text-[13px] font-medium text-[#73716C] mt-2 flex items-center gap-1.5">
                All systems normal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-semibold text-[#73716C] uppercase tracking-wider">Recent Activity</CardTitle>
              <Activity className="h-5 w-5 text-[#292B2A]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-4xl font-bold text-[#292B2A] font-['Outfit']">{stats.overview.recentActivity}</div>
              <p className="text-[13px] font-medium text-[#73716C] mt-2">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
