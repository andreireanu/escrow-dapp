import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";
import { useAuth } from "@elrond-giants/erd-react-hooks";
import {useState} from "react";

import { Address } from "@multiversx/sdk-core";
import { querySc } from "../apis/queries";
import { contractAddress } from "../config";
import { useEffect, useRef } from "react";
import SendList from './sendList'
import ReceiveList from './receiveList'
import CreateOffer from './createOffer'
import Button from 'react-bootstrap/Button';
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import Box from '@mui/material/Box';
import GetTokens from './getTokens'
import Image from 'next/image'


// import Dashboard from './Dashboard/Dashboard'

const myLoader = ({ src }: { src: string }) => {
    return `/logos/${src}.png`
}


const Home: NextPage = () => {

    const {address, logout, env, balance, nonce} = useAuth();
    const [dataSend, setDataSend] = useState<String[]>([]);
    const [dataReceive, setDataReceive] = useState<String[]>([]);
    const [clipboardDisplay, setClipboardDisplay] = useState(true);
    const ref: any = useRef();
    let initialDelay = 500;
    let refreshInterval = 20000;

    const getSend = async () => {
        const data = await querySc(
            contractAddress as string,
            "getSendData",
            {
                args: [new Address(address!).hex()],
                outputType: "query",
            });  
        console.log("DATA:");
        console.log(data);  
        setDataSend([]);
        if (data.data.returnData) {
            data.data.returnData.map((record: any) => {
                setDataSend(
                    ((prev: any) => {
                        return [...prev, String(record)]
                    })
                )
            });
        };
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            getSend();
            return () => {
            };
        }, refreshInterval)
        return () => {
            clearInterval(intervalId);
        }
    }, []);


    useEffect(() => {
        const timeout = setTimeout(() => {
            getSend();
        }, initialDelay)
        return () => clearTimeout(timeout);
    }, []);


    const getReceive = async () => {
        const data = await querySc(
            contractAddress as string,
            "getReceiveData",
            {
                args: [new Address(address!).hex()],
                outputType: "query",
            });
        setDataReceive([]);
        if (data.data.returnData) {
            data.data.returnData.map((record: any) => {
                setDataReceive(
                    ((prev: any) => {
                        return [...prev, String(record)]
                    })
                )
            });
        };
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            getReceive();
            return () => {
            };
        }, refreshInterval)
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getReceive();
        }, initialDelay)
        return () => clearTimeout(timeout);
    }, []);

    function onHandleClick() {
        navigator.clipboard.writeText(ref.current.outerText);
        setClipboardDisplay(false);
        setTimeout(() => {
            setClipboardDisplay(true);
        }, 1000);
    }

    return (
        <RequiresAuth  >
            <style jsx global>{`
                body {
                    background: ${"Snow"};
                    font-family: 'Fira Sans Book';
                }
                `}
            </style>
            <div className="flex flex-col h-screen" style={{ minWidth: '47rem', minHeight: '100%' }}  >
                <div className="flex flex-row justify-between align-baseline" >
                    <div >
                        <Image
                            loader={myLoader}
                            src={'LOGO_HD'}
                            width={140}
                            height={100} alt=""
                            priority={true}
                        />
                    </div>
                    <div className="justify-end items-baseline" style={{ display: 'flex' }}>
                        <div style={{ display: 'none' }} ref={ref}>{address}</div>
                        <Box style={{ backgroundColor: 'white' }} className="flex items-center rounded-md border-4 mr-2 whitespace-pre-wrap" >
                            <div>
                                <p className="m-1"> {address !== null ? address.slice(0, 6) + '...' + address.slice(-5) + ' ' : null}</p>
                            </div>
                            <div>
                                <BsClipboard style={{ display: clipboardDisplay ? 'flex' : 'none' }} className="mr-2 align-baseline" onClick={onHandleClick} />
                            </div>
                            <div>
                                <BsClipboardCheck style={{ display: clipboardDisplay ? 'none' : 'flex' }} className="mr-2 align-baseline" />
                            </div>
                        </Box>
                        <Button className="mt-3 mr-4 " variant="primary" onClick={() => {
                            logout();
                        }}>Logout
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center w-full mt-10">
                    <div style={{ width: '45rem' }} className="flex flex-col items-start space-y-2 max-w-screen-md">
                        <h2 className="text-xxl font-semibold">Welcome to MultiversX Peer Pact! </h2>
                        <h2 style={{ color: 'red' }} >(TESTNET VERSION)</h2>
                        <h6 className="pb-2 text-base text-justify font-semibold">
                            Swap MultiversX ESDT Tokens by creating offers directly to peer wallets. All for FREE, only network fees apply.
                            Once created, offers by you and for you will appear on this page.
                            You can always remove the offers you've added. Good luck negotiating those trades! <br></br>
                        </h6>
                        {/* <Dashboard> </Dashboard> */}
                        <GetTokens></GetTokens>
                        <CreateOffer address={address}></CreateOffer>
                        <SendList data={dataSend}></SendList>
                        <ReceiveList data={dataReceive}></ReceiveList>
                    </div>
                </div>

                <footer style={{ minWidth: '47rem' }}>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400 bottom-0">
                        <div className="flex flex-col justify-center w-full mt-3 text-xs">
                            <div className="self-center">
                                Made with&nbsp;
                                <svg style={{ height: 14, width: 18 }} className="inline"
                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="red" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" ></path>
                                </svg>
                                &nbsp;by&nbsp;<a href="https://t.me/andreiope">Andrei</a>
                            </div>
                            <div className="self-center text-center">This is a free service, please consider making donations  <span style={{ color: 'blue' }} > @peerpact </span> herotag</div>
                            <div className="self-center mb-3 text-center">This dApp uses open-source code provided by the wonderful <a href="https://elrondgiants.com/">Elrond Giants</a> team</div>
                        </div> 
                    </span>
                </footer>
            </div> 
        </RequiresAuth>
    );
};

export default Home;

