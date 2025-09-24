import React from 'react';
import { Clock, Check, X, ExternalLink } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <Check className="text-green-400" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={16} />;
      case 'failed':
        return <X className="text-red-400" size={16} />;
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'buy':
        return 'text-green-400';
      case 'sell':
        return 'text-red-400';
      case 'transfer':
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(tx.status)}
                <span className={`font-semibold ${getTypeColor(tx.type)} capitalize`}>
                  {tx.type}
                </span>
                <span className="text-gray-300">
                  {tx.amount} credits @ ${tx.price.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  ${(tx.amount * tx.price).toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span className="font-mono">
                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
              </span>
              <div className="flex items-center space-x-2">
                <span className="capitalize px-2 py-1 bg-gray-600 rounded text-xs">
                  {tx.status}
                </span>
                <button className="hover:text-green-400 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;