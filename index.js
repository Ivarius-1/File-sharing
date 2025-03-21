const express = require('express')
const authRouter = require('./routes/auth-routes')


const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`server started on PORT ${PORT}`))