"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Flame, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
        <Image 
          src="/Images/tshirts/FB_IMG_1785245536424.jpg" 
          alt="Zeal Brand team" 
          fill 
          priority
          unoptimized
          className="object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 block">
              EST. 2019
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
              About Zeal Brand
            </h1>
            <p className="text-xl text-white max-w-xl mx-auto font-bold">
              Redefining streetwear in Sri Lanka through premium quality, limited drops, and authentic community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
                Quality from <br/>
                <span className="text-red-600">Inside Out</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Zeal Brand</strong> was born out of a passion for authentic streetwear and high-quality graphic tees. What started as a small project sharing designs on Instagram and TikTok has grown into a premier destination for streetwear enthusiasts across Sri Lanka.
                </p>
                <p>
                  We believe that a t-shirt is more than just a piece of clothing; it's a canvas for self-expression. Our designs range from vintage-inspired acid washes and classic logos to limited-edition drops that push the boundaries of modern streetwear.
                </p>
                <p>
                  As an online-exclusive brand, we bypass traditional retail markups to deliver premium garments directly to your doorstep. We are incredibly grateful to our community for styling our pieces and tagging us along the journey.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
                    <Image src="/Images/tshirts/FB_IMG_1785258353085.jpg" alt="Zeal Design 1" fill className="object-cover" unoptimized />
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
                    <Image src="/Images/tshirts/FB_IMG_1785245536424.jpg" alt="Zeal Design 2" fill className="object-cover" unoptimized />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
                    <Image src="/Images/tshirts/boys 1.jpg" alt="Zeal Design 3" fill className="object-cover" unoptimized />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-red-600 shadow-md flex items-center justify-center p-6 text-white text-center">
                    <div>
                      <Flame size={40} className="mx-auto mb-3 text-yellow-300" />
                      <p className="font-black uppercase tracking-widest text-sm">New Drops Weekly</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Our Commitment</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">The Zeal Standard</h2>
            <p className="text-neutral-400 text-lg">We don't compromise on what matters. Every piece is designed and crafted with purpose.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div 
              className="bg-neutral-800/50 border border-neutral-700/50 p-8 rounded-2xl text-center hover:bg-neutral-800 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3">Premium Quality</h3>
              <p className="text-neutral-400 leading-relaxed">
                We use heavyweight 280GSM cotton for our signature oversized fits to ensure your tees look better and last longer, wash after wash.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-neutral-800/50 border border-neutral-700/50 p-8 rounded-2xl text-center hover:bg-neutral-800 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3">Islandwide Access</h3>
              <p className="text-neutral-400 leading-relaxed">
                Everyone deserves good style. That's why we offer fast delivery and Cash on Delivery across all 25 districts in Sri Lanka.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-neutral-800/50 border border-neutral-700/50 p-8 rounded-2xl text-center hover:bg-neutral-800 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-orange-600/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flame size={32} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3">Limited Drops</h3>
              <p className="text-neutral-400 leading-relaxed">
                We keep our community fresh by dropping new, limited-stock designs frequently. Once a piece is gone, it rarely restocks.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative z-10">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mb-3 block">Milestones</span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground">Our Growth Story</h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Central Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-red-400 to-transparent md:-translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-16">
              {[
                { year: "2019", title: "Founded on Social Media", description: "Zeal Brand began as a boutique project sharing hand-picked designs on Instagram and TikTok, building our early community." },
                { year: "2021", title: "5,000+ Customers", description: "Grew to a loyal islandwide community across Sri Lanka, recognized for our commitment to quality and unique aesthetic." },
                { year: "2023", title: "Website Launch", description: "Moved our catalog fully online for faster, easier shopping and a premium digital experience matching our garments." },
                { year: "2024", title: "New Collections", description: "Rolling out weekly exclusive drops and expanding our range to keep the streets in style." },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? "md:flex-row-reverse" : ""} group`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  
                  {/* Center Dot */}
                  <div className="absolute left-6 md:left-1/2 w-5 h-5 bg-white rounded-full top-6 md:top-1/2 md:-translate-y-1/2 -translate-x-[8px] md:-translate-x-1/2 shadow-[0_0_0_4px_var(--red-600)] ring-4 ring-white z-10 group-hover:scale-125 transition-transform duration-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>

                  {/* Content Box */}
                  <div className={`pl-16 md:pl-0 w-full md:w-1/2 ${idx % 2 === 0 ? "md:pl-16 lg:pl-20" : "md:pr-16 lg:pr-20 text-left md:text-right"}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-border hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                      {/* Decorative fade */}
                      <div className={`absolute top-0 bottom-0 w-2 bg-red-600 ${idx % 2 === 0 ? "left-0" : "left-0 md:left-auto md:right-0"}`}></div>
                      
                      <span className="text-sm font-black tracking-widest text-red-600 mb-2 block">{item.year}</span>
                      <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Join the Movement
          </h2>
          <p className="text-xl font-medium mb-10 text-white/90">
            Be part of the fastest growing streetwear community in Sri Lanka. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto bg-white text-red-600 font-black uppercase tracking-widest px-8 py-4 rounded-full hover:bg-neutral-100 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Shop The Collection <ArrowRight size={18} />
            </Link>
            <a 
              href="https://instagram.com/brand.zeal" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-black uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Follow Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
