import './App.css'
import {Route, Routes} from "react-router-dom"
import Register from "../components/Register.tsx"
import Login from "../components/Login.tsx"
import Home from "../components/Home.tsx"
import TransferBalance from "../components/TransferBalance.tsx"
import CreateAccount from "../components/CreateAccount.tsx"
import Deposit from "../components/Deposit.tsx"
import Withdraw from "../components/Withdraw.tsx"
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDragon } from '@fortawesome/free-solid-svg-icons'

function App() {
  const navigate = useNavigate()

const navigateTo = (path: string) => {
  navigate(path);
};


  return (
    <>
    <div className='flex justify-between flex-wrap items-center gap-4.25'>
      <FontAwesomeIcon icon={faDragon} className='text-green-600 text-4xl'/>
    <h1>Zen Accounting</h1>
      
    <button onClick={() => navigateTo("/login")} className="w-24 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 p-2">Login</button>
    <button onClick={() => navigateTo("/register")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Register</button>
   <button onClick={() => navigateTo("/")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Home</button>
   <button onClick={() => navigateTo("/transfer")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Transaction</button>
   <button onClick={() => navigateTo("/create")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Create</button>
<button onClick={() => navigateTo("/deposit")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Deposit</button>
    <button onClick={() => navigateTo("/withdraw")} className="w-24 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 p-2">Withdraw</button>

    </div>
    <Routes>
      <Route path='/' element={<Home/>}/> 
  <Route path='/register' element={<Register/>}/>   
<Route path='/login' element={<Login/>}/> 
<Route path='/transfer' element={<TransferBalance/>}/> 
<Route path='/create' element={<CreateAccount/>}/> 
<Route path='/deposit' element={<Deposit/>}/> 
<Route path='/withdraw' element={<Withdraw/>}/> 
</Routes>
    </>
  )
}

export default App
