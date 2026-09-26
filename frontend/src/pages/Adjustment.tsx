import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Settings, Save, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Adjustment() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('stocks').select('*');
    if (!error && data) {
      setProducts(data);
    }
  };

  const handleSave = async () => {
    if (!selectedProductId || !quantity) {
      toast.error('Please select a product and enter a quantity.');
      return;
    }

    setLoading(true);

    try {
      // Find current stock
      const product = products.find(p => p.id === selectedProductId);
      if (!product) throw new Error("Product not found");

      const adjustmentQty = parseInt(quantity);
      if (isNaN(adjustmentQty)) throw new Error("Invalid quantity");

      const newStock = (product.onHand || 0) + adjustmentQty;

      // Update stock
      const { error } = await supabase
        .from('stocks')
        .update({ onHand: newStock })
        .eq('id', selectedProductId);

      if (error) throw error;

      toast.success(`Successfully adjusted stock! New balance is ${newStock}.`);
      setQuantity("");
      setReason("");
      fetchProducts(); // Refresh
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to apply adjustment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pb-12">
      <div className="bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b-2 border-[#EAE6DE] bg-[#F5F2EC]/30 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#B7A58A] rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#292B2A] font-['Outfit']">Stock Adjustment</h1>
        </div>

        {/* Content - Direct Form */}
        <div className="p-6 md:p-12 flex flex-col max-w-2xl gap-8 relative">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Product:</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="h-12 rounded-xl border-2 border-[#EAE6DE] bg-[#F5F2EC]/50 focus:ring-[#A66A4C] focus:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full outline-none"
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.product} (Current: {p.onHand})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Adjustment Qty:</label>
            <div className="max-w-md w-full relative">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. -5 or 10"
                className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 w-full"
              />
              <p className="text-xs text-[#73716C] mt-2">Use negative numbers to decrease stock.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Reason:</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damage, Audit correction"
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="pt-6 sm:pl-[152px]">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="h-12 px-8 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white font-medium transition-all shadow-md w-max flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Adjustment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
