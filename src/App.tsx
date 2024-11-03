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
    const [signData, setSignData] = useState<Uint8Array|undefined>()
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
      const result = await okxSolanaProvider!.signMessage("hello word!")
      console.log(result);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setSignData(result["signature"] as Uint8Array)
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
          <div className={"text-primary"}>测试时请将okx升级到最新版</div>
          {
              isConnect ? <button onClick={toDisConnect} className={"btn btn-primary"}>断开</button> :
                  <button onClick={toConnect} className={"btn btn-primary"}>连接</button>
          }
          {
              okxSolanaProvider != null ? (
                  <div>
                      <button onClick={signMessage} className={"btn-primary btn"}>签名</button>
                  </div>
              ) : null
          }
          {
              isConnect ? (<>
                  <div>已连接</div>
              </>) : null
          }
          {
              signData && <div>
                  <div className={"text-bg-dark"}>
                      签名成功：
                  </div>
                  <div>
                      {signData}
                  </div>
              </div>
          }
          <div>
              以下数据为测试授权使用
          </div>
          <div>
              {
                  JSON.stringify(WebApp.initDataUnsafe)
              }
          </div>
          <div>
              {
                  WebApp.initData
              }
          </div>

      </div>
  );
}

