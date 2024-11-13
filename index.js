const prisma = require("./prisma/prismaClient");

const express = require("express");
const cors = require('cors')

const app = express();
app.use(express.json());

app.use(cors ({
    origin: "http://localhost:3000"
}))

//responder qualquer requisição encaminhada para ///auth/algumacoisablablayuy
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8000);