"use client";

import ZunexisLogo from "@/components/shared/ZunexisLogo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";

export default function ZunexisHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/50 supports-[backdrop-filter]:bg-background/40">

      <div className="flex h-14 md:h-16 items-center justify-between px-6 md:px-10">

        <ZunexisLogo />

        <div className="flex items-center gap-4">

          <ThemeToggle />

          <Link
            href="https://github.com/iamsuryakant/zunexis"
            target="_blank"
            className="flex items-center justify-center rounded-md p-2 opacity-70 hover:opacity-100 hover:bg-muted/40 transition-all duration-200"
          >
            <IconBrandGithub className="h-4 w-4 md:h-5 md:w-5" />
          </Link>

        </div>
      </div>

      <div className="h-px bg-border/60" />

    </header>
  );
}