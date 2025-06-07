import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors"

dotenv.config()

const jwt_secret = process.env.jwt_secret

const app = express()
//shortcut

const PORT = 3000

app.use(express.json())
//use json data like postman 

app.use(cors()) //communication frontend to backend if different ports??

app.get('/', (req, res) => {
    res.send('Server is running')
})
//test route

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})
//print in console if server starts

const mongoURL = process.env.mongoURL

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
//message for fail and success


const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String},
    my_accounts: [{ type: String, ref: 'Account', required: false }],
})
//Standard Mold for every user

const accountSchema = new mongoose.Schema({
    balance: {type: Number},
    account_id: {type: String},
    account_type: {type: String, required:true,  enum:['savings', 'current']},
    user_email: String // Helps in Serching Accounts for a unique email.    
})
//every account balance is linked to email

const Account = mongoose.model('Account', accountSchema)
const User = mongoose.model('User', userSchema)

function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization'] //token

    //&& first condition to met
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token not found.'})
    }

    jwt.verify(token, jwt_secret, (error, user) => {// 3 is callback for error response / user
        if (error) {
            return res.status(403).json({message: 'Invalid token.'})
        }

        req.user = user // contains userId & email
        next() //go to the route
    })

}


app.post('/register', async (req, res) => {
    try {
         const { name, email, password, balance, account_type } = req.body

    if (!name || !password || !email || balance === undefined || balance === "" || !balance || !account_type) {
        return res.status(400).json({message: 'All fields are required.' })
    }

    if (!email.includes('.')) {
        return res.status(400).json({message: 'Invalid email format.' })
    }

    if (!email.includes('@')) {
        return res.status(400).json({message: 'Email format should be correct.' })
    }

     if (password.length < 6) {
        return res.status(400).json({message: 'Password must be 6 characters long.' })
     }

    if (Number(balance) < 0) {
        return res.status(400).json({message: 'Balance must be Positive number.' })
    }

    if (!['savings', 'current'].includes(account_type)) {
        return res.status(400).json({message: 'Account type must be "savings" or "current".' })
    }

    const existingUser = await User.findOne({ email: email })

     if (existingUser) {
        return res.status(400).json({message:'User with this email already taken.'})
     }

     const hashedPassword = await bcrypt.hash(password, 10) //10 rounds of cryptions 

     const user = new User({ name, password: hashedPassword, email})    
   
     //Save user first
   await user.save()
   
   // create account with a reference to the user
     const account = new Account({balance, user_email: email, account_type: account_type})
  
     await account.save()

     //push account ID into user's my_accounts array
     user.my_accounts.push(account._id.toString())

     // Save updated user
     await user.save()

     res.status(201).json({message:'User registered successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Server error'})
    }
   

})

app.post('/login', async (req, res) => {
    try {   
         const { email, password } = req.body


    const user = await User.findOne({ email })

     if (!user) {
        return res.status(400).json({message:'Invalid email or password.'})
     }

     const isPasswordMatch = await bcrypt.compare(password, user.password)
     //hasing the input than comparing to database

     if (!isPasswordMatch) {
         return res.status(400).json({message:'Invalid email or password.'})
     }

     const token = jwt.sign(
        {userId: user._id, email: user.email},//data to store in the token
        jwt_secret,
        {expiresIn: '1h'}
     )

     res.status(200).json({message:'Login successful', token})
    } catch (error) {
        res.status(500).send('Server error')
    }
})

app.post('/account', authenticateToken, async (req, res) => {

    try {
        const user_email = req.user.email

        const accounts = await Account.find({ user_email: user_email})

        res.status(200).json({message:'Your Account Details', accounts})


    } catch (error) {
        res.status(500).json({message: 'Cusre to cow'})
    }
})

app.post('/create-account', authenticateToken, async (req, res) => {

    const user_email  = req.user.email

   const { account_type, balance } = req.body

   
   if ( !account_type || !balance || balance === "") {
    return res.status(400).json({ message: "All of the fields are required."})
   }

   if (balance < 0) {
    return res.status(400).json({ message: "Balance must be 0 or more."})
   }

   if (!["savings", "current"].includes(account_type)) {
    return res.status(400).json({ message: "Account type must be 'savings' or 'current'"})
   }

   try {
    

    const user = await User.findOne({ email: user_email })

    if (!user) {
        return res.status(400).json({ message: "User not found"})
    }

    // Create the new account
    const newAccount = new Account({balance: balance, account_type: account_type, user_email  })
   
    await newAccount.save()

    // Link account to user(saving newAccount id to user my_accounts array)
    user.my_accounts.push(newAccount._id)
    await user.save()


    // Step 5: Return success

    res.status(201).json({
        message:"New account Created Successfully.",
        account_id: newAccount._id
    })    

   } catch (error) {
    console.error("Error creating Account:", error)
    res.status(500).json({ message: "Internal Server Error." })
   }

})

app.post('/deposit', authenticateToken, async (req, res) => {
    try {

        const {deposit_id, amount} = req.body

    if (!deposit_id || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid input."})
    }

    const account = await Account.findById(deposit_id)

    if (!account) {
       return res.status(400).json({ message: "Account not found or Id is wrong."})
    }

    //add money
    account.balance +=  Number(amount)
    await account.save()

    res.json({ message: "Deposit successful.",
         account_id: account._id,
          new_balance: account.balance})
    } catch (error) {
      res.status(500).send({message: 'Cusre to cow'})
    }
    

})

app.post('/withdraw', authenticateToken, async (req, res) => {
    try {
        const {withdraw_id, amount} = req.body

    if (!withdraw_id || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid input."})
    }

    const account = await Account.findById(withdraw_id)

    if (!account) {
        res.status(400).json({ message: "Account not found or Id is wrong."})
    }

    //add money
    account.balance -=  Number(amount)
    await account.save()

    res.json({ message: "Withdraw successful.",
         account_id: account._id,
          new_balance: account.balance})
    } catch (error) {
      res.status(500).send({message: 'Cusre to cow'})
    }
    

})

app.post('/transfer', authenticateToken, async (req, res) => {
    try {

        const user_email  = req.user.email

        const {sender_id, recevier_id, amount} = req.body

        if (!sender_id || !recevier_id || !amount|| amount <= 0) {
            return res.status(400).send({message: 'Correct form required .'})
        }

        const sender = await Account.findOne({_id: sender_id, user_email})
        const recevier = await Account.findById(recevier_id)

 
        if (!sender || !recevier) {
            return res.status(404).send({message: 'Registered senderEmail or recevierEmail not found.'})
        }

        if (sender.balance < amount) {
            return res.status(400).send({message: 'Sender balance account is insufficient for transaction.'})
        }
        
        sender.balance -= amount
        recevier.balance += amount

        await sender.save()
        await recevier.save()

        res.send({ message:'Transfer successful.', senders_balance: sender.balance, recevier_balance: recevier.balance})

    } catch (error) {
        res.status(500).send({message:"Error", error})
        console.log(error.message);
        
    }
})