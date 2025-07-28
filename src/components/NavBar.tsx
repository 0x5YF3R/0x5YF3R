import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav
      className="fixed left-[10px] right-[10px] top-4 z-30 flex items-center justify-between px-8 py-3 rounded-md shadow-xl border border-cyber-blue/30 backdrop-blur-md"
      style={{ width: "calc(100vw - 20px)", minHeight: 56, background: "rgba(18, 24, 34, 0.75)" }}
    >
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link to="/" className="text-cyber-blue font-mono text-2xl font-bold tracking-tight drop-shadow-lg select-none hover:underline">
          0x5yf3r
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-cyber-blue font-mono text-base hover:underline hover:text-white transition-colors">Graph</Link>
        <Link to="/articles" className="text-cyber-blue font-mono text-base hover:underline hover:text-white transition-colors">Articles</Link>
        <Link to="/about" className="text-cyber-blue font-mono text-base hover:underline hover:text-white transition-colors">About</Link>
        <Link to="/contact" className="text-cyber-blue font-mono text-base hover:underline hover:text-white transition-colors">Contact</Link>
      </div>
    </nav>
  );
};

export default NavBar;