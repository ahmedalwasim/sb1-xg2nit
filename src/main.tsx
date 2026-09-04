import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppDataProvider } from './store/AppDataContext'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
