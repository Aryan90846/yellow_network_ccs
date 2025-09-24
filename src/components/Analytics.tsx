import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Transaction } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(tx => 
        new Date(tx.timestamp).toISOString().split('T')[0] === date
      );
      
      const volume = dayTransactions.reduce((sum, tx) => sum + (tx.amount * tx.price), 0);
      const trades = dayTransactions.length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        volume: volume,
        trades: trades,
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const confirmed = transactions.filter(tx => tx.status === 'confirmed');
    const totalVolume = confirmed.reduce((sum, tx) => sum + (tx.amount * tx.price), 0);
    const avgTradeSize = confirmed.length > 0 ? totalVolume / confirmed.length : 0;
    const buyOrders = confirmed.filter(tx => tx.type === 'buy').length;
    const sellOrders = confirmed.filter(tx => tx.type === 'sell').length;

    return {
      totalVolume,
      avgTradeSize,
      totalTrades: confirmed.length,
      buyRatio: confirmed.length > 0 ? (buyOrders / confirmed.length) * 100 : 0,
    };
  }, [transactions]);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Trading Analytics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Total Volume</p>
          <p className="text-white text-lg font-bold">
            ${stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Avg Trade</p>
          <p className="text-white text-lg font-bold">
            ${stats.avgTradeSize.toFixed(0)}
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-white text-lg font-bold">{stats.totalTrades}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">Buy Ratio</p>
          <p className="text-white text-lg font-bold">{stats.buyRatio.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">7-Day Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Daily Trades</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="trades" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;