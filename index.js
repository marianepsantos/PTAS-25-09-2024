const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const app = express();

//responder qualquer requisição encaminhada para ///auth/algumacoisablabla
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8000);