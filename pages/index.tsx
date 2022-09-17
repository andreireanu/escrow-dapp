import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";
import {useAuth} from "@elrond-giants/erd-react-hooks";
import {useState} from "react";
 
import {Address} from "@elrondnetwork/erdjs/out";
import {querySc} from "../apis/queries";
import {contractAddress} from "../config"; 
import {useEffect} from "react";
import SendList from './sendList'
import ReceiveList from './receiveList'
import CreateOffer from './createOffer'
import Button from 'react-bootstrap/Button';

const Home: NextPage = () => {

    const {address, logout, env, balance, nonce} = useAuth();
    const [dataSend, setDataSend] = useState<any | null>([]);
    const [dataReceive, setDataReceive] = useState<any | null>([]);

    const getSend = async () => {
        const data = await querySc(
            contractAddress as string,
            "getSendData",
            {
                args: [new Address(address!).hex()],
                outputType: "query",
            });    
        if (data.data.returnData) {
            data.data.returnData.map( (record: any)  => {
                setDataSend(   
                    ( (prev: any) => {
                        return [...prev, String(record)]
                    })
                )
            });
        };
        };

    useEffect(() => {
            getSend();
            return () => {
              };
        }, []);
     

    const getReceive = async () => {
        const data = await querySc(
            contractAddress as string,
            "getReceiveData",
            {
                args: [new Address(address!).hex()],
                outputType: "query",
            });    
        if (data.data.returnData) {
            data.data.returnData.map( (record: any)  => {
                setDataReceive(   
                    ( (prev: any) => {
                        return [...prev, String(record)]
                    })
                )
            });
        };
        };        

    // useEffect(() => {
    // const intervalId = setInterval(() => { 
    //     // getReceive();
    //     console.log('Running else');
    //     return () => {
    //         };
    //     }, 10000)
    //     return () =>  {
    //     clearInterval(intervalId);
    //     }
    // }, []);

    useEffect(() => {
        getReceive();
        return () => {
            };
        }, []);

    return (
        <RequiresAuth  >
            <style jsx global>{`
                body {
                    background: ${"Snow"};
                }
                `}
            </style>
            <div className="justify-end items-baseline" style={{ display: 'flex'}}>
                <p className="text-lg mt-3 pr-4 font-semibold">
                    {address}</p>
                <Button className="mt-3 mr-4" variant="primary" onClick={() => {
                                    logout();
                                }}>Logout
                </Button>
            </div>
            <div className="flex justify-center w-full mt-20">
                <div style={{ width: '45rem'}} className="flex flex-col items-start space-y-2 max-w-screen-md">
                    <h2 className="text-xxl">Welcome to Elrond Escrow!</h2>
                    <h6 className="pb-2">
                        Swap Elrond ESDT Tokens by creating offers directly to peer wallets. All for FREE, only network fees apply.
                        Once created, offers by you and for you will appear on this page.
                    </h6>
                <CreateOffer address={address}></CreateOffer>
                <SendList data = {dataSend}></SendList>
                <ReceiveList data = {dataReceive}></ReceiveList>
                </div>
            </div> 
        </RequiresAuth>
    );
};

export default Home;

