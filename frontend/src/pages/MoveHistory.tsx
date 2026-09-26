import { useState, useEffect } from "react";
import { Search, LayoutList, LayoutGrid, ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type MoveItem = {
  id: string;
  reference: string;
  date: string;
  contact: string;
  from: string;
  to: string;
  quantity: number;
  status: string;
  type: string;
  products: string;
};

export default function MoveHistory() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [search, setSearch] = useState("");
  const [moves, setMoves] = useState<MoveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_moves")
        .select(`
          id,
          quantity,
          timestamp,
          operations:operation_id (
            reference_document,
            status,
            type,
            created_by
          ),
          from_location:from_location_id ( name ),
          to_location:to_location_id ( name ),
          product:product_id ( name )
        `)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      if (data) {
        // Group by operation reference to combine multiple products? 
        // Based on UI prompt: "if single reference has multiple product display it in multiple rows".
        // So no grouping needed, just map rows.

        const formattedMoves: MoveItem[] = data.map((item: any) => ({
          id: item.id,
          reference: item.operations?.reference_document || "N/A",
          date: new Date(item.timestamp).toLocaleDateString(),
          contact: "N/A", // Not explicitly mapped in schema right now
          from: item.from_location?.name || "vendor",
          to: item.to_location?.name || "vendor",
          quantity: item.quantity,
          status: item.operations?.status || "done",
          type: item.operations?.type || "receipt",
          products: item.product?.name || "Unknown Product",
        }));

        setMoves(formattedMoves);
      }
    } catch (error) {
      console.error("Error fetching move history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMoves = moves.filter(
    (move) =>
      move.reference.toLowerCase().includes(search.toLowerCase()) ||
      move.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full pb-12">
      <div className="bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b-2 border-[#EAE6DE] bg-[#F5F2EC]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#B7A58A] rounded-xl flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#292B2A] font-['Outfit']">Move History</h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73716C]" />
              <Input
                placeholder="Search Delivery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-[#EAE6DE] bg-white focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C]"
              />
            </div>
            
            <div className="flex items-center bg-[#F5F2EC] rounded-xl p-1 border border-[#EAE6DE]">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-lg ${view === "list" ? "bg-white shadow-sm text-[#A66A4C]" : "text-[#73716C] hover:text-[#292B2A]"}`}
                onClick={() => setView("list")}
              >
                <LayoutList size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-lg ${view === "kanban" ? "bg-white shadow-sm text-[#A66A4C]" : "text-[#73716C] hover:text-[#292B2A]"}`}
                onClick={() => setView("kanban")}
              >
                <LayoutGrid size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A66A4C]"></div>
            </div>
          ) : filteredMoves.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#73716C]">
              <ArrowRightLeft className="h-12 w-12 mb-4 text-[#EAE6DE]" />
              <p className="text-lg font-medium">No move history found</p>
              <p className="text-sm">Wait for new stock movements or adjust your search.</p>
            </div>
          ) : view === "list" ? (
            <div className="overflow-x-auto rounded-xl border border-[#EAE6DE]">
              <table className="w-full text-sm text-left">
                <thead className="text-[13px] text-[#A66A4C] font-semibold bg-[#F5F2EC]/50 uppercase border-b border-[#EAE6DE]">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">From</th>
                    <th className="px-6 py-4">To</th>
                    <th className="px-6 py-4 text-right">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMoves.map((move) => {
                    // "In event should be display in green, Out moves should be display in red"
                    // type: 'receipt' -> In (green), type: 'delivery' -> Out (red), type: 'transfer' -> (default)
                    let textStyle = "text-[#292B2A]";
                    if (move.type === "receipt") textStyle = "text-emerald-600";
                    else if (move.type === "delivery") textStyle = "text-red-600";

                    return (
                      <tr key={move.id} className="border-b border-[#EAE6DE] last:border-0 hover:bg-[#F5F2EC]/30 transition-colors">
                        <td className={`px-6 py-4 font-medium ${textStyle}`}>{move.reference}</td>
                        <td className="px-6 py-4 text-[#73716C]">{move.date}</td>
                        <td className="px-6 py-4 font-medium text-[#A66A4C]">{move.contact}</td>
                        <td className="px-6 py-4 font-medium">{move.from}</td>
                        <td className="px-6 py-4 font-medium">{move.to}</td>
                        <td className="px-6 py-4 text-right font-medium">{move.quantity}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-[#F5F2EC] text-[#73716C]`}>
                            {move.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['draft', 'waiting', 'ready', 'done', 'canceled'].map((status) => {
                const statusMoves = filteredMoves.filter(m => m.status === status);
                if (statusMoves.length === 0) return null;
                
                return (
                  <div key={status} className="bg-[#F5F2EC]/30 rounded-2xl p-4 border border-[#EAE6DE] flex flex-col min-h-[200px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#292B2A] capitalize">{status}</h3>
                      <span className="bg-white text-[#73716C] text-xs font-medium px-2 py-1 rounded-lg border border-[#EAE6DE]">
                        {statusMoves.length}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                      {statusMoves.map((move) => {
                        let textStyle = "text-[#292B2A]";
                        if (move.type === "receipt") textStyle = "text-emerald-600";
                        else if (move.type === "delivery") textStyle = "text-red-600";

                        return (
                          <div key={move.id} className="bg-white p-3 rounded-xl border border-[#EAE6DE] shadow-sm">
                            <div className={`font-semibold mb-1 text-sm ${textStyle}`}>{move.reference}</div>
                            <div className="text-xs text-[#73716C] mb-2">{move.date}</div>
                            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[#EAE6DE]">
                              <span className="font-medium truncate max-w-[80px]">{move.from}</span>
                              <ArrowRightLeft size={12} className="text-[#A66A4C] mx-1 shrink-0" />
                              <span className="font-medium truncate max-w-[80px] text-right">{move.to}</span>
                            </div>
                            <div className="mt-2 text-xs font-medium bg-[#F5F2EC] w-max px-2 py-1 rounded-md">
                              Qty: {move.quantity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
