"use client"

import React from 'react';
import { Terminal, Code2, Activity, Users, ChevronRight, Blocks } from 'lucide-react';
import Link from 'next/link';

const FloatingOrb = ({ className = "" }) => (
  <div className={`animate-float absolute rounded-full mix-blend-screen filter blur-3xl ${className}`} />
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Floating Orbs */}
      <FloatingOrb className="w-96 h-96 bg-purple-500/30 top-0 right-0" />
      <FloatingOrb className="w-96 h-96 bg-indigo-500/30 bottom-0 left-0" />
      <FloatingOrb className="w-72 h-72 bg-purple-600/20 top-1/3 left-1/4" />
      <FloatingOrb className="w-64 h-64 bg-indigo-600/20 bottom-1/4 right-1/4" />

      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 relative">
        <nav className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <Terminal className="text-purple-500" size={32} />
            <span className="text-xl font-bold">DevLogs</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="hover:text-purple-400">Features</a>
            <a href="#contact" className="hover:text-purple-400">Contact</a>
            <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-500 hover:to-indigo-500 transition-colors">
              Sign In
            </Link>
          </div>
        </nav>

        <div className="mt-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            DevLogs:
            Strava For
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"> {'<Coders/>'} </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The VS Code extension that helps developers monitor productivity, analyze coding patterns, and connect with fellow coders.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:from-purple-500 hover:to-indigo-500 transition-colors flex items-center">
              Get Started <ChevronRight className="ml-2" />
            </Link>
            <Link href="https://marketplace.visualstudio.com/items?itemName=ShivamPande18.devlogs" target='_blank' className="border border-purple-500 px-6 py-3 rounded-md hover:bg-purple-900 transition-colors flex items-center">
              <Blocks className="mr-2" /> Download the extention

            </Link>

            <a
              href="https://www.producthunt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white border-[#EA653F] border-2 transition-colors duration-200 rounded-lg shadow-lg hover:shadow-xl"
            >
              <img src="/product-hunt.png" alt="Product Hunt Logo" className="w-6 h-6" />
              <div className='flex-col items-start justify-start ml-1'>

                <p className='text-[#EA653F] text-left font-bold'>Published on </p>
                <p className='text-black font-bold text-xl text-left'>Product Hunt </p>

              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900/50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Supercharge Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Coding Sessions</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 size={32} />,
                title: "Track Sessions",
                description: "Automatically record coding time, lines of code, and languages used across multiple windows."
              },
              {
                icon: <Activity size={32} />,
                title: "Deep Analytics",
                description: "Get insights into your productivity with detailed session analysis and progress tracking."
              },
              {
                icon: <Users size={32} />,
                title: "Developer Community",
                description: "Share your achievements and connect with other developers in the community."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm p-6 rounded-lg hover:border hover:border-purple-500 transition-all hover:scale-105 duration-300">
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <Link href="/dashboard" className="mt-4 text-purple-400 flex items-center hover:text-purple-300">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Level Up Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Coding Game?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already tracking and improving their coding productivity with DevsLOG.
          </p>
          <div className="max-w-md mx-auto relative">
            <div className="flex justify-center items-center">
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:from-purple-500 hover:to-indigo-500 transition-colors">
                Get Early Access
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Join the waiting list for our upcoming features and updates.
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(10px, -10px) rotate(2deg); }
          66% { transform: translate(-5px, 5px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;