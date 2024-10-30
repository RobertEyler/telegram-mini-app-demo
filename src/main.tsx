import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './style.scss'
import App from './App.tsx'
import OkxProvider from "./okx/okxProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <OkxProvider opts={{

            dappMetaData: {
                name: "application name",
                icon: "application icon url"
            },
        }
        }>
            <App/>
        </OkxProvider>

    </StrictMode>,
)
