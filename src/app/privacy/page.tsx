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

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-neutral-900 text-white py-16 text-center">
        <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-3 block">Legal</span>
        <h1 className="text-4xl md:text-5xl font-serif">Privacy Policy</h1>
        <p className="text-neutral-400 mt-3 text-sm">Last updated: July 2026</p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">

        <Section title="1. Overview">
          <p>
            At <strong className="text-foreground">Zeal Brand</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or place an order with us.
          </p>
          <p>
            By using our website, you consent to the data practices described in this policy.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following types of information when you place an order or contact us:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong className="text-foreground">Personal details:</strong> Full name, phone number, delivery address.</li>
            <li><strong className="text-foreground">Order information:</strong> Items purchased, order amount, delivery preferences.</li>
            <li><strong className="text-foreground">Communication data:</strong> Messages sent to us via WhatsApp, email, or our contact form.</li>
            <li><strong className="text-foreground">Usage data:</strong> Pages visited, time on site, device and browser type (collected anonymously via analytics).</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Process and deliver your orders via our courier partners.</li>
            <li>Contact you regarding your order status or any issues.</li>
            <li>Respond to inquiries submitted through our contact channels.</li>
            <li>Improve our website, products, and customer experience.</li>
            <li>Send you updates about new drops or promotions (only if you have opted in).</li>
          </ul>
          <p>We do <strong className="text-foreground">not</strong> sell or rent your personal information to any third parties.</p>
        </Section>

        <Section title="4. Data Sharing">
          <p>
            We only share your personal data with trusted third-party service providers strictly necessary for fulfilling your order — such as our courier and delivery partners operating within Sri Lanka. These partners are bound by confidentiality agreements.
          </p>
          <p>
            We may also disclose information if required to do so by law or in response to valid legal requests by public authorities.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We take the security of your personal data seriously. We implement reasonable technical and organisational measures to protect your information from unauthorised access, disclosure, alteration, or destruction.
          </p>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Our website may use cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how visitors use our site. You can disable cookies in your browser settings, though this may affect some functionality.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Order data is typically retained for up to <strong className="text-foreground">12 months</strong> after your purchase.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal data (subject to legal obligations).</li>
            <li>Opt out of any marketing communications at any time.</li>
          </ul>
          <p>To exercise any of these rights, please contact us via WhatsApp or email.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately so we can delete it.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions or concerns about this Privacy Policy, please reach out:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>WhatsApp: <a href="https://wa.me/94788585588" className="text-red-600 font-medium hover:underline">078 858 5588</a></li>
            <li>Email: <a href="mailto:hello@zealbrand.com" className="text-red-600 font-medium hover:underline">hello@zealbrand.com</a></li>
            <li>Instagram: <a href="https://instagram.com/brand.zeal" target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium hover:underline">@brand.zeal</a></li>
          </ul>
        </Section>

        <div className="border-t border-border pt-8 flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground hover:underline">Terms of Service</Link>
          <Link href="/faq" className="hover:text-foreground hover:underline">FAQ</Link>
          <Link href="/contact" className="hover:text-foreground hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
