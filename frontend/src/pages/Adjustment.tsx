import { useState } from "react";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Adjustment() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    // Form submission logic can be connected here
    console.log({ product, quantity, reason });
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
            <Input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Quantity:</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Reason:</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="pt-6 sm:pl-[152px]">
            <Button
              onClick={handleSave}
              className="h-12 px-8 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white font-medium transition-all shadow-md w-max"
            >
              Save Adjustment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
