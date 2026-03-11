const QFC_PRICE_USD = 12.5;

export function formatQfc(amount: number): string {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} QFC`;
}

export function formatUSD(qfcAmount: number): string {
  const usd = qfcAmount * QFC_PRICE_USD;
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatToken(amount: number, symbol: string): string {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${symbol}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(2);
}
