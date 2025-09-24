import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  if (wallet.connected) {
    return (
      <div className="flex items-center space-x-4 bg-gray-800 px-4 py-2 rounded-lg">
        <div className="text-sm">
          <p className="text-gray-300">Connected</p>
          <p className="font-mono text-green-400">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </p>
        </div>
        <div className="text-sm text-right">
          <p className="text-gray-300">Balance</p>
          <p className="font-semibold text-white">
            {parseFloat(wallet.balance).toFixed(4)} ETH
          </p>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors font-semibold"
    >
      <Wallet size={20} />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletConnect;