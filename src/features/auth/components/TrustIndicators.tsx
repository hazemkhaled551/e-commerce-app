import { Fingerprint, ShieldCheck, Lock } from 'lucide-react'

export function TrustIndicators() {
  return (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-on-surface-variant text-xs">
      <div className="flex items-center gap-1.5">
        <Fingerprint className="w-4 h-4 text-primary" />
        <span>Hardware WebAuthn Ready</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span>TLS 1.3 Strict Cipher</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Lock className="w-4 h-4 text-primary" />
        <span>Adaptive Anomaly Defense</span>
      </div>
    </div>
  )
}
