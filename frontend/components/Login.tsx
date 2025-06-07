
import {useState} from "react"
import { useNavigate } from "react-router-dom";
function Login() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);



  const handleLogin = async (e: { preventDefault: () => void; }) => {// typescript issue
    e.preventDefault(); // Stop page reload

    const userData = {
      email:email,
      password:password
    }

    try {
          const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",//telling it is json
      },
      body: JSON.stringify(userData), //turn JS object inro JSON
    })

    const result = await response.json()
    console.log('Server response:', result);

    if (response.ok) {//ok = true
        alert("Logged in successfully!");
      
        setToken(result.token) //save token to state variable
        localStorage.setItem("Token", result.token)

        setEmail("");
        setPassword("");

        setTimeout(() => {
    setToken(null);
  }, 5000);


navigate("/")
      } else {
        alert(result.message || "Login failed.");
      } 
    } catch (error) {
      console.error("Error:", error)
      alert("ERROR ?!?!?!?!")
    }

  }  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center  px-4">
    <form onSubmit={handleLogin} className="w-full max-w-md  rounded-xl shadow-xl p-8 space-y-6 ">  
    <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-center">Login</h2>

                       <h2 className="block text-sm font-semibold text-white">Email</h2>
          <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Email" type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}/>
                       <h2 className="block text-sm font-semibold text-white">Password</h2>
            <input className="w-full mt-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Password" type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}/>

                <button type="submit" className="w-full bg-green-400 text-white font-semibold py-3 rounded-md hover:bg-green-500 transition">
                  Login
                </button>
    </div>
    </form>
    </div>

     {token && (
        <div>
            <h1>Your token:</h1>
            <p>{token}</p>
        </div>
     )}

    </>
  )
}

export default Login
