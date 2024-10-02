const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function main(){
    //Insere um usuário//
    const novoUsuario = await prisma.usuario.create({
      data:{
        nome: "José Bonifácio",
        email: "jose.bonifacio@imperioptbr.com",
      },
    });

    console.log("novo usuário: " + JSON.stringify(novoUsuario));

    //Busca usuário//
    const usuarios = await prisma.usuario.findMany();
    console.log("Todos os usuários: " + JSON.stringify(usuarios));
}

main().catch((erro) => {
    console.log("Erro:" + erro);
});
