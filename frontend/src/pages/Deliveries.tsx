import { useState, useEffect, useCallback } from "react";
import { Search, List, LayoutGrid, ChevronRight, Loader2, Printer, CheckCircle2, XCircle, Plus } from "lucide-react";
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

type OperationStatus = "draft" | "waiting" | "ready" | "done" | "canceled";

type DeliveryRecord = {
  id: string;
  reference_document: string;
  status: OperationStatus;
  contact: string | null;
  responsible: string | null;
  schedule_date: string | null;
  created_at: string;
};

type ProductLine = {
  lineId: number;
  product_id: string;
  productName: string;
  quantity: number;
  outOfStock?: boolean;
};

type ProductOption = { id: string; name: string; sku: string };

const STATUS_STEPS: OperationStatus[] = ["draft", "waiting", "ready", "done"];

const STATUS_COLORS: Record<OperationStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  waiting: "bg-yellow-100 text-yellow-700",
  ready: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
};

export default function Deliveries() {
  const [view, setView] = useState<"list" | "form">("list");
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [responsible, setResponsible] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [operationType] = useState("Delivery");
  const [status, setStatus] = useState<OperationStatus>("draft");
  const [products, setProducts] = useState<ProductLine[]>([
    { lineId: Date.now(), product_id: "", productName: "", quantity: 1 },
  ]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stockAlert, setStockAlert] = useState("");

  // ── Fetch deliveries ─────────────────────────────────────────────────────────
  const fetchDeliveries = useCallback(async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("operations")
      .select("id, reference_document, status, contact, responsible, schedule_date, created_at")
      .eq("type", "delivery")
      .order("created_at", { ascending: false });
    if (!error) setDeliveries(data as DeliveryRecord[]);
    setLoadingList(false);
  }, []);

  // ── Fetch product options ────────────────────────────────────────────────────
  const fetchProductOptions = useCallback(async () => {
    const { data } = await supabase.from("products").select("id, name, sku");
    if (data) setProductOptions(data as ProductOption[]);
  }, []);

  useEffect(() => {
    fetchDeliveries();
    fetchProductOptions();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setResponsible(data.user.email);
    });
  }, [fetchDeliveries, fetchProductOptions]);

  // ── Stock check: mark lines red if out of stock ──────────────────────────────
  const checkStock = async (lines: ProductLine[]) => {
    let alert = "";
    const updated = await Promise.all(
      lines.map(async line => {
        if (!line.product_id) return line;
        const { data } = await supabase
          .from("stock_quantities")
          .select("quantity")
          .eq("product_id", line.product_id)
          .maybeSingle();
        const available = data?.quantity ?? 0;
        const outOfStock = available < line.quantity;
        if (outOfStock) alert = `Some products have insufficient stock.`;
        return { ...line, outOfStock };
      })
    );
    setProducts(updated);
    setStockAlert(alert);
  };

  // ── Open new form ────────────────────────────────────────────────────────────
  const openNewForm = async () => {
    const { data } = await supabase.rpc("next_delivery_ref");
    setCurrentId(null);
    setReference(data ?? `WH/OUT/NEW`);
    setDeliveryAddress("");
    setScheduleDate("");
    setStatus("draft");
    setProducts([{ lineId: Date.now(), product_id: "", productName: "", quantity: 1 }]);
    setError("");
    setStockAlert("");
    setView("form");
  };

  // ── Open existing ────────────────────────────────────────────────────────────
  const openExisting = async (rec: DeliveryRecord) => {
    setCurrentId(rec.id);
    setReference(rec.reference_document);
    setDeliveryAddress(rec.contact ?? "");
    setScheduleDate(rec.schedule_date ?? "");
    setStatus(rec.status);

    const { data: moves } = await supabase
      .from("stock_moves")
      .select("id, product_id, quantity, products(name, sku)")
      .eq("operation_id", rec.id);

    const lines: ProductLine[] =
      moves && moves.length > 0
        ? moves.map((m: any) => ({
            lineId: m.id,
            product_id: m.product_id,
            productName: m.products ? `[${m.products.sku}] ${m.products.name}` : "",
            quantity: m.quantity,
          }))
        : [{ lineId: Date.now(), product_id: "", productName: "", quantity: 1 }];

    setProducts(lines);
    await checkStock(lines);
    setError("");
    setView("form");
  };

  // ── Save / state transition ──────────────────────────────────────────────────
  const handleSave = async (nextStatus: OperationStatus = status) => {
    setError("");
    if (!deliveryAddress.trim()) { setError("Delivery Address is required."); return; }
    if (products.some(p => !p.product_id)) { setError("All product lines must have a product selected."); return; }
    if (products.some(p => p.quantity <= 0)) { setError("All quantities must be greater than 0."); return; }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!currentId) {
      const { data: op, error: opErr } = await supabase
        .from("operations")
        .insert({
          type: "delivery",
          status: nextStatus,
          reference_document: reference,
          contact: deliveryAddress,
          responsible,
          schedule_date: scheduleDate || null,
          created_by: user?.id ?? null,
        })
        .select()
        .single();

      if (opErr) { setError(opErr.message); setSaving(false); return; }

      const moves = products.map(p => ({
        operation_id: op.id,
        product_id: p.product_id,
        from_location_id: null,
        to_location_id: null,
        quantity: p.quantity,
      }));
      const { error: movErr } = await supabase.from("stock_moves").insert(moves);
      if (movErr) { setError(movErr.message); setSaving(false); return; }

      setCurrentId(op.id);
      setStatus(nextStatus);
    } else {
      const { error: upErr } = await supabase
        .from("operations")
        .update({ status: nextStatus, contact: deliveryAddress, schedule_date: scheduleDate || null, responsible })
        .eq("id", currentId);
      if (upErr) { setError(upErr.message); setSaving(false); return; }
      setStatus(nextStatus);
    }

    setSaving(false);
    fetchDeliveries();
  };

  // ── Validate → advance status ────────────────────────────────────────────────
  const handleValidate = async () => {
    // Run stock check before advancing to ready/done
    await checkStock(products);
    if (status === "draft") handleSave("waiting");
    else if (status === "waiting") handleSave("ready");
    else if (status === "ready") handleSave("done");
  };

  // ── Cancel ───────────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (currentId) {
      await supabase.from("operations").update({ status: "canceled" }).eq("id", currentId);
      fetchDeliveries();
    }
    setView("list");
  };

  // ── Product line helpers ─────────────────────────────────────────────────────
  const updateProductLine = (lineId: number, field: "product_id" | "quantity", value: string | number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.lineId !== lineId) return p;
        if (field === "product_id") {
          const opt = productOptions.find(o => o.id === value);
          return { ...p, product_id: value as string, productName: opt ? `[${opt.sku}] ${opt.name}` : "", outOfStock: false };
        }
        return { ...p, quantity: Number(value), outOfStock: false };
      })
    );
    setStockAlert("");
  };

  const addProductLine = () => setProducts(prev => [...prev, { lineId: Date.now(), product_id: "", productName: "", quantity: 1 }]);
  const removeProductLine = (lineId: number) => setProducts(prev => prev.filter(p => p.lineId !== lineId));

  const nextActionLabel = status === "draft" ? "Validate → Waiting" : status === "waiting" ? "Validate → Ready" : status === "ready" ? "Validate → Done" : null;

  const filtered = deliveries.filter(d =>
    d.reference_document?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contact?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-12 space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-[#EAE6DE] shadow-sm">
        <div className="flex items-center gap-4">
          {view === "list" ? (
            <Button
              onClick={openNewForm}
              className="bg-white border-2 border-[#EAE6DE] text-[#292B2A] hover:bg-[#F5F2EC] rounded-xl font-bold px-6 shadow-none"
            >
              NEW
            </Button>
          ) : (
            <Button
              onClick={openNewForm}
              variant="outline"
              className="rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] font-bold px-6"
            >
              New
            </Button>
          )}
          <h1 className="text-2xl font-bold text-[#A66A4C] font-['Outfit']">Delivery</h1>
        </div>

        {view === "list" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73716C]" />
              <Input
                placeholder="Search by reference or address…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 w-72 rounded-xl border-[#EAE6DE]"
              />
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

      {/* ── List View ── */}
      {view === "list" ? (
        <div className="bg-white rounded-2xl border-2 border-[#EAE6DE] shadow-sm overflow-hidden min-h-[400px]">
          {loadingList ? (
            <div className="flex items-center justify-center py-24 text-[#73716C]">
              <Loader2 className="animate-spin mr-2" /> Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#73716C]">
              <div className="h-16 w-16 bg-[#F5F2EC] rounded-2xl flex items-center justify-center border-2 border-[#EAE6DE]">
                <CheckCircle2 className="h-8 w-8 text-[#A66A4C] opacity-40" />
              </div>
              <p className="font-semibold text-[#292B2A]">No deliveries yet</p>
              <p className="text-sm">Click <strong>NEW</strong> to create your first delivery.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#F5F2EC]/50">
                <TableRow className="border-b-2 border-[#EAE6DE]">
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Reference</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Delivery Address</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Responsible</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Schedule Date</TableHead>
                  <TableHead className="font-semibold text-[#292B2A] py-4 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(del => (
                  <TableRow
                    key={del.id}
                    className="border-b border-[#EAE6DE] cursor-pointer hover:bg-[#F5F2EC]/30 transition-colors"
                    onClick={() => openExisting(del)}
                  >
                    <TableCell className="text-[#A66A4C] font-semibold py-4 px-6">{del.reference_document}</TableCell>
                    <TableCell className="py-4 px-6 text-[#73716C]">{del.contact ?? "—"}</TableCell>
                    <TableCell className="py-4 px-6 text-[#73716C]">{del.responsible ?? "—"}</TableCell>
                    <TableCell className="py-4 px-6 text-[#73716C]">{del.schedule_date ?? "—"}</TableCell>
                    <TableCell className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[del.status]}`}>
                        {del.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        /* ── Form View ── */
        <div className="bg-white rounded-2xl border-2 border-[#EAE6DE] shadow-sm flex flex-col">
          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 border-b-2 border-[#EAE6DE] flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {nextActionLabel && (
                <Button
                  onClick={handleValidate}
                  disabled={saving}
                  className="rounded-xl border-2 border-[#A66A4C] bg-[#A66A4C] text-white hover:bg-[#8A5238] font-semibold"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : null}
                  {nextActionLabel}
                </Button>
              )}
              {status === "draft" && (
                <Button
                  onClick={() => handleSave("draft")}
                  disabled={saving}
                  variant="outline"
                  className="rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] font-semibold hover:bg-[#F5F2EC]"
                >
                  Save Draft
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] font-semibold hover:bg-[#F5F2EC]"
              >
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl border-2 border-[#EAE6DE] text-[#73716C] font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                {currentId ? "Cancel Delivery" : "Discard"}
              </Button>
            </div>

            {/* Status stepper */}
            <div className="flex items-center rounded-xl border-2 border-[#EAE6DE] overflow-hidden text-sm font-semibold">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center">
                  <span className={`px-4 py-2 transition-colors ${status === step ? "bg-[#A66A4C] text-white" : STATUS_STEPS.indexOf(status) > i ? "bg-[#F5F2EC] text-[#73716C]" : "text-[#73716C]"}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {i < STATUS_STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-[#EAE6DE]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Error + Stock alert banners */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {stockAlert && (
            <div className="mx-8 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-medium flex items-center gap-2">
              ⚠️ {stockAlert} — highlighted rows are out of stock.
            </div>
          )}

          {/* Form Body */}
          <div className="p-8 flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-[#A66A4C] font-['Outfit']">{reference}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#A66A4C] uppercase tracking-widest">Delivery Address *</label>
                <Input
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Customer address"
                  disabled={status === "done" || status === "canceled"}
                  className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#A66A4C] text-[#292B2A] font-medium bg-transparent disabled:opacity-60"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#A66A4C] uppercase tracking-widest">Schedule Date</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  disabled={status === "done" || status === "canceled"}
                  className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#A66A4C] text-[#292B2A] font-medium bg-transparent w-max disabled:opacity-60"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#A66A4C] uppercase tracking-widest">Responsible</label>
                <Input
                  value={responsible}
                  readOnly
                  className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 text-[#73716C] font-medium bg-transparent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#A66A4C] uppercase tracking-widest">Operation Type</label>
                <Input
                  value={operationType}
                  readOnly
                  className="border-0 border-b-2 border-[#EAE6DE] rounded-none px-0 focus-visible:ring-0 text-[#73716C] font-medium bg-transparent"
                />
              </div>
            </div>

            {/* Products table */}
            <div className="mt-4">
              <h3 className="text-base font-bold text-[#292B2A] mb-3">Products</h3>
              <div className="border-2 border-[#EAE6DE] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F5F2EC]/50">
                    <TableRow className="border-b-2 border-[#EAE6DE]">
                      <TableHead className="font-semibold text-[#A66A4C] py-3 px-4">Product</TableHead>
                      <TableHead className="font-semibold text-[#A66A4C] py-3 px-4 w-36 text-right">Quantity</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow
                        key={p.lineId}
                        className={`border-b border-[#EAE6DE] ${p.outOfStock ? "bg-red-50" : ""}`}
                      >
                        <TableCell className="py-2 px-4">
                          <select
                            value={p.product_id}
                            onChange={e => updateProductLine(p.lineId, "product_id", e.target.value)}
                            disabled={status === "done" || status === "canceled"}
                            className={`w-full border-0 bg-transparent outline-none font-medium disabled:opacity-60 py-2 ${p.outOfStock ? "text-red-600" : "text-[#292B2A]"}`}
                          >
                            <option value="">— Select product —</option>
                            {productOptions.map(opt => (
                              <option key={opt.id} value={opt.id}>[{opt.sku}] {opt.name}</option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <Input
                            type="number"
                            min={1}
                            value={p.quantity}
                            onChange={e => updateProductLine(p.lineId, "quantity", Number(e.target.value))}
                            disabled={status === "done" || status === "canceled"}
                            className={`border-0 bg-transparent focus-visible:ring-0 px-0 text-right font-medium disabled:opacity-60 ${p.outOfStock ? "text-red-600" : ""}`}
                          />
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {p.outOfStock && <span title="Out of stock" className="text-red-500 text-lg">⚠</span>}
                          {status !== "done" && status !== "canceled" && !p.outOfStock && products.length > 1 && (
                            <button onClick={() => removeProductLine(p.lineId)} className="text-[#73716C] hover:text-red-500">
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {status !== "done" && status !== "canceled" && (
                  <div className="p-2 bg-[#F5F2EC]/30">
                    <Button
                      variant="ghost"
                      onClick={addProductLine}
                      className="text-[#A66A4C] hover:bg-[#EAE6DE] text-sm font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add new product
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
