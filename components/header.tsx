"use client"

import Image from "next/image"
import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"
import React from "react"

export function Header() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src={"/images/wealthy-logo.png"} 
            alt="Wealthy Logo" 
            width={120} 
            height={40}
          />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
} 