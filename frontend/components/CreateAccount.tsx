
import {useState} from "react"

function CreateAccount() {

const [accountType, setAccountType] = useState("")
const [balance, setBalance] = useState("")
const [email, setEmail] = useState("")

const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    const token = localStorage.getItem("Token")

    if (!token) {
   return alert("Please login first.");
}
  

try {
    const response = await fetch("http://localhost:3000/create-account", { // sending request backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",//telling it is json
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          balance: balance,
       account_type: accountType,
       user_email:email

      }), //turn js object inro JSON format
    })

    const result = await response.json()

    if (response.ok) {
    alert("Account creation successful!");
    console.log(result);
  } else {
    alert(result.message || "Account creation failed.");
  }
} catch (error) {
    console.log("Error:", error);
    
}


}

  return (
    <>
    <div className="min-h-screen flex items-center justify-center  px-4">
    <form onSubmit={handleSubmit} className="w-full max-w-md  rounded-xl shadow-xl p-8 space-y-6 ">  
    <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-center">Create Account</h2>

 <h2 className="block text-sm font-semibold text-white">Email</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="email" type="email"
             value={email} onChange={e => setEmail(e.target.value)}
               />

                       <h2 className="block text-sm font-semibold text-white">Account Type</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="current/savings" type="text"
             value={accountType} onChange={e => setAccountType(e.target.value)}
               />
                       <h2 className="block text-sm font-semibold text-white">Balance</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="balance" type="text"
             value={balance} onChange={e => setBalance(e.target.value)}
               />
                <button type="submit" className="w-full bg-green-400 text-white font-semibold py-3 rounded-md hover:bg-green-500 transition">
                  Create
                </button>
    </div>
    </form>
</div>

    </>
  )
}

export default CreateAccount
