
import {useState, useEffect} from "react"

function TransferBalance() {

const [senderId, setSenderId] = useState("")
const [recevierId, setrecevierId] = useState("")
const [amount, setAmount] = useState("")

const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    const token = localStorage.getItem("Token")

    if (!token) {
   return alert("Please login first.");
}
  

try {
    const response = await fetch("http://localhost:3000/transfer", { // sending request backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",//telling it is json
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        sender_id: senderId,
      recevier_id: recevierId,
      amount: Number(amount),
      }), //turn js object inro JSON format
    })

    const result = await response.json()

    if (response.ok) {
    alert("Transfer successful!");
    console.log(result);
  } else {
    alert(result.message || "Transfer failed.");
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
        <h2 className="text-3xl font-extrabold text-center">Tansfer Balance</h2>

                       <h2 className="block text-sm font-semibold text-white">Sender id</h2>
          <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Sender Account" type="password"
               value={senderId} onChange={e => setSenderId(e.target.value)}
               />
                       <h2 className="block text-sm font-semibold text-white">Recevier id</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Recevier Account" type="password"
             value={recevierId} onChange={e => setrecevierId(e.target.value)}
               />
                       <h2 className="block text-sm font-semibold text-white">Amount</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder=" Amount" type="password"
             value={amount} onChange={e => setAmount(e.target.value)}
               />
                <button type="submit" className="w-full bg-green-400 text-white font-semibold py-3 rounded-md hover:bg-green-500 transition">
                  Transfer
                </button>
    </div>
    </form>
</div>

    </>
  )
}

export default TransferBalance
