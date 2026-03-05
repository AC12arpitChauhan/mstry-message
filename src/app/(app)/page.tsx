'use client';

import { Mail, Box, Lock, Search, Settings, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { Spotlight } from '@/components/ui/spotlight-new';
import DottedGlowBackground from '@/components/ui/dotted-glow-background';
import { motion } from "motion/react";
import { AuroraBackground } from '@/components/ui/aurora-background';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useEffect } from 'react';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import Link from "next/link";
import { WavyBackground } from '@/components/ui/wavy-background';
import { LandingBentoGrid } from '@/components/landing/LandingBentoGrid';

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.background = '#000000';
    
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '';
    };
  }, []);

  const content = [
  {
    title: "Sign Up & Verify",
    description:
      "Start your True Feedback journey by creating an account in just a few clicks. Secure your identity with email verification through a one-time verification code to ensure your feedback environment stays authentic and safe.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/signup.png"
          width={100}
          height={100}
          className="h-full w-full object-contain rounded-lg"
          alt="Share your unique link"
        />
      </div>
    ),
  },
  {
    title: "Share Your Unique Link",
    description:
      "Once you’re in, grab your personalized feedback link straight from your dashboard. Share it across your social media, friends’ groups, or teams, anywhere you want to hear honest opinions. Every message you receive stays anonymous, so people can share without hesitation.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/share.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Share your unique link"
        />
      </div>
    ),
  },
  {
    title: "Receive Anonymous Feedback",
    description:
      "Sit back and let the messages come in! All feedback appears neatly organized in your dashboard, keeping anonymity intact. Reflect on people’s opinions and use their honest words to improve yourself, your work, or your relationships.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/feedback.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Share your unique link"
        />
      </div>
    ),
  },
  {
    title: "Respond & Engage",
    description:
      "Want to respond to a message? True Feedback lets you reply directly to any message if you choose, fostering meaningful yet respectful communication without compromising anyone’s privacy.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/engage.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Respond to feedback"
        />
      </div>
    ),
  },
];


  return (
    <div className="relative bg-black min-h-screen">
      {/* Hero Section with Spotlight */}
      <div className="relative">
      <WavyBackground >
        
        <main className='relative w-full h-[80vh] flex items-center justify-center overflow-hidden'>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4 z-10"
          >
            <div className="text-3xl md:text-7xl font-bold text-white text-center">
              Welcome to True Feedback.
            </div>
            <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4">
              Anonymous Feedback for Everyone.
            </div>
            <Link href='/sign-up'>
              <button className="bg-white rounded-full w-fit text-black px-6 py-3 hover:bg-neutral-100 transition-colors mt-4"> 
                Register Now
              </button>
            </Link>
          </motion.div>
        </main>
        </WavyBackground>
        
        <LandingBentoGrid />

        {/* Gradient Transition */}
        
      </div>
      
            {/* Sticky Scroll Section */}
      <section className="relative bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              A simple way to receive honest, anonymous feedback from anyone.
            </p>
          </motion.div>
          
          <StickyScroll content={content} />
        </div>

        {/* Gradient Transition */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-10" /> */}
      </section>

      {/* Glowing Grid Section */}
      <section className="relative w-full px-4 py-32 md:px-8 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Why True Feedback Stands Out
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Designed to make sharing honest opinions effortless, safe, and genuinely helpful.
            </p>

          </motion.div>

          <motion.ul 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2"
          >
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Box className="h-4 w-4 text-neutral-400" />}
              title="Anonymity You Can Trust"
              description="Your identity stays always hidden. True Feedback uses secure encryption so you can be fully honest without fear of being judged."
            />

            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<Settings className="h-4 w-4 text-neutral-400" />}
              title="Built for Growth"
              description="Every message helps you reflect, improve, and grow. Whether it’s personal or professional feedback, the goal is progress, not perfection."
            />

            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
              title="Private, Always"
              description="We don’t track, sell, or expose your messages. Your feedback experience stays between you and your inbox, just how it should be."
            />

            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Sparkles className="h-4 w-4 text-neutral-400" />}
              title="Simple. Clean. Modern."
              description="No clutter, no ads, no noise, just a calm, beautiful dashboard that focuses on what really matters: your words and your growth."
            />

            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Search className="h-4 w-4 text-neutral-400" />}
              title="Trusted by Honest Voices"
              description="Thousands of users share, listen, and improve every day on True Feedback. Join the wave of authenticity and make feedback meaningful again."
            />

          </motion.ul>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative text-center p-8 md:p-12 bg-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-400">
            © 2023-2025 True Feedback. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <motion.li 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`min-h-[14rem] list-none ${area}`}
    >
      <div className="relative h-full rounded-2xl border border-neutral-800 p-2 md:rounded-3xl md:p-3 bg-black/40 backdrop-blur-sm hover:border-neutral-700 transition-colors">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 bg-neutral-950/50 shadow-[0px_0px_27px_0px_rgba(0,0,0,0.5)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-neutral-700 bg-neutral-900/50 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-neutral-400 md:text-base/[1.375rem]">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};