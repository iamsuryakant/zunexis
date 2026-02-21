"use client"

import { Button } from "@/components/ui/button"
import { useExecutionStore } from "@/store/useExecutionStore"

export default function LayoutSwitcher() {
  const { layout, setLayout } = useExecutionStore()

  const cycleLayout = () => {
    if (layout === "bottom") setLayout("right")
    else if (layout === "right") setLayout("left")
    else setLayout("bottom")
  }

  return (
    <Button
      variant="secondary"
      onClick={cycleLayout}
      className="text-xs"
    >
      Layout: {layout}
    </Button>
  )
}