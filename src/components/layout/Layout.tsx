import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 shadow-xl overflow-hidden flex flex-col relative w-full h-[100dvh]">
      {children}
    </div>
  );
};
