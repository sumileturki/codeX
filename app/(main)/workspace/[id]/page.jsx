"use client";
import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Workspace() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className='p-3 pr-10 mt-3'
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 102, 255, 0.2), rgba(0, 0, 0, 0.99))`,
      }}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
        <ChatView />
        <div className='col-span-2'>
          <CodeView />
        </div>
      </div>
    </motion.div>
  );
}

export default Workspace;
