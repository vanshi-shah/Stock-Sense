import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Building2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WarehouseItem = {
  id: string;
  name: string;
  short_code: string;
  address: string;
};

export default function Warehouse() {
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [address, setAddress] = useState("");
  
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setWarehouses(data || []);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSave = async () => {
    if (!name || !shortCode || !address) return;

    try {
      const { error } = await supabase
        .from('warehouses')
        .insert([{ name, short_code: shortCode, address }]);

      if (error) throw error;

      // Reset form
      setName("");
      setShortCode("");
      setAddress("");
      
      // Refresh list
      fetchWarehouses();
      toast.success("Warehouse saved successfully");
    } catch (err: any) {
      console.error("Error saving warehouse:", err);
      toast.error(err.message || "Failed to save warehouse. Check if the table exists in Supabase.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
    try {
      const { error } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Warehouse deleted successfully");
      fetchWarehouses();
    } catch (err: any) {
      console.error("Error deleting:", err);
      toast.error(err.message || "Failed to delete warehouse");
    }
  };

  return (
    <div className="w-full pb-12 space-y-8">
      {/* Add Form Section */}
      <div className="bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 border-b-2 border-[#EAE6DE] bg-[#F5F2EC]/30 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#292B2A] rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#292B2A] font-['Outfit']">Warehouse</h1>
        </div>

        {/* Content - Direct Form */}
        <div className="p-6 md:p-12 flex flex-col max-w-2xl gap-8">
          
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
            <label className="text-[15px] font-semibold text-[#A66A4C] sm:w-32">Address:</label>
            <Input 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] text-[#292B2A] font-medium transition-all px-4 max-w-md w-full"
            />
          </div>
          
          <div className="pt-6 sm:pl-[152px]">
            <Button 
              onClick={handleSave}
              className="h-12 px-8 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white font-medium transition-all shadow-md w-max"
            >
              Save Warehouse
            </Button>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="p-6 md:p-8 bg-white">
          <h2 className="text-xl font-bold text-[#292B2A] font-['Outfit'] mb-6">Saved Warehouses</h2>
          
          {isLoading ? (
            <div className="text-center text-[#73716C] py-8 font-medium">Loading warehouses...</div>
          ) : warehouses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#73716C] py-12">
              <div className="h-16 w-16 bg-[#F5F2EC] rounded-2xl flex items-center justify-center border-2 border-[#EAE6DE]">
                <Building2 className="h-8 w-8 text-[#A66A4C] opacity-50" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#292B2A] font-['Outfit']">No warehouses defined</h3>
                <p className="text-sm">Use the form above to add your first warehouse to the database.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-[#EAE6DE] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F5F2EC]/50">
                  <TableRow className="border-b-2 border-[#EAE6DE] hover:bg-transparent">
                    <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Name</TableHead>
                    <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Short Code</TableHead>
                    <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Address</TableHead>
                    <TableHead className="font-semibold text-[#292B2A] py-4 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((wh) => (
                    <TableRow key={wh.id} className="border-b border-[#EAE6DE] hover:bg-[#F5F2EC]/30 transition-colors">
                      <TableCell className="font-medium text-[#292B2A] py-4 px-6">{wh.name}</TableCell>
                      <TableCell className="text-[#A66A4C] py-4 px-6 font-bold">{wh.short_code}</TableCell>
                      <TableCell className="text-[#73716C] py-4 px-6">{wh.address}</TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(wh.id)}
                          className="text-[#73716C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
