export default function Shipping() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-center border-b border-border pb-8">Shipping & Delivery</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Islandwide Delivery</h2>
          <p>
            Zeal Brand proudly delivers islandwide across Sri Lanka. We have partnered with top domestic courier services to ensure your orders reach you safely and quickly, no matter where you are.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Delivery Timeframes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Colombo & Suburbs:</strong> 1-2 Working Days</li>
            <li><strong>Outstation (Major Cities):</strong> 2-3 Working Days</li>
            <li><strong>Remote Areas:</strong> 3-5 Working Days</li>
          </ul>
          <p className="mt-4 text-sm">
            *Please note that delivery times may be slightly extended during public holidays or extreme weather conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Delivery Charges</h2>
          <p>
            We charge a standard flat rate of <strong>Rs. 400</strong> for all deliveries within Sri Lanka. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Cash on Delivery (COD)</h2>
          <p>
            We offer Cash on Delivery (COD) as our primary payment method. Please ensure you have the exact amount ready when the courier arrives to make the handover seamless. You will receive an SMS or a call from the courier prior to delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
