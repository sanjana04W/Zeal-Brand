import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-black uppercase tracking-wider mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-neutral-900 text-white py-16 text-center">
        <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-3 block">Legal</span>
        <h1 className="text-4xl md:text-5xl font-serif">Terms of Service</h1>
        <p className="text-neutral-400 mt-3 text-sm">Last updated: July 2026</p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong className="text-foreground">Zeal Brand</strong>. By accessing or placing an order on our website (<strong className="text-foreground">zealbrand.com</strong>), you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
          </p>
          <p>
            These terms apply to all visitors, customers, and others who access or use our service. If you disagree with any part of the terms, you may not access the website.
          </p>
        </Section>

        <Section title="2. Products & Availability">
          <p>
            All products listed on our website are subject to availability. We offer limited-edition drops and certain items may sell out quickly. We reserve the right to discontinue any product at any time without notice.
          </p>
          <p>
            Product images are for illustration purposes only. While we strive for accuracy, slight colour variations may occur due to screen settings and photography conditions.
          </p>
        </Section>

        <Section title="3. Pricing & Payment">
          <p>
            All prices are listed in Sri Lankan Rupees (Rs.) and are inclusive of applicable taxes. We reserve the right to change our prices at any time.
          </p>
          <p>
            We offer <strong className="text-foreground">Cash on Delivery (COD)</strong> as our primary payment method, available across all districts in Sri Lanka.
          </p>
        </Section>

        <Section title="4. Order Confirmation">
          <p>
            After placing an order, you will receive a confirmation via WhatsApp or email. We reserve the right to cancel or refuse any order at our discretion, including in cases of pricing errors or suspected fraudulent activity.
          </p>
        </Section>

        <Section title="5. Shipping & Delivery">
          <p>
            Orders are processed within <strong className="text-foreground">24 hours</strong> on business days. Delivery typically takes <strong className="text-foreground">1–3 business days</strong> for Colombo and suburbs, and <strong className="text-foreground">3–5 business days</strong> for outstation addresses.
          </p>
          <p>
            We are not responsible for delays caused by courier partners or unforeseen circumstances. Shipping rates may apply based on location.
          </p>
        </Section>

        <Section title="6. Returns & Exchanges">
          <p>
            We accept exchanges within <strong className="text-foreground">7 days</strong> of delivery for items that are unworn, unwashed, and have original tags attached. To initiate an exchange, please contact us via WhatsApp at <strong className="text-foreground">078 858 5588</strong>.
          </p>
          <p>
            <strong className="text-foreground">Sale items and limited-edition drops are final sale</strong> and are not eligible for returns or exchanges unless the item is defective.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All content on this website — including designs, logos, images, and text — is the property of Zeal Brand and is protected by copyright law. You may not reproduce, distribute, or use our content without prior written consent.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            Zeal Brand shall not be held liable for any indirect, incidental, or consequential damages arising from your use of our products or website. Our total liability shall not exceed the amount you paid for the specific order in question.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Continued use of our site constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>WhatsApp: <a href="https://wa.me/94788585588" className="text-red-600 font-medium hover:underline">078 858 5588</a></li>
            <li>Email: <a href="mailto:hello@zealbrand.com" className="text-red-600 font-medium hover:underline">hello@zealbrand.com</a></li>
            <li>Instagram: <a href="https://instagram.com/brand.zeal" target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium hover:underline">@brand.zeal</a></li>
          </ul>
        </Section>

        <div className="border-t border-border pt-8 flex gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link href="/faq" className="hover:text-foreground hover:underline">FAQ</Link>
          <Link href="/contact" className="hover:text-foreground hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
