import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "图书管理系统",
  description: "图书管理系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
