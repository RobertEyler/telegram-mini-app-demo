import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {OKXUniversalProvider} from "@okxconnect/universal-provider";
import {SessionTypes} from "@okxconnect/core";
import {OKXSolanaProvider} from "@okxconnect/solana-provider";
type OkxContextProps = {
    okxProvider:OKXUniversalProvider  | null,
    isConnect:boolean,
    session:SessionTypes.Struct| undefined,
    toConnect:()=>void,
    toDisConnect:()=>void,
    okxSolanaProvider:OKXSolanaProvider|undefined
}
const okxContextPropsInit = {
    okxProvider:null,
    isConnect:false,
    session:undefined,
    toConnect:()=>{},
    toDisConnect:()=>{},
    okxSolanaProvider:undefined
}
const OkxContext = createContext<OkxContextProps>(okxContextPropsInit);

type OkxProviderProps = {
    opts: {
        dappMetaData: {
            name: string;
            /**
             * URL to the dapp icon. Must be PNG, ICO, ... . SVG icons are not supported.
             * @default best quality favicon declared via <link> in the document or '' if there are no any icons in the document.
             */
            icon: string;
        }

    },
    children:ReactNode

}
const OkxProvider = (props: OkxProviderProps) => {

    const [oKXUniversalProvider, setOKXUniversalProvider] = useState<OKXUniversalProvider | null>(null);
    const [isConnect, setIsConnect] = useState(false);
    const [sesseion, setSesseion] = useState<SessionTypes.Struct| undefined>(undefined)
    const [okxSolanaProvider, setOkxSolanaProvider] = useState<OKXSolanaProvider|undefined>()
    useEffect(() => {
        OKXUniversalProvider.init(props.opts).then(res => setOKXUniversalProvider(res)).catch(err=>console.log(err));
        return ()=>{
            oKXUniversalProvider?.disconnect();
        }
    }, [props.opts]);
    const toConnect = async ()=>{
        try {
            await oKXUniversalProvider?.connect({
                namespaces: {
                    solana: {
                        chains: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", //solana mainnet
                            "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",//solana testnet
                        ],
                    }
                },
                sessionConfig: {
                    redirect: "tg://resolve"
                }
            })
        }catch (err){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (err.toString().includes("already connected error")){
                setIsConnect(true);
                setSesseion(oKXUniversalProvider!.session);
                const sp = new OKXSolanaProvider(oKXUniversalProvider!);
                setOkxSolanaProvider(sp);
            }
        }
    }
    const toDisConnect = ()=>{
        oKXUniversalProvider?.disconnect();
    }
    const sessionDeleteEvent=()=>{
        oKXUniversalProvider?.disconnect();
    }
    const disconnectEvent = ()=>{
        setIsConnect(false)
    }
    const connectEvent = (ss:SessionTypes.Struct)=>{
        setSesseion(ss)
        setIsConnect(true)
        if (oKXUniversalProvider!=null){
            const sp = new OKXSolanaProvider(oKXUniversalProvider);
            setOkxSolanaProvider(sp);
        }

    }
    useEffect(() => {
        if (oKXUniversalProvider==null){
            return;
        }
        oKXUniversalProvider.on("connect",connectEvent)
        oKXUniversalProvider.on("disconnect",disconnectEvent)
        oKXUniversalProvider.on("session_delete",sessionDeleteEvent)
        return ()=>{
            oKXUniversalProvider.off("session_delete",sessionDeleteEvent);
            oKXUniversalProvider.on("disconnect",disconnectEvent)
        }
    }, [oKXUniversalProvider]);
    return (
        <OkxContext.Provider value={{
            okxProvider:oKXUniversalProvider,
            isConnect:isConnect,
            session:sesseion,
            toConnect:toConnect,
            toDisConnect:toDisConnect,
            okxSolanaProvider:okxSolanaProvider
        }}>
            {
                props.children
            }
        </OkxContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOkx = ():OkxContextProps=>{
    return useContext<OkxContextProps>(OkxContext);
}

export default OkxProvider;