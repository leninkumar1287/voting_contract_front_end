import React, { useContext, useEffect, useState } from 'react';
import Web3 from "web3";
import NeoToken from "../contracts/NeoToken.json";

const defaultChainId = 1337;

export const supportedNetworks = {
    // Dummy ChainId for InitalStage its called by default
    1337: {
        name: 'Ganache Local BlockChain',
        tokenSymbol: 'ETH',
        rpcURL: 'http://localhost:7545',
        neoAddress: NeoToken.networks[1337] ? NeoToken.networks[1337].address : '',
    },
    80001: {
        name: 'Mumbai Polygon Testnet',
        tokenSymbol: 'MATIC',
        rpcURL: 'https://rpc-mumbai.maticvigil.com/',
        neoAddress: NeoToken.networks[80001] ? NeoToken.networks[80001].address : '',
    }
}

const ConnectionContext = React.createContext();

export function useConnection() {
    return useContext(ConnectionContext);
}
export function ConnectionProvider(props) {
    const [connectionState, setConnectionState] = useState({
        web3: null,
        chainId: defaultChainId,
        accounts: [],
        neoContract: null,
        error: null,
    });

    const initiate = async () => {
        try {
            // Use local web3 object by default before user connects metamask
            const provider = new Web3.providers.HttpProvider(supportedNetworks[defaultChainId].rpcURL);
            const web3 = new Web3(provider);

            const neoContract = new web3.eth.Contract(
                NeoToken.abi,
                supportedNetworks[defaultChainId].neoAddress
            );
            setConnectionState({ ...connectionState, web3, neoContract });
        } catch (e) {
            console.log("useConnection : initiate Error -> ", e.toString());
            setConnectionState({ ...connectionState, error: e.toString() });
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("Browser Wallet Not Found");
            }
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await web3.eth.net.getId();
            if (!supportedNetworks[chainId]) {
                throw new Error("Use Correct Network")
            }
            const neoContract = new web3.eth.Contract(
                NeoToken.abi,
                supportedNetworks[chainId].neoAddress
            );
            setConnectionState({ ...connectionState, web3, accounts, chainId, neoContract});
        } catch (e) {
            if (e.code === 4001) {
                // eslint-disable-next-line 
                e = 'Denied Browser Wallet Access';
            }
            console.log("useConnection : connectWallet Error -> ", e.toString());
            setConnectionState({ ...connectionState, error: e.toString() });
        }
    }

    useEffect(() => {
        initiate();

        if (window.ethereum) {
            // Detect metamask account change
            window.ethereum.on('accountsChanged', async function (_accounts) {
                connectWallet()
            })

            // Detect metamask network change
            window.ethereum.on('chainChanged', function (networkId) {
                connectWallet();
            });
        }
        // eslint-disable-next-line 
    }, []);

    return (
        <>
            <ConnectionContext.Provider value={{ connectionState, setConnectionState, connectWallet }}>
                {props.children}
            </ConnectionContext.Provider>
        </>
    );
}