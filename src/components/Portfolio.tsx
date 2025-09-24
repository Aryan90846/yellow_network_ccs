import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Leaf, Award } from 'lucide-react';
import { Portfolio as PortfolioType } from '../types';

interface PortfolioProps {
  portfolio: PortfolioType;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Portfolio Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="text-green-400" size={20} />
            <span className="text-gray-300 ml-2">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${portfolio.totalValue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Leaf className="text-blue-400" size={20} />
            <span className="text-gray-300 ml-2">Total Credits</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {portfolio.totalCredits.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Award className="text-purple-400" size={20} />
            <span className="text-gray-300 ml-2">CO₂ Offset</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {portfolio.totalOffset.toLocaleString()} tons
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Positions</h3>
        {portfolio.positions.map((position) => (
          <div key={position.creditId} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-semibold">{position.creditId}</h4>
              <div className={`flex items-center ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {position.pnl >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span className="ml-1">{position.pnlPercent.toFixed(1)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Amount</p>
                <p className="text-white">{position.amount}</p>
              </div>
              <div>
                <p className="text-gray-400">Avg Price</p>
                <p className="text-white">${position.avgPrice}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Value</p>
                <p className="text-white">${position.currentValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">P&L</p>
                <p className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ${Math.abs(position.pnl)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;