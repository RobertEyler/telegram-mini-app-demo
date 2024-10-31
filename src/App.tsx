import {useEffect, useState} from "react";
import WebApp from "@twa-dev/sdk";
import {useOkx} from "./okx/okxProvider.tsx";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean
}


export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const {
      okxProvider,
      isConnect,
      session,
      toConnect,
      toDisConnect,
      okxSolanaProvider
  } = useOkx();
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  const signMessage = async ()=>{
      console.log(okxProvider?.getUniversalProvider())
        console.log(okxProvider?.rpcProviders)
      const result:unknown = await okxSolanaProvider!.signMessage("hello word!", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp")
      console.log(result);
      // setSignMsg(result)
  }

  return (
      <div className="p-4">
          {
              userData ? <>
                  <h1 className={"text-2xl font-bold mb-4"}>User Data</h1>
                  <ul>
                      <li>ID:{userData?.id}</li>
                      <li>First Name:{userData?.first_name}</li>
                  </ul>
              </> : <div>
                  Loading...
              </div>
          }
          {
              isConnect?<button onClick={toDisConnect} className={"btn btn-primary"}>断开</button>:
                  <button onClick={toConnect} className={"btn btn-primary"}>连接</button>
          }
          {
              okxSolanaProvider!=null?(
                  <div>
                      <button onClick={signMessage} className={"btn-primary btn"}>签名</button>
                  </div>
              ):null
          }
          {
              session!=null?(<>
                  <div>{JSON.stringify(session)}</div>
              </>):null
          }

      </div>
  );
}

