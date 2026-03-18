import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-8 text-center text-sm text-zinc-500 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Mooziki. Elevate every night.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
