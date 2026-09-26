import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Locations() {
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [warehouse, setWarehouse] = useState("");

  const handleSave = () => {
    // Form submission logic can be connected here
    console.log({ name, shortCode, warehouse });
  };

  return (
    <div className="w-full pb-12">
      <div className="bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b-2 border-[#EAE6DE] bg-[#F5F2EC]/30 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#B7A58A] rounded-xl flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#292B2A] font-['Outfit']">Location</h1>
        </div>

        {/* Content - Direct Form */}
        <div className="p-6 md:p-12 flex flex-col max-w-2xl gap-8 relative">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Name:</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Short Code:</label>
            <Input
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Warehouse:</label>
            <div className="flex items-center gap-3 max-w-md w-full">
              <Input
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4"
              />
              <span className="text-[#292B2A] font-semibold"></span>
            </div>
          </div>

          <div className="pt-6 sm:pl-[152px]">
            <p className="text-[14px] text-[#73716C] font-medium italic mb-6">

            </p>
            <Button
              onClick={handleSave}
              className="h-12 px-8 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white font-medium transition-all shadow-md w-max"
            >
              Save Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
