//showUsers.js mostra os usuarios cadastrados//
const {PrismaClient} = require ("@prisma/client");
const prisma = new PrismaClient();

async function main (){
    const usuarios = await prisma.usuario.findMany();

    console.log(JSON.stringify(usuarios));
}

main();

