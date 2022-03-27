import './App.css';
import "tailwindcss/tailwind.css";
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './utils/Counter.json';

const contractAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b'; // 合约地址
const contractABI = abi.abi;

function App() {

  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null); // 钱包地址

  // 检查是否连接
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        console.log("metamask is available");
      } else {
        console.log("please install metamask");
      }

      const accounts = await ethereum.request({
        method: "eth_accounts"
      });

      if(accounts.length!==0) {
        const account = accounts[0];
        console.log('found account with address', account);
        setAccount(account);
      } else {
        console.log("no authorized account found");
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected().then(() => {
      getCount();
    }) // 初次加载检查是否连接metamask
  }, [])
  

  async function connectWallet() {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        alert("pelase install metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      setAccount(accounts[0])
      getCount()
      
    } catch (error) {
      console.log(error);
    }
  }

  const sayhi = useCallback(
    async () => {
      try {
        const { ethereum } = window;
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let tx = await CounterContract.add();
          await tx.wait();
          await getCount();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [window.ethereum],
  )

  const getCount = useCallback(
    async () => {
      try {
        const { ethereum } = window;
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
          const newCount = await CounterContract.getCounts();
          console.log(newCount.toNumber());
          setCount(newCount.toNumber());
        }
      } catch (error) {
        console.log(error);
      }
    },
    [],
  )
  

  return (
    <div className="w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center"> 
      <h1 className='text-8xl font-bold text-white text-shadow text-center'>
        Hello,web3!
      </h1>
     {
       account ? 
       <>
        <h2 className='text-6xl text-center mt-24 text-yellow-300 font-bold'>
          🙋 {count}
        </h2>

        <h3 className='text-4xl text-center mt-12 text-white font-bold'>
          account：
          <strong>
            {account.substring(0, 4)}...{account.substring(account.length-4, account.length)}
          </strong>
        </h3>

        <button
          onClick={() => sayhi()}
          className="rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition">
          Say Hi
        </button>
       </>:
       <button
        onClick={() => connectWallet()}
        className='rounded-full py-6 px-12 text-3xl mt-24 text-white bg-purple-700 hover:scale-100 transition'>
         Connect Wallet
       </button>
     }
    </div>
  );
}

export default App;
