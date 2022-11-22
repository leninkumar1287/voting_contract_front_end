import React, { useContext, useEffect, useState } from 'react';
import Web3 from "web3";
import NeoToken from "../contracts/NeoToken.json";
// import Exchange from "./contracts/Exchange.json";

const defaultChainId = 1337; 

export const supportedNetworks = {
    // Dummy ChainId for InitalStage its called by default
    123: {
        name: '',
        tokenSymbol: 'ETH',
        rpcURL: 'http://localhost:7545',
        neoAddress: NeoToken.networks[1337] ? NeoToken.networks[1337].address : '',
    },
    1337: {
        name: 'ganache',
        tokenSymbol: 'ETH',
        rpcURL: 'http://localhost:7545',
        neoAddress: NeoToken.networks[1337] ? NeoToken.networks[1337].address : '',
    },
    5: {
        name: 'goerli',
        tokenSymbol: 'ETH',
        rpcURL: 'https://goerli.infura.io/v3/',
        neoAddress: NeoToken.networks[5] ? NeoToken.networks[5].address : '',
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

            setConnectionState({ ...connectionState, web3, neoContract});
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
                // User rejected request
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
                setConnectionState({ ...connectionState, accounts: _accounts })
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

// // Set networkName for navbar
// switch (chainId) {
//     case 5777:
//         networkName = 'Truffle';
//         break
//     case 31337:
//         networkName = 'Hardhat';
//         break;
//     case 80001:
//         networkName = "Mumbai";
//         break;
//     case 4:
//         networkName = 'Rinkeby';
//         break
//     case 137:
//         networkName = 'Polygon';
//         break
//     case 1:
//         networkName = 'Ethereum';
//         break
//     case 3:
//         networkName = 'Ropsten';
//         break
//     case 42:
//         networkName = 'Kovan';
//         break
//     default:
//         networkName = 'Unknown';
// }
