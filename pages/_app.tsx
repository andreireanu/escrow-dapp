import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";
import Notifications from "../components/Notifications";
import { AuthContextProvider } from "@elrond-giants/erd-react-hooks";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

console.log(process.env.NEXT_PUBLIC_NETWORK_API_ADDRESS);
console.log(process.env.NEXT_PUBLIC_NODE_ENV);
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ReduxProvider store={store} >
            <AuthContextProvider env={process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "mainnet" : "devnet"}>
                <Component {...pageProps} />
                <Notifications />
            </AuthContextProvider>
        </ReduxProvider>
    );
}

export default MyApp
