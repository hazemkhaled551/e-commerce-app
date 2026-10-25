export function TrustIndicators() {
  return (
    <div className="mt-space-lg flex flex-wrap justify-center items-center gap-space-xl text-on-surface-variant text-body-sm font-body-sm">
      <div className="flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-[16px] text-tertiary-container">
          fingerprint
        </span>
        <span>Hardware WebAuthn Ready</span>
      </div>
      <div className="flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-[16px] text-tertiary-container">
          encrypted
        </span>
        <span>TLS 1.3 Strict Cipher</span>
      </div>
      <div className="flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-[16px] text-tertiary-container">
          lock_clock
        </span>
        <span>Adaptive Anomaly Defense</span>
      </div>
    </div>
  )
}
