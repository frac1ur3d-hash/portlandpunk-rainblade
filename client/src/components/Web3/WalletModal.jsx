import React, { useState } from 'react';
import usePlayerStore from '../../store/playerStore.js';
import { CHAIN_NAME, CHAIN_ID } from '@shared/constants.js';
import chiptune from '../../audio/chiptune.js';

export default function WalletModal({ onClose }) {
  const address = usePlayerStore((s) => s.address);
  const isConnected = usePlayerStore((s) => s.isConnected);
  const setAddress = usePlayerStore((s) => s.setAddress);
  const punkBalance = usePlayerStore((s) => s.punkBalance);

  const [connecting, setConnecting] = useState(false);

  const connectMetaMask = async () => {
    setConnecting(true);
    chiptune.playSelect();
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          chiptune.playLevelUp();
        }
      } else {
        alert("No Web3 wallet found! Falling back to testnet runner wallet.");
        generateTestWallet();
      }
    } catch (err) {
      console.warn("Wallet connect error:", err);
      generateTestWallet();
    } finally {
      setConnecting(false);
    }
  };

  const generateTestWallet = () => {
    chiptune.playLevelUp();
    // Generate simulated Base testnet wallet address for frictionless play
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const testAddr = `0x${randomHex}`;
    setAddress(testAddr);
  };

  const disconnect = () => {
    chiptune.playSelect();
    setAddress(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 crt-overlay">
      <div className="pixel-box-pink max-w-[480px] w-full p-6 bg-[#0c0c16] flex flex-col gap-4">
        <div className="flex justify-between items-center border-b-2 border-[#202035] pb-3">
          <div className="text-[11px] text-[#ff2d55] font-bold">
            BASE L2 // WEB3 WALLET
          </div>
          <button
            onClick={onClose}
            className="pixel-btn text-[9px] px-2 py-1 text-[#ff2d55]"
          >
            [X]
          </button>
        </div>

        {/* Network Info */}
        <div className="pixel-box p-3 bg-[#111322] flex justify-between items-center text-[9px]">
          <div>
            <div className="text-[#757599]">TARGET CHAIN:</div>
            <div className="text-[#00f5ff] font-bold">{CHAIN_NAME} (ID: {CHAIN_ID})</div>
          </div>
          <div className="text-[#30d158] flex items-center gap-1">
            <span className="animate-pulse">●</span> ONLINE
          </div>
        </div>

        {isConnected ? (
          <div className="flex flex-col gap-3">
            <div className="pixel-box p-3 bg-[#111322] text-[9px] flex flex-col gap-1.5">
              <div className="text-[#757599]">CONNECTED ADDRESS:</div>
              <div className="text-white font-mono text-[8px] break-all">{address}</div>

              <div className="text-[#757599] mt-2">$PUNK BALANCE:</div>
              <div className="text-[#ffd60a] text-[12px] font-bold">
                {punkBalance.toString()} $PUNK
              </div>
            </div>

            <button
              onClick={disconnect}
              className="pixel-btn text-[9px] w-full text-[#ff2d55] border-[#ff2d55]"
            >
              DISCONNECT WALLET
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={connectMetaMask}
              disabled={connecting}
              className="pixel-btn text-[10px] w-full p-3 bg-[#ff2d55] text-white border-black font-bold hover:bg-[#ff456e]"
            >
              {connecting ? 'CONNECTING...' : '🦊 CONNECT METAMASK'}
            </button>

            <button
              onClick={generateTestWallet}
              className="pixel-btn pixel-btn-cyan text-[9px] w-full p-2.5"
            >
              ⚡ QUICK CONNECT (AUTO TESTNET WALLET)
            </button>

            <div className="text-[7px] text-[#757599] text-center mt-2 leading-relaxed">
              Gear and Relic drops will be registered directly to your connected address on Base Sepolia.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
