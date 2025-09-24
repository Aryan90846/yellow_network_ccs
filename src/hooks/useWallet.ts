import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: '0',
    connected: false,
    chainId: null,
  });

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();

          setProvider(provider);
          setSigner(signer);
          setWallet({
            address,
            balance: ethers.formatEther(balance),
            connected: true,
            chainId: Number(network.chainId),
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found! Please install MetaMask.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setWallet({
        address,
        balance: ethers.formatEther(balance),
        connected: true,
        chainId: Number(network.chainId),
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: '0',
      connected: false,
      chainId: null,
    });
    setProvider(null);
    setSigner(null);
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!signer) return null;
    
    try {
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    checkConnection();
  };

  return {
    wallet,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    signMessage,
  };
};