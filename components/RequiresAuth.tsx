import {useAuth} from "@elrond-giants/erd-react-hooks";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {authPath} from "../utils/routes";

export default function RequiresAuth({children}: { children: any }) {
    const {authenticated} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (authenticated) {
            return;
        }

        (async () => {
            await router.replace(authPath);
        })();
    }, [authenticated, router]);

    if (authenticated) {
        return <>{children}</>
    }
    return <div className="flex flex-column justify-center align-center items-center">   
            <div className="mt-20 spinner-border animate-spin  block w-8 h-8 border-4 rounded-full" role="status">
            </div>
            <div>&nbsp;Loading</div>

    </div>
};
