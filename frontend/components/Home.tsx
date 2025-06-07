import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

// Define the structure of account object to type script
type Account = {
  _id: string;
  balance: number;
  account_type: string;
  user_email: string;
};


function Home() {
    const [accounts, setAccounts] = useState<Account[]>([])//for type script



    useEffect(() => {// runs only one time []
        const fetchAccount = async () => {
            const token = localStorage.getItem("Token")

            if (!token) {
                return alert("no token found, Please log in.")
            }

            try {
                const response = await fetch("http://localhost:3000/account", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        const result = await response.json()
console.log("API response:", result);
           if (response.ok) {
          setAccounts(result.accounts)
        } else {
          console.log(result.message || "Failed to fetch account details.")
        }
            } catch (error) {
                console.log("Error fetching account:", error);
                
            }

        }


        fetchAccount()// cannot use async?
    }, [])// only run one time

  return (
    <>
    <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-center">HOME</h2>
 

{accounts.length > 0 ? (
  <div className="flex flex-col gap-4">
    <h2 className="block text-sm font-semibold text-white">Your Account Details:</h2>
    {accounts.map((acc) => (
      <div key={acc._id} className="border p-4 rounded ">
        <p>ID: {acc._id}</p>
        <p>Type: {acc.account_type}</p>
        <p>Balance: ₹{acc.balance}</p>
        <p>Email: {acc.user_email}</p>
      </div>
    ))}
  </div>
) : (
  <p>Go Login.</p> // 👈 fallback (else)
)}
        </div>

    </>
        )
}

export default Home
