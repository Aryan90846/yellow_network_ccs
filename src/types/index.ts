export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  price: number;
  timestamp: number;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
}

export interface CarbonCredit {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  totalSupply: number;
  verified: boolean;
  project: string;
  location: string;
  vintage: number;
}

export interface Portfolio {
  totalValue: number;
  totalCredits: number;
  totalOffset: number;
  positions: Position[];
}

export interface Position {
  creditId: string;
  amount: number;
  avgPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface WalletState {
  address: string | null;
  balance: string;
  connected: boolean;
  chainId: number | null;
}