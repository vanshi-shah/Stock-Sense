import { useState, useEffect } from "react";
import { Plus, Search, LayoutGrid, List, ChevronRight } from "lucide-react";
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

export default function Deliveries() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [operations, setOperations] = useState<any[]>([]);
  
  // Form state
  const [reference, setReference] = useState("WH/OUT/0001");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [responsible, setResponsible] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [operationType, setOperationType] = useState("Delivery");
  const [status, setStatus] = useState("Draft");
  
  const [products, setProducts] = useState([{ id: 1, product: "", quantity: 0 }]);

  useEffect(() => {
    // Auto fill responsible
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setResponsible(data.user.email);
      }
    });
  }, []);

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Header Area */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-[#EAE6DE] shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setView('form')}
            className="bg-white border-2 border-[#EAE6DE] text-[#292B2A] hover:bg-[#F5F2EC] rounded-xl font-bold px-6"
          >
            NEW
          </Button>
          <h1 className="text-2xl font-bold text-[#A66A4C] font-['Outfit']">Delivery</h1>
        </div>
        
        {view === 'list' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73716C]" />
              <Input placeholder="Search..." className="pl-9 w-64 rounded-xl border-[#EAE6DE]" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-2 border-[#EAE6DE]">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-2 border-[#EAE6DE]">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-2xl border-2 border-[#EAE6DE] shadow-sm overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader className="bg-[#F5F2EC]/50">
              <TableRow className="border-b-2 border-[#EAE6DE]">
                <TableHead className="font-semibold text-[#292B2A]">Reference</TableHead>
                <TableHead className="font-semibold text-[#292B2A]">From</TableHead>
                <TableHead className="font-semibold text-[#292B2A]">To</TableHead>
                <TableHead className="font-semibold text-[#292B2A]">Contact</TableHead>
                <TableHead className="font-semibold text-[#292B2A]">Schedule date</TableHead>
                <TableHead className="font-semibold text-[#292B2A]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-[#EAE6DE] cursor-pointer hover:bg-[#F5F2EC]/30" onClick={() => setView('form')}>
                <TableCell className="text-[#A66A4C] font-semibold">WH/OUT/0001</TableCell>
                <TableCell>WH/Stock1</TableCell>
                <TableCell>vendor</TableCell>
                <TableCell>Azure Interior</TableCell>
                <TableCell>2026-10-01</TableCell>
                <TableCell>
                  <span className="text-blue-600 font-medium">Ready</span>
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-[#EAE6DE] cursor-pointer hover:bg-[#F5F2EC]/30" onClick={() => setView('form')}>
                <TableCell className="text-[#A66A4C] font-semibold">WH/OUT/0002</TableCell>
                <TableCell>WH/Stock1</TableCell>
                <TableCell>vendor</TableCell>
                <TableCell>Azure Interior</TableCell>
                <TableCell>2026-10-02</TableCell>
                <TableCell>
                  <span className="text-blue-600 font-medium">Ready</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-[#EAE6DE] shadow-sm flex flex-col min-h-[500px]">
          {/* Form Top Actions */}
          <div className="flex items-center justify-between p-4 border-b-2 border-[#EAE6DE]">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-2 border-[#EAE6DE] text-[#A66A4C] font-semibold hover:bg-[#F5F2EC]">Validate</Button>
              <Button variant="outline" className="rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] font-semibold hover:bg-[#F5F2EC]">Print</Button>
              <Button variant="outline" className="rounded-xl border-2 border-[#EAE6DE] text-[#73716C] font-semibold hover:bg-[#F5F2EC]" onClick={() => setView('list')}>Cancel</Button>
            </div>
            
            {/* Status Progress */}
            <div className="flex items-center text-sm font-semibold">
              <span className={`px-4 py-2 ${status === 'Draft' ? 'text-[#292B2A] bg-[#F5F2EC] rounded-l-xl' : 'text-[#73716C]'}`}>Draft</span>
              <ChevronRight className="h-4 w-4 text-[#EAE6DE]" />
              <span className={`px-4 py-2 ${status === 'Waiting' ? 'text-[#292B2A] bg-[#F5F2EC]' : 'text-[#73716C]'}`}>Waiting</span>
              <ChevronRight className="h-4 w-4 text-[#EAE6DE]" />
              <span className={`px-4 py-2 ${status === 'Ready' ? 'text-[#292B2A] bg-[#F5F2EC]' : 'text-[#73716C]'}`}>Ready</span>
              <ChevronRight className="h-4 w-4 text-[#EAE6DE]" />
              <span className={`px-4 py-2 ${status === 'Done' ? 'text-[#292B2A] bg-[#F5F2EC] rounded-r-xl' : 'text-[#73716C]'}`}>Done</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-[#A66A4C]">{reference}</h2>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#A66A4C] uppercase tracking-wider">Delivery Address</label>
                  <Input 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#A66A4C] text-[#292B2A] font-medium bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#A66A4C] uppercase tracking-wider">Responsible</label>
                  <Input 
                    value={responsible}
                    readOnly
                    className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 text-[#73716C] font-medium bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#A66A4C] uppercase tracking-wider">Schedule Date</label>
                  <Input 
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#A66A4C] text-[#292B2A] font-medium bg-transparent w-max"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#A66A4C] uppercase tracking-wider">Operation Type</label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#A66A4C] text-[#292B2A] font-medium bg-transparent outline-none h-10"
                  >
                    <option>Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Sub-table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#292B2A] mb-4">Products</h3>
              <div className="border-2 border-[#EAE6DE] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F5F2EC]/50">
                    <TableRow className="border-b-2 border-[#EAE6DE]">
                      <TableHead className="font-semibold text-[#A66A4C]">Product</TableHead>
                      <TableHead className="font-semibold text-[#A66A4C] w-48 text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p, idx) => (
                      <TableRow key={p.id} className="border-b border-[#EAE6DE]">
                        <TableCell>
                          <Input 
                            placeholder="e.g. [DESK001] Desk" 
                            className="border-0 bg-transparent focus-visible:ring-0 px-0 font-medium"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="border-0 bg-transparent focus-visible:ring-0 px-0 text-right font-medium"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-2 bg-[#F5F2EC]/30">
                  <Button 
                    variant="ghost" 
                    className="text-[#A66A4C] hover:text-[#A66A4C] hover:bg-[#EAE6DE] text-sm font-semibold"
                    onClick={() => setProducts([...products, { id: Date.now(), product: "", quantity: 0 }])}
                  >
                    + Add new product
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
