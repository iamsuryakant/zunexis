"use client"

import dynamic from "next/dynamic"

const IDELayout = dynamic(
  () => import("./IDELayout"),
  { ssr: false }
)

export default function IDEClient() {
  return (
    <div className="h-full w-full">
      <IDELayout />
    </div>
  )
}