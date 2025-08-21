import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// STYLES
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

// LOCALS
import "./translations.config.ts";
// Providers
import ReduxPersistProvider from '@/providers/ReduxPersistProvider.tsx';
import TanStackQueryProvider from './providers/TanStackQueryProvider.tsx';
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReduxPersistProvider>
            <Router >
                <TanStackQueryProvider>
                    <App />
                </TanStackQueryProvider>
            </Router>
        </ReduxPersistProvider>
    </StrictMode>,
);