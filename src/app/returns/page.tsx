export default function Returns() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-center border-b border-border pb-8">Returns & Exchanges</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Our Policy</h2>
          <p>
            At Zeal Brand, we want you to be completely satisfied with your purchase. If you ordered the wrong size or received a defective item, we offer a hassle-free <strong>7-Day Exchange Policy</strong> from the date of delivery.
          </p>
          <p className="mt-4">
            <em>Please note: As a standard policy, we do not offer cash refunds. We only offer exchanges for sizes or store credit.</em>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">Eligibility for Exchange</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The item must be unused, unwashed, and in the same condition that you received it.</li>
            <li>All original tags and packaging must be intact.</li>
            <li>The exchange request must be initiated within 7 days of receiving the order.</li>
            <li>Sale items or limited edition drops may not be eligible for exchange unless defective.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase text-foreground mb-4">How to Request an Exchange</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Contact Us:</strong> Message us on WhatsApp or email us at returns@zealbrand.com with your Order Reference Number and reason for exchange.</li>
            <li><strong>Approval:</strong> Our team will review your request and approve the exchange if it meets our criteria.</li>
            <li><strong>Return the Item:</strong> You will need to courier the item back to our facility. The courier charge for sending the item back is the responsibility of the customer.</li>
            <li><strong>Receive the Exchange:</strong> Once we receive and inspect the item, we will dispatch the requested size/item. Zeal Brand will cover the courier fee for sending the new item back to you!</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
