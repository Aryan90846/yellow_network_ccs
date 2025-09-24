import React, { useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { CarbonCredit } from '../types';
import { useWallet } from '../hooks/useWallet';
import { useYellowNetwork } from '../hooks/useYellowNetwork';

interface CreditCardProps {
  credit: CarbonCredit;
  onTransaction: (type: 'buy' | 'sell', amount: number, price: number) => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ credit, onTransaction }) => {
  const [amount, setAmount] = useState(1);
  const [isTrading, setIsTrading] = useState(false);
  const { wallet, signer, signMessage } = useWallet();
  const { placeOrder } = useYellowNetwork(signer);

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!wallet.connected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsTrading(true);
    try {
      // Sign message for the transaction
      const message = `${type.toUpperCase()} ${amount} ${credit.symbol} carbon credits at $${credit.price} each`;
      const signature = await signMessage(message);
      
      if (signature) {
        await placeOrder(type, amount, credit.price, credit.id);
        onTransaction(type, amount, credit.price);
        alert(`${type.toUpperCase()} order placed successfully!`);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed');
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{credit.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="bg-gray-700 px-2 py-1 rounded">{credit.symbol}</span>
            {credit.verified && (
              <CheckCircle className="text-green-500" size={16} />
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">${credit.price}</p>
          <div className={`flex items-center text-sm ${credit.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {credit.priceChange24h >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{Math.abs(credit.priceChange24h)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Volume 24h</p>
          <p className="text-white font-semibold">{credit.volume24h.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Supply</p>
          <p className="text-white font-semibold">{credit.totalSupply.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-300">
          <MapPin size={14} className="mr-1" />
          <span>{credit.location}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Calendar size={14} className="mr-1" />
          <span>Vintage {credit.vintage}</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            min="1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleTrade('buy')}
            disabled={isTrading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
          >
            {isTrading ? 'Processing...' : 'Buy'}
          </button>
          <button
            onClick={() => handleTrade('sell')}
            disabled={isTrading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
          >
            {isTrading ? 'Processing...' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;