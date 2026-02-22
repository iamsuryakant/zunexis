"use client";

import ZunexisLogo from "@/components/shared/ZunexisLogo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";

export default function ZunexisHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur">
      <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
        <ZunexisLogo />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="https://github.com/iamsuryakant/zunexis"
            target="_blank"
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
          >
            <IconBrandGithub className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}