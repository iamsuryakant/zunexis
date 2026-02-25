import { AnimatePresence, motion } from "framer-motion"
import ExecutionConsole from "./ExecutionConsole"

export function AnimatedConsole({ layout }: { layout: string }) {
  const isVertical = layout === "bottom"

  return (
    <AnimatePresence>
      <motion.div
        initial={
          isVertical
            ? { height: 0, opacity: 0 }
            : { width: 0, opacity: 0 }
        }
        animate={{ height: "100%", width: "100%", opacity: 1 }}
        exit={
          isVertical
            ? { height: 0, opacity: 0 }
            : { width: 0, opacity: 0 }
        }
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="h-full w-full overflow-hidden"
      >
        <ExecutionConsole />
      </motion.div>
    </AnimatePresence>
  )
}