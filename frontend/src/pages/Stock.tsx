import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type StockItem = {
  id: string;
  product: string;
  cost: string;
  onHand: number;
  freeToUse: number;
};

export default function Stock() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [onHand, setOnHand] = useState("");
  const [freeToUse, setFreeToUse] = useState("");

  const filteredStocks = stocks.filter((s) => 
    s.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingId(null);
    setProductName("");
    setUnitCost("");
    setOnHand("");
    setFreeToUse("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (stock: StockItem) => {
    setEditingId(stock.id);
    setProductName(stock.product);
    setUnitCost(stock.cost);
    setOnHand(stock.onHand.toString());
    setFreeToUse(stock.freeToUse.toString());
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!productName || !unitCost || !onHand || !freeToUse) return;

    if (editingId) {
      setStocks(prev => prev.map(s => s.id === editingId ? {
        ...s,
        product: productName,
        cost: unitCost,
        onHand: parseInt(onHand),
        freeToUse: parseInt(freeToUse)
      } : s));
    } else {
      const newItem: StockItem = {
        id: Math.random().toString(36).substr(2, 9),
        product: productName,
        cost: unitCost,
        onHand: parseInt(onHand),
        freeToUse: parseInt(freeToUse)
      };
      setStocks(prev => [...prev, newItem]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-[32px] border-2 border-[#EAE6DE] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      
      {/* Header */}
      <div className="p-6 md:p-8 border-b-2 border-[#EAE6DE] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5F2EC]/30">
        <h1 className="text-3xl font-bold text-[#292B2A] font-['Outfit']">Stock</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#A66A4C]" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl border-[#EAE6DE] bg-white focus-visible:ring-[#A66A4C] focus-visible:ring-offset-0 focus-visible:border-[#A66A4C] transition-all"
            />
          </div>
          <Button 
            onClick={openAddDialog}
            className="h-11 px-5 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white font-medium transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Stock</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 bg-white">
        {stocks.length === 0 ? (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 text-[#73716C]">
            <div className="h-16 w-16 bg-[#F5F2EC] rounded-2xl flex items-center justify-center border-2 border-[#EAE6DE]">
              <Search className="h-8 w-8 text-[#A66A4C] opacity-50" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[#292B2A] font-['Outfit']">No stock items found</h3>
              <p className="text-sm">Get started by adding a new product to your inventory.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={openAddDialog}
              className="mt-2 rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] hover:border-[#A66A4C] hover:text-[#A66A4C] transition-colors"
            >
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-[#EAE6DE] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F5F2EC]/50">
                <TableRow className="border-b-2 border-[#EAE6DE] hover:bg-transparent">
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Product</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">per unit cost</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6 text-center">On hand</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6 text-center">Free to Use</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id} className="border-b border-[#EAE6DE] hover:bg-[#F5F2EC]/30 transition-colors">
                    <TableCell className="font-medium text-[#292B2A] py-4 px-6">{stock.product}</TableCell>
                    <TableCell className="text-[#73716C] py-4 px-6">{stock.cost}</TableCell>
                    <TableCell className="text-[#292B2A] py-4 px-6 text-center font-medium">{stock.onHand}</TableCell>
                    <TableCell className="text-[#A66A4C] py-4 px-6 text-center font-bold">{stock.freeToUse}</TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(stock)}
                        className="text-[#73716C] hover:text-[#A66A4C] hover:bg-[#A66A4C]/10 rounded-lg"
                      >
                        <Edit size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStocks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-[#73716C]">
                      No results match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-2 border-[#EAE6DE] bg-white gap-6">
          <DialogHeader>
            <DialogTitle className="font-['Outfit'] text-2xl text-[#292B2A]">
              {editingId ? "Update Stock" : "Add New Stock"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-5 py-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#292B2A] ml-1">Product Name</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] transition-all px-4"
                placeholder="e.g. Desk"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#292B2A] ml-1">Per Unit Cost</label>
              <Input
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] transition-all px-4"
                placeholder="e.g. 3000 Rs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#292B2A] ml-1">On Hand</label>
                <Input
                  type="number"
                  value={onHand}
                  onChange={(e) => setOnHand(e.target.value)}
                  className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] transition-all px-4"
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#292B2A] ml-1">Free to Use</label>
                <Input
                  type="number"
                  value={freeToUse}
                  onChange={(e) => setFreeToUse(e.target.value)}
                  className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] transition-all px-4"
                  placeholder="45"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="h-12 rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] hover:bg-[#F5F2EC] w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="h-12 rounded-xl bg-[#292B2A] hover:bg-[#A66A4C] text-white w-full sm:w-auto transition-all shadow-md"
            >
              {editingId ? "Save Changes" : "Add Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
