"use client";

import { Mail, MessageCircle, Clock, MapPin, Send, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/lib/notificationStore";

const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "We offer Cash on Delivery across all districts in Sri Lanka. Orders are typically processed within 24 hours. Delivery takes 1-3 working days within Colombo, and 3-5 working days for outstation areas.",
  },
  {
    question: "Do you offer exchanges or returns?",
    answer: "Yes, we accept exchanges within 7 days of delivery for unworn items with tags attached. Please note that sale items and limited drops are final sale.",
  },
  {
    question: "How do I know my size?",
    answer: "Our signature t-shirts feature a premium oversized drop-shoulder fit. We recommend ordering your true size for the intended oversized look, or sizing down for a more standard fit. Check our detailed Size Guide on any product page.",
  },
  {
    question: "When is the next drop?",
    answer: "We drop new limited-edition designs weekly. The best way to get early access is to follow us on Instagram @brand.zeal and join our WhatsApp community.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || (!email.trim() && !phone.trim())) {
      setError("Please provide a message and your email or phone number.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Customer",
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim() || `Inquiry from ${name || "Customer"}`,
          message: message.trim(),
        }),
      });
      if (res.ok) {
        addNotification({
          type: "MESSAGE",
          title: "New Contact Message",
          subtitle: name || "Customer",
          detail: `${email || phone}: "${message.slice(0, 45)}${message.length > 45 ? "..." : ""}"`,
          link: "/admin/messages",
        });
        setSent(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setTimeout(() => setSent(false), 6000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/tshirts/FB_IMG_1785245533159.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Here For You
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white max-w-xl mx-auto font-bold">
              Have a question about an order, our size guide, or just want to say hi? We&apos;re always down to chat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Get In Touch</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                {/* WhatsApp */}
                <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider mb-2">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm mb-3">Fastest response time for order inquiries.</p>
                  <a href="https://wa.me/94788585588" target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:text-green-600 transition-colors">
                    078 858 5588
                  </a>
                </div>

                {/* Email */}
                <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm mb-3">For general inquiries and collaborations.</p>
                  <a href="mailto:hello@zealbrand.com" className="font-bold hover:text-red-600 transition-colors">
                    hello@zealbrand.com
                  </a>
                </div>

                {/* Hours */}
                <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider mb-2">Hours</h3>
                  <p className="text-muted-foreground text-sm">Mon - Sat</p>
                  <p className="font-bold">9:00 AM - 6:00 PM</p>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-muted-foreground text-sm">Online Exclusive.</p>
                  <p className="font-bold">Islandwide Delivery</p>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Frequently Asked</h2>
                <div className="space-y-4">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span className="font-bold">{faq.question}</span>
                        <div className={`text-red-600 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                          {openFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-border">
                <div className="mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-3">Send a Message</h2>
                  <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                {/* Success Toast */}
                {sent && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Message sent successfully!</p>
                      <p className="text-xs text-emerald-600">We&apos;ll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Name *</label>
                    <input 
                      required 
                      type="text" 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-xl border border-border bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-xl border border-border bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="077 123 4567"
                        className="w-full px-5 py-4 rounded-xl border border-border bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject / Topic (Optional)</label>
                    <input 
                      type="text" 
                      id="subject" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Order Inquiry / Size Guidance / General Question"
                      className="w-full px-5 py-4 rounded-xl border border-border bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message *</label>
                    <textarea 
                      required 
                      id="message" 
                      rows={5} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full px-5 py-4 rounded-xl border border-border bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={sending}
                    className="w-full bg-red-600 text-white uppercase tracking-widest font-black py-5 px-6 rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Message"}
                    {!sending && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
