import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle, Activity, Info, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  // State to hold dynamic data
  const [stats, setStats] = useState({
    receipt: { pending: 0, late: 0, operations: 0 },
    delivery: { pending: 0, late: 0, waiting: 0, operations: 0 },
    overview: { totalItems: 0, lowStockAlerts: 0, recentActivity: 0 }
  });

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: stocksData, error: stocksError } = await supabase.from('stocks').select('*');
        if (stocksError) throw stocksError;
        
        let totalItems = 0;
        let lowStockAlerts = 0;
        const productsList: any[] = [];

        if (stocksData) {
          stocksData.forEach(item => {
            totalItems += (item.onHand || 0);
            if ((item.onHand || 0) < 10) lowStockAlerts++;
            
            productsList.push({
              name: item.product,
              stock: item.onHand || 0,
              trend: "N/A" // Real trend would require historical data
            });
          });

          // Sort by stock descending to get top products
          productsList.sort((a, b) => b.stock - a.stock);
          setTopProducts(productsList.slice(0, 5));
        }

        setStats(prev => ({
          ...prev,
          overview: {
            totalItems,
            lowStockAlerts,
            recentActivity: 0 // Placeholder until activity logs table exists
          }
        }));
        
        // Activity data is empty as we don't have historical operations yet
        setActivityData([]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
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
                {stats.overview.lowStockAlerts === 0 ? "All systems normal" : "Requires attention"}
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
                Operations this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & More Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Chart */}
          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
            <CardHeader className="bg-white pb-0">
              <CardTitle className="text-xl font-bold text-[#292B2A] font-['Outfit']">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="bg-white pt-6">
              <div className="h-[300px] w-full flex items-center justify-center bg-[#F5F2EC]/30 rounded-xl border border-[#EAE6DE] border-dashed">
                {activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE6DE" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#73716C', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73716C', fontSize: 12 }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        cursor={{ fill: '#F5F2EC' }}
                      />
                      <Bar dataKey="receipts" fill="#292B2A" radius={[4, 4, 0, 0]} name="Receipts" />
                      <Bar dataKey="deliveries" fill="#A66A4C" radius={[4, 4, 0, 0]} name="Deliveries" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-[#73716C] p-6">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="font-medium text-sm">Not enough data to display chart</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* More Info / Top Items */}
          <Card className="bg-white border-[#EAE6DE] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-white pb-4 border-b border-[#EAE6DE]">
              <CardTitle className="text-xl font-bold text-[#292B2A] font-['Outfit']">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-0 flex flex-col h-full">
              <div className="divide-y divide-[#EAE6DE] flex-1 overflow-y-auto max-h-[250px]">
                {topProducts.length > 0 ? (
                  topProducts.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#F5F2EC]/50 transition-colors">
                      <div>
                        <h4 className="text-[14px] font-bold text-[#292B2A]">{item.name}</h4>
                        <p className="text-[12px] text-[#73716C] mt-0.5">{item.stock} in stock</p>
                      </div>
                      <div className="text-[13px] font-bold text-[#73716C]">
                        {item.trend}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[#73716C] p-8">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="font-medium text-sm">No products found</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-[#F5F2EC]/30 border-t border-[#EAE6DE] flex justify-center mt-auto">
                <Button 
                  variant="ghost" 
                  className="text-[#A66A4C] hover:text-[#292B2A] hover:bg-transparent text-sm font-semibold h-auto p-0"
                  onClick={() => navigate('/products')}
                >
                  View full inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
