import React, { useState, useEffect } from 'react';
import { Leaf, Activity, BarChart3, History } from 'lucide-react';
import WalletConnect from './components/WalletConnect';
import CreditCard from './components/CreditCard';
import Portfolio from './components/Portfolio';
import TransactionHistory from './components/TransactionHistory';
import Analytics from './components/Analytics';
import { useWallet } from './hooks/useWallet';
import { useYellowNetwork } from './hooks/useYellowNetwork';
import { mockCarbonCredits, generateMockTransactions, mockPortfolio } from './data/mockData';
import { Transaction } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { wallet, signer } = useWallet();
  const { yellowState } = useYellowNetwork(signer);

  useEffect(() => {
    // Initialize with mock data
    setTransactions(generateMockTransactions());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newTransaction: Transaction = {
          id: `tx_${Date.now()}`,
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          amount: Math.floor(Math.random() * 100) + 1,
          price: Math.random() * 30 + 10,
          timestamp: Date.now(),
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: 'confirmed',
          from: `0x${Math.random().toString(16).substr(2, 40)}`,
          to: `0x${Math.random().toString(16).substr(2, 40)}`,
        };
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTransaction = (type: 'buy' | 'sell', amount: number, price: number) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type,
      amount,
      price,
      timestamp: Date.now(),
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: 'pending',
      from: wallet.address || '',
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Simulate confirmation after 3 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'confirmed' as const }
            : tx
        )
      );
    }, 3000);
  };

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: Leaf },
    { id: 'portfolio', label: 'Portfolio', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Leaf className="text-green-400" size={32} />
            <div>
              <h1 className="text-2xl font-bold">CarbonTrade</h1>
              <p className="text-sm text-gray-400">Decentralized Carbon Credit Trading</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {yellowState.connected && (
              <div className="text-sm bg-green-900 px-3 py-2 rounded-lg">
                <p className="text-green-300">Yellow Network</p>
                <p className="text-white font-semibold">${yellowState.balance}</p>
              </div>
            )}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 px-6 py-3 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'marketplace' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Carbon Credit Marketplace</h2>
              <p className="text-gray-400">Trade verified carbon credits on the Yellow Network</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockCarbonCredits.map((credit) => (
                <CreditCard
                  key={credit.id}
                  credit={credit}
                  onTransaction={handleTransaction}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Portfolio</h2>
              <p className="text-gray-400">Track your carbon credit investments</p>
            </div>
            
            <Portfolio portfolio={mockPortfolio} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Trading Analytics</h2>
              <p className="text-gray-400">Monitor market trends and trading performance</p>
            </div>
            
            <Analytics transactions={transactions} />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Transaction History</h2>
              <p className="text-gray-400">View all your trading activity</p>
            </div>
            
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;