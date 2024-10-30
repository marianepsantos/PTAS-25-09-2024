const {PrismaClient} = require ("@prisma/client");
const prisma = new PrismaClient();

//pacote do node que contém várias funções de criptografias//
const bcryptjs = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

class AuthController{

    static async cadastro(req, res) {
        const{nome, email, password, tipo} = req.body;

        if(!nome || nome.length < 6){
            return res.json({
                erro: true,
                mensagem: "O nome deve ter pelo menos 6 caracteres",
            });
        }

        if(!email || email.length < 10){
            return res.json({
                erro: true,
                mensagem: "O email deve ter pelo menos 10 caracteres",
            });
        }

        if(!password || password.length < 8){
            return res.json({
                erro: true,
                mensagem: "A senha deve ter pelo menos 8 caracteres",
            });
        }


        //verifica usuarios já cadastrados com um e mail//
        const existe = await prisma.usuario.count({
            where:{
                email: email,
            },
        });

        if(existe != 0){
            return res.json({
                erro: true,
                mensagem: "Já existe usuário cadastrado em este e-mail.",
            });
        }

        //valor aleatório que da uma camada a mais de segurança para a senha//
        const salt = bcryptjs.genSaltSync(10); 
        const hashPassword = bcryptjs.hashSync(password, salt);

        //cadastrar//
        try { 
           const usuario = await prisma.usuario.create ({
                data: {
                    nome: nome,
                    email:email,
                    password:hashPassword,
                    tipo: "cliente",
                },
            });

            console.log(JSON.stringify(usuario));

            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!",
            });
        } catch (error) {
            return res.json({
                erro: false,
                mensagem: "Ocorreu um erro, tente novamente mais tarde!" + error,
            });
        }
    }

        

    static async login (req, res){

        const {email, password} = req.body;

        const usuario = await prisma.usuario.findUnique({
            where: {
                email:email,
            },
        });

        if(!usuario){
            return res.json({
                erro:true,
                mensagem:"Usuário não encontrado",
            });
        }

        const senhaCorreta = bcryptjs.compareSync(password, usuario.password);

        if (!senhaCorreta){
            return res.json({
                erro: true,
                mensagem: "Senha incorreta",
            });
        }

    const token = jwt.sing({id: usuario.id}, "123456789", {
        expiresIn: "1h",
    });

    res.json({
        erro: false,
        mensagem:"Autenticado com sucesso!",
        token: token,
    });
    }
}

module.exports = AuthController; 