import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";
import Notifications from "../components/Notifications";
import { AuthContextProvider } from "@elrond-giants/erd-react-hooks";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ReduxProvider store={store} >
            <AuthContextProvider env={process.env.NEXT_PUBLIC_NETWORK_ID === "production" ? "mainnet" : "testnet"}>
                <Component {...pageProps} />
                <Notifications />
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
