"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const FAQ_SECTIONS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our shop, select your size, and click 'Add to Cart'. Once you're ready, proceed to checkout and fill in your delivery details. We'll confirm your order via WhatsApp shortly after.",
      },
      {
        q: "Do you offer Cash on Delivery?",
        a: "Yes! We offer Cash on Delivery (COD) across all 25 districts in Sri Lanka. No online payment required — just pay when your order arrives at your door.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders are processed within 24 hours on business days. Delivery takes 1–3 business days for Colombo and suburbs, and 3–5 business days for outstation areas.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order is dispatched, we'll send you a tracking link via WhatsApp so you can follow your delivery in real time.",
      },
      {
        q: "Do you ship outside Sri Lanka?",
        a: "Currently, we only deliver within Sri Lanka. We're working on international shipping and will announce it on our Instagram @brand.zeal when it's available.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept exchanges within 7 days of delivery. Items must be unworn, unwashed, and have original tags attached. Sale items and limited-edition drops are final sale and are not eligible for exchanges.",
      },
      {
        q: "How do I initiate an exchange?",
        a: "Contact us on WhatsApp at 078 858 5588 with your order number and the reason for the exchange. Our team will guide you through the process.",
      },
      {
        q: "What if I received a defective or wrong item?",
        a: "We're so sorry! If you received a wrong or defective item, please WhatsApp us a photo within 48 hours of delivery and we'll arrange an immediate replacement at no cost to you.",
      },
    ],
  },
  {
    category: "Sizing & Products",
    items: [
      {
        q: "How do your t-shirts fit?",
        a: "Our signature tees feature a premium oversized drop-shoulder fit. We recommend ordering your true size for the intended oversized look, or sizing down by one size for a more standard fit.",
      },
      {
        q: "What material are the t-shirts made from?",
        a: "We use heavyweight 280GSM combed cotton for our signature oversized fits. This ensures a premium feel, excellent durability, and that the tee holds its shape even after repeated washes.",
      },
      {
        q: "Are there size charts available?",
        a: "Yes! A detailed size guide is available on each individual product page. If you're still unsure, message us on WhatsApp and we'll help you pick the right size.",
      },
      {
        q: "Will sold-out items be restocked?",
        a: "We run limited-edition drops, so most items do not restock. However, some popular designs may get a second run. Follow us on Instagram @brand.zeal to be the first to know.",
      },
    ],
  },
  {
    category: "About Zeal Brand",
    items: [
      {
        q: "Where is Zeal Brand based?",
        a: "We are an online-exclusive brand based in Sri Lanka, delivering islandwide across all 25 districts.",
      },
      {
        q: "How can I follow new drops?",
        a: "Follow us on Instagram @brand.zeal and TikTok @zeal.brand8 for the latest drops, behind-the-scenes content, and exclusive previews. You can also WhatsApp us to be added to our community updates.",
      },
      {
        q: "Can I collaborate or become a brand ambassador?",
        a: "We're always open to collaborations! Reach out to us via email at hello@zealbrand.com or DM us on Instagram @brand.zeal with your proposal.",
      },
    ],
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-neutral-900 text-white py-16 text-center">
        <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-3 block">Help Centre</span>
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Frequently Asked Questions</h1>
        <p className="text-neutral-300 font-bold max-w-xl mx-auto">
          Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="text-red-400 underline underline-offset-2 hover:text-red-300">Contact us directly.</Link>
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.category} className="mb-14">
            <h2 className="text-lg font-black uppercase tracking-widest text-red-600 mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-red-100"></span>
              {section.category}
              <span className="flex-1 h-px bg-red-100"></span>
            </h2>

            <div className="space-y-3">
              {section.items.map((item, idx) => {
                const key = `${section.category}-${idx}`;
                const isOpen = openItem === key;
                return (
                  <div key={key} className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-semibold pr-4">{item.q}</span>
                      <div className={`shrink-0 text-red-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm border-t border-border pt-4">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="mt-8 bg-neutral-900 text-white p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Still have questions?</h3>
          <p className="text-neutral-400 mb-6">Our team is ready to help. Reach out anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/94788585588"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="bg-red-600 text-white font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground hover:underline">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-foreground hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
