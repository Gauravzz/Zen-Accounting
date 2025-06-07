
import React, {useState} from "react"

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate()
  //variable state for each input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");
  const [accountType, setAccountType] = useState("");

// submit handler function
  const handleRegister = async (e: { preventDefault: () => void; }) => {//typescript issue
    e.preventDefault(); // Stop page reload

    const userData = {
      name:name, // data from use state variables to backend
      email:email,
      password:password,
      balance:balance,
      account_type:accountType
    }

    try {
          const response = await fetch("http://localhost:3000/register", { // sending request backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",//telling it is json
      },
      body: JSON.stringify(userData), //turn js object inro JSON format
    })

    const result = await response.json()
    console.log('Server response:', result);

    if (response.ok) {//ok = true
        alert("Registered successfully!");
        // Clear the form
        setName("");
        setEmail("");
        setPassword("");
        setBalance("");
        setAccountType("");

       navigate("/login")
      } else {
        alert(result.message || "Registration failed.");
      } 
    } catch (error) {
      console.error("Error:", error)
      alert("ERROR ?!?!?!?!")
    }

  }  

  return (
    <>
    <div className="min-h-screen flex items-center justify-center font-sans px-4">
    <form onSubmit={handleRegister} className="w-full max-w-md  rounded-xl shadow-xl p-8 space-y-6">  
    <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-center">Register</h2>
        <h2 className="block text-sm font-semibold text-white">Name</h2>
        <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Name" type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}/>
                       <h2 className="block text-sm font-semibold text-white">Email</h2>
          <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Email" type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}/>
                       <h2 className="block text-sm font-semibold text-white">Password</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Password" type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}/>
                       <h2 className="block text-sm font-semibold text-white">Balance</h2>
              <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Balance" type="number"
               value={balance}
               onChange={(e) => setBalance(e.target.value)}/>
               <h2 className="block text-sm font-semibold text-white">Account Type</h2>
                <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Account Type" type="text"
               value={accountType}
               onChange={(e) => setAccountType(e.target.value)}/>

                <button type="submit" className="w-full bg-green-400 text-white font-semibold py-3 rounded-md hover:bg-green-500 transition">
                  Register
                </button>
    </div>
    </form>
    </div>
    </>
  )
}

export default Register
