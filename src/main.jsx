import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import Loginpage from './Loginpage.jsx'
import Nav from './Nav.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App/>
    <Home/>
    <Loginpage/>
    <Nav/>
  </StrictMode>,
)
