"use client";

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  tokenSymbol: string;
  tokenIcon?: string;
  balance?: number;
  priceUSD?: number;
  onMax?: () => void;
}

export default function TokenInput({
  label,
  value,
  onChange,
  tokenSymbol,
  tokenIcon,
  balance,
  priceUSD,
  onMax,
}: TokenInputProps) {
  const numVal = parseFloat(value) || 0;
  const usdEstimate = priceUSD ? numVal * priceUSD : null;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-gray-400">{label}</label>
        {balance !== undefined && (
          <span className="text-xs text-gray-500">
            Balance: {balance.toLocaleString()} {tokenSymbol}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-xl font-medium text-white placeholder-gray-600 outline-none"
        />
        <div className="flex items-center gap-2">
          {onMax && (
            <button
              onClick={onMax}
              className="rounded-md bg-cyan-500/20 px-2 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/30"
            >
              MAX
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-white">
            {tokenIcon && <span>{tokenIcon}</span>}
            {tokenSymbol}
          </div>
        </div>
      </div>
      {usdEstimate !== null && (
        <p className="mt-2 text-xs text-gray-500">
          ≈ ${usdEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
