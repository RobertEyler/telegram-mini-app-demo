import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {OKXUniversalProvider} from "@okxconnect/universal-provider";

const OkxContext = createContext<OKXUniversalProvider | null>(null);

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
    useEffect(() => {
        OKXUniversalProvider.init(props.opts).then(res => setOKXUniversalProvider(res));
    }, []);
    return (
        <OkxContext.Provider value={oKXUniversalProvider}>
            {
                props.children
            }
        </OkxContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOkx = ():OKXUniversalProvider|null=>{
    return useContext<OKXUniversalProvider|null>(OkxContext);
}

export default OkxProvider;