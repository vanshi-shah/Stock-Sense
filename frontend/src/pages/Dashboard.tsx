import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, TrendingUp, AlertCircle, ArrowRight, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

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
                Welcome back. Monitor your inventory flow and warehouse capacity at a glance.
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
        
        {/* Primary Actions (Stock & Warehouse) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <button 
            onClick={() => navigate('/stock')}
            className="group flex flex-col justify-between h-48 md:h-56 p-8 bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm hover:border-[#A66A4C] hover:shadow-[0_8px_30px_rgb(166,106,76,0.15)] transition-all duration-300 text-left overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B7A58A]/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#B7A58A]/20" />
            <div className="h-14 w-14 rounded-2xl bg-[#292B2A] text-[#F5F2EC] flex items-center justify-center shadow-md relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
              <Package size={28} strokeWidth={1.5} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#292B2A] font-['Outfit'] mb-1">Stock Management</h2>
              <p className="text-[#73716C] font-medium flex items-center gap-2">
                View items & availability <ArrowRight size={16} className="text-[#A66A4C] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/warehouse')}
            className="group flex flex-col justify-between h-48 md:h-56 p-8 bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm hover:border-[#A66A4C] hover:shadow-[0_8px_30px_rgb(166,106,76,0.15)] transition-all duration-300 text-left overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A66A4C]/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#A66A4C]/20" />
            <div className="h-14 w-14 rounded-2xl bg-[#B7A58A] text-[#292B2A] flex items-center justify-center shadow-md relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
              <Warehouse size={28} strokeWidth={1.5} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#292B2A] font-['Outfit'] mb-1">Warehouse Locations</h2>
              <p className="text-[#73716C] font-medium flex items-center gap-2">
                Manage storage & capacity <ArrowRight size={16} className="text-[#A66A4C] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </p>
            </div>
          </button>

        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-semibold text-[#73716C] uppercase tracking-wider">Total Items</CardTitle>
              <Package className="h-5 w-5 text-[#B7A58A]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-4xl font-bold text-[#292B2A] font-['Outfit']">0</div>
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
              <div className="text-4xl font-bold text-[#A66A4C] font-['Outfit']">0</div>
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
              <div className="text-4xl font-bold text-[#292B2A] font-['Outfit']">0</div>
              <p className="text-[13px] font-medium text-[#73716C] mt-2">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Panel for Aesthetics (Recent Movements Placeholder) */}
        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DE] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#292B2A] font-['Outfit']">Recent Movements</h3>
            <Button variant="ghost" className="text-[#A66A4C] hover:text-[#292B2A] hover:bg-[#F5F2EC] font-semibold text-sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="h-10 w-10 text-[#EAE6DE] mb-3" strokeWidth={1.5} />
              <p className="text-[14px] font-medium text-[#73716C]">No recent movements to display</p>
              <p className="text-[12px] text-[#B7A58A] mt-1">Inventory transfers will appear here.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
