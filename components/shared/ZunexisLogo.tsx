export default function ZunexisLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="32"
        height="32"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="55" fill="#0f172a" />
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="#22d3ee"
          strokeWidth="4"
          fill="none"
        />

        <path
          d="M50 40 L35 60 L50 80"
          stroke="#e2e8f0"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M70 40 L85 60 L70 80"
          stroke="#e2e8f0"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M62 38 L52 62 L60 62 L50 82 L72 54 L62 54 Z"
          fill="#22d3ee"
        />
      </svg>

      <div className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-wide text-foreground">
          Zunexis
        </span>
        <span className="text-[10px] text-slate-400 tracking-widest">
          CODE • COMPILE • EXECUTE
        </span>
      </div>
    </div>
  )
}