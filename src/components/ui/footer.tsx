// src/components/ui/Footer.tsx

import { SiReact, SiVite, SiTailwindcss } from "react-icons/si";

export default function Footer() {
  const iconSize = 28;

  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="mb-4 md:mb-0 text-sm">&copy; {new Date().getFullYear()} Ichishin. All rights reserved.</p>

        <div className="flex space-x-4">
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <SiReact size={iconSize} />
          </a>
          <a
            href="https://vitejs.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            <SiVite size={iconSize} />
          </a>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors"
          >
            <SiTailwindcss size={iconSize} />
          </a>
        </div>
      </div>
    </footer>
  );
}