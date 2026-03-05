"use client";

import { motion } from "motion/react";
import { LandingCard } from "./LandingCard";

export const LandingBentoGrid = () => {
  const cards = [
    {
      title: "Shareable Story Cards",
      description: "Beautiful social media story cards with custom themes.",
      image: "/landing/true-feedback-reply-story-1.png",
      span: "md:col-span-3 md:row-span-2 min-h-[500px]",
    },
    {
      title: "Anonymous Inbox",
      description: "Clean dashboard for managing incoming messages.",
      image: "/landing/true-feedback-reply-story-2.png",
      span: "md:col-span-2 min-h-[240px]",
    },
    {
      title: "Safety Controls",
      description: "Advanced keyword and IP filtering tools.",
      image: "/landing/true-feedback-reply-story-3.png",
      span: "md:col-span-2 min-h-[240px]",
    },
    {
      title: "Quick Reply UI",
      description: "Communicate directly without losing anonymity.",
      image: "/landing/true-feedback-reply-story-4.png",
      span: "md:col-span-2 min-h-[240px]",
    },
    {
      title: "Analytics Suite",
      description: "Track sentiment and engagement metrics.",
      image: "/landing/true-feedback-reply-story-5.png",
      span: "md:col-span-3 min-h-[300px]",
    },
    {
      title: "Public Profiles",
      description: "Professional landing pages for your followers.",
      image: "/landing/true-feedback-reply-story-6.png",
      span: "md:col-span-5 min-h-[300px]",
    }
  ];

  return (
    <section className="relative overflow-hidden bg-black pb-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Growth-focused</span> Creators
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
            A powerful suite of tools designed to help you gather, manage, and share honest feedback from your community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {cards.map((card, index) => (
            <LandingCard
              key={index}
              title={card.title}
              description={card.description}
              image={card.image}
              span={card.span}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
