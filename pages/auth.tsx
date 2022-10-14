import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {homePath} from "../utils/routes";
import {useRouter} from "next/router";
import MaiarLoginPopup from "../components/MaiarLoginPopup";
import {useAuth} from "@elrond-giants/erd-react-hooks";
import {AuthProviderType} from "@elrond-giants/erdjs-auth/dist/types";
import * as config from "../config";
// @ts-ignore
import QRCode from 'qrcode';
import Image from 'next/image'

const myLoader = ({ src } : { src : string}) => {
    return `/logos/${src}.png`
  }

const Auth: NextPage = () => {
    const {authenticated, login, getLedgerAccounts} = useAuth();
    const router = useRouter();
    const [maiarAuthUri, setMaiarAuthUri] = useState('');
    const [authQrCode, setAuthQrCode] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [ledgerAccounts, setLedgerAccounts] = useState<string[]>([]);

    useEffect(() => {
        setShowPopup(!!(authQrCode && isPopupOpen));
    }, [authQrCode, isPopupOpen])

    useEffect(() => {
        if (!authenticated) {
            return;
        }

        (async () => {
            await router.replace(homePath);
        })();

    }, [router, authenticated]);

    const maiarClickHandler = async () => {
        const uri = await login(AuthProviderType.MAIAR);
        const qrCode = await QRCode.toString(uri, {type: "svg"});
        const authUri = `${config.walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`;
        setAuthQrCode(qrCode);
        setMaiarAuthUri(authUri);
        setIsPopupOpen(true);
    };

    const webClickHandler = async () => {
        await login(AuthProviderType.WEBWALLET);
    };

    const extensionClickHandler = async () => {
        try {
            await login(AuthProviderType.EXTENSION);
          } catch (error) {
            console.error(error);
          }
    }

    const ledgerClickHandler = async () => {
        const accounts = await getLedgerAccounts();
        setLedgerAccounts(accounts);
    }

    const loginWithLedger = async (accountIndex: number) => {
        await login(AuthProviderType.LEDGER, {ledgerAccountIndex: accountIndex});
    }

    return (
        <>  <style jsx global>{`
                    body {
                        background: ${"Snow"};
                        font-family: 'Fira Sans Book';
                    }
                    `}
                </style>
            <div className="flex flex-col items-center justify-center space-y-4 min-h-half-screen pt-16" style={{ minWidth: '47rem' }}>
                <Image
                        loader={myLoader}
                        src = {'LOGO_HD'}
                        width={350}
                        height={248}
                        />
                <h2 className="text-4xl text-center" style={{ width: '40rem' }}>
                    Swap Elrond ESDT Tokens for FREE!
                </h2>
                <h3 className="text-2xl text-center" style={{ width: '40rem' }}>
                    Please connect your wallet to use the Elrond Peer Pact service
                </h3>
                <p className="text-xl">Pick a login method</p>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-[#f29a88] hover:bg-[#ec6f55] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        onClick={maiarClickHandler}
                    >
                        Maiar
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-[#c5e6d1] hover:bg-[#8bcca3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                        onClick={webClickHandler}
                    >
                        Web Wallet
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-[#b3e4ec] hover:bg-[#84c2cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                        onClick={extensionClickHandler}
                    >
                        Extension
                    </button>
                    {/* <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                        onClick={ledgerClickHandler}
                    >
                        Ledger
                    </button> */}
                    {/* <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-800 bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                        onClick={ledgerClickHandler}
                    >
                        Ledger
                    </button> */}
                </div>
                <p className="text-2xl font-bold" style={{   color: 'red'}}>TESTNET VERSION</p>
                {ledgerAccounts.length > 0 && <div className="flex items-center">
                    <span>Select ledger account</span>
                    <select
                        className="m-10"
                        onChange={(e) => loginWithLedger(parseInt(e.target.value))}
                    >
                        {ledgerAccounts.map((account, index) => (
                            <option key={account} value={index}>{account}</option>
                        ))}
                    </select>
                </div>
                }
            </div>
            <MaiarLoginPopup qrCode={authQrCode} uri={maiarAuthUri} open={showPopup}
                             setOpen={setIsPopupOpen}/>
        </>
    );
}

export default Auth
