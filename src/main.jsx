import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import config from './config.json'

import TagManager from 'react-gtm-module'
 
const tagManagerArgs = { gtmId: config.GTM_CODE }

const base_url = window.location.origin;

if (base_url.indexOf('127.0.0.1') < 0 || config.useGTMLocalhost) TagManager.initialize(tagManagerArgs)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)