const express = require('express')
const authRouter = require('./routes/auth-routes') // поменяй импорты на modulejs


const app = express()

app.use(express.json())
app.use("/auth", authRouter) // добавь дефолтный путь 'api'

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`server started on PORT ${PORT}`))