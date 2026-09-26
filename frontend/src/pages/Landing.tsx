import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Box, ArrowLeftRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#252525] font-['Inter']">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-6 md:px-12 md:py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#A66A4C] flex items-center justify-center">
            <Box className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold font-['Outfit'] tracking-tight text-[#292B2A]">StockSense</span>
        </div>
        <div className="flex items-center gap-[16px]">
          <Link to="/login" className="text-[#73716C] hover:text-[#292B2A] font-medium transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 bg-[#292B2A] text-white rounded-lg hover:bg-[#292B2A]/90 font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-[64px] md:py-[96px] text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold font-['Outfit'] tracking-tight leading-tight text-[#292B2A] mb-[24px]">
          Digitize and Streamline Your <span className="text-[#A66A4C]">Inventory Operations</span>
        </h1>
        <p className="text-lg md:text-xl text-[#73716C] mb-[32px] max-w-2xl mx-auto">
          Replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use Inventory Management System.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px]">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-[#A66A4C] text-white rounded-xl font-medium text-lg hover:bg-[#A66A4C]/90 transition-colors flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-[#EAE6DE] text-[#292B2A] rounded-xl font-medium text-lg hover:bg-[#EAE6DE]/80 transition-colors"
          >
            Access Dashboard
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#292B2A] text-white py-[64px] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-[48px]">
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-[16px]">Everything you need for stock control</h2>
            <p className="text-[#B7A58A] text-lg max-w-2xl mx-auto">Built for inventory managers and warehouse staff to stay perfectly in sync.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-[#A66A4C]" />}
              title="Product Management"
              description="Easily create and manage products with SKUs, categories, and initial stock quantities."
            />
            <FeatureCard 
              icon={<ArrowLeftRight className="w-6 h-6 text-[#A66A4C]" />}
              title="Seamless Operations"
              description="Handle incoming receipts, outgoing deliveries, and internal warehouse transfers smoothly."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6 text-[#A66A4C]" />}
              title="Stock Adjustments"
              description="Quickly fix mismatches between recorded numbers and physical stock counts."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-[#A66A4C]" />}
              title="Real-Time Dashboard"
              description="Track KPIs like total products, low stock alerts, and pending document states instantly."
            />
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-[64px] px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-[48px] items-center">
          <div>
            <h2 className="text-3xl font-bold font-['Outfit'] text-[#292B2A] mb-[24px]">Designed for exactly who needs it</h2>
            <div className="space-y-[24px]">
              <div className="p-[24px] bg-[#EAE6DE] rounded-xl">
                <h3 className="text-xl font-bold text-[#292B2A] mb-[8px]">Inventory Managers</h3>
                <p className="text-[#73716C]">Gain full visibility over incoming and outgoing stock, ledger history, and multi-warehouse analytics.</p>
              </div>
              <div className="p-[24px] bg-[#EAE6DE] rounded-xl border-l-4 border-[#A66A4C]">
                <h3 className="text-xl font-bold text-[#292B2A] mb-[8px]">Warehouse Staff</h3>
                <p className="text-[#73716C]">Quickly perform operational tasks like transferring goods, picking orders, shelving, and physical counting.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#EAE6DE] h-[400px] rounded-2xl p-[32px] flex items-center justify-center relative overflow-hidden">
             {/* Abstract mockup representation */}
             <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-[#B7A58A]/30">
               <div className="h-12 border-b border-[#F5F2EC] flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#EAE6DE]" />
                 <div className="w-3 h-3 rounded-full bg-[#EAE6DE]" />
                 <div className="w-3 h-3 rounded-full bg-[#EAE6DE]" />
               </div>
               <div className="flex-1 p-6 flex flex-col gap-4">
                 <div className="flex gap-4">
                   <div className="w-1/3 h-24 bg-[#F5F2EC] rounded-md" />
                   <div className="w-1/3 h-24 bg-[#F5F2EC] rounded-md" />
                   <div className="w-1/3 h-24 bg-[#F5F2EC] rounded-md" />
                 </div>
                 <div className="flex-1 bg-[#F5F2EC] rounded-md w-full" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#292B2A] py-[32px] px-6 text-center text-[#B7A58A] border-t border-[#73716C]/20">
        <p className="text-sm">© {new Date().getFullYear()} StockSense IMS. Built for the Odoo Hackathon 2026.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-[24px] rounded-xl bg-[#292B2A] border border-[#73716C]/30 hover:border-[#A66A4C] transition-colors">
      <div className="w-12 h-12 bg-[#B7A58A]/10 rounded-lg flex items-center justify-center mb-[16px]">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-['Outfit'] mb-[8px]">{title}</h3>
      <p className="text-[#B7A58A] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
