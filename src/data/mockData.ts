import { CarbonCredit, Transaction, Portfolio } from '../types';

export const mockCarbonCredits: CarbonCredit[] = [
  {
    id: 'VCS001',
    name: 'Amazon Rainforest Conservation',
    symbol: 'AMZN',
    price: 25.50,
    priceChange24h: 2.3,
    volume24h: 45000,
    totalSupply: 1000000,
    verified: true,
    project: 'Amazon Conservation Alliance',
    location: 'Brazil',
    vintage: 2023,
  },
  {
    id: 'GS002',
    name: 'Solar Farm Project Kenya',
    symbol: 'SOLR',
    price: 18.75,
    priceChange24h: -1.2,
    volume24h: 32000,
    totalSupply: 750000,
    verified: true,
    project: 'Kenya Solar Initiative',
    location: 'Kenya',
    vintage: 2023,
  },
  {
    id: 'CAR003',
    name: 'Wind Power California',
    symbol: 'WIND',
    price: 32.10,
    priceChange24h: 4.5,
    volume24h: 28000,
    totalSupply: 600000,
    verified: true,
    project: 'Pacific Wind Farms',
    location: 'California, USA',
    vintage: 2024,
  },
  {
    id: 'VER004',
    name: 'Reforestation Indonesia',
    symbol: 'TREE',
    price: 15.30,
    priceChange24h: 1.8,
    volume24h: 55000,
    totalSupply: 2000000,
    verified: true,
    project: 'Indonesia Forest Restoration',
    location: 'Indonesia',
    vintage: 2023,
  },
];

export const generateMockTransactions = (): Transaction[] => {
  const types: Array<'buy' | 'sell' | 'transfer'> = ['buy', 'sell', 'transfer'];
  const statuses: Array<'pending' | 'confirmed' | 'failed'> = ['confirmed', 'confirmed', 'confirmed', 'pending'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `tx_${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 500) + 10,
    price: Math.random() * 30 + 10,
    timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
  }));
};

export const mockPortfolio: Portfolio = {
  totalValue: 12450.75,
  totalCredits: 1250,
  totalOffset: 850,
  positions: [
    {
      creditId: 'VCS001',
      amount: 400,
      avgPrice: 24.20,
      currentValue: 10200,
      pnl: 520,
      pnlPercent: 5.4,
    },
    {
      creditId: 'GS002',
      amount: 300,
      avgPrice: 19.10,
      currentValue: 5625,
      pnl: -105,
      pnlPercent: -1.8,
    },
    {
      creditId: 'CAR003',
      amount: 200,
      avgPrice: 30.50,
      currentValue: 6420,
      pnl: 320,
      pnlPercent: 5.2,
    },
  ],
};