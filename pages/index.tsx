import type {NextPage} from 'next'
import RequiresAuth from "../components/RequiresAuth";
import {useAuth} from "@elrond-giants/erd-react-hooks";
import {egldLabel} from "../config";
import {useState} from "react";
 
import {Address} from "@elrondnetwork/erdjs/out";
import {querySc} from "../apis/queries";
import {contractAddress} from "../config"; 
import {useEffect} from "react";
import SendList from './sendList'
import ReceiveList from './receiveList'

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

        useEffect(() => {
            getReceive();
            return () => {
              };
        }, []);

    return (
        <RequiresAuth>
            <div className="flex justify-center w-full mt-20">
                <div className="flex flex-col items-start space-y-2 max-w-screen-md">
                    <h2 className="text-xl">Welcome to Elrond Escrow ESDTs !</h2>
                    <p>Address: {address}</p>
                    <p>Balance: {balance.toDenominatedString() + egldLabel}</p>
                    <p>Nonce: {nonce}</p>
                    <button type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                logout();
                            }}
                    >
                        Logout
                    </button>
                <SendList data = {dataSend}></SendList>
                <ReceiveList data = {dataReceive}></ReceiveList>
                </div>
            </div>
        </RequiresAuth>
    );
};

export default Home;

