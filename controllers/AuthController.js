const prisma = require("../prisma/prismaClient");

//pacote do node que contém várias funções de criptografias//
const bcryptjs = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

class AuthController{

    static async cadastro(req, res) {
        const{nome, email, password} = req.body;

        if(!nome || nome.length < 6){
            return res.status(422).json({
                erro: true,
                mensagem: "O nome deve ter pelo menos 6 caracteres",
            });
        }

        if(!email || email.length < 10){
            return res.status(422).json({
                erro: true,
                mensagem: "O email deve ter pelo menos 10 caracteres",
            });
        }

        if(!password || password.length < 8){
            return res.status(422).json({
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
            return res.status(422).json({
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

            const token = jwt.sign({id: usuario.id}, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });

            return res.status(201).json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!",
                token: token,
            });
        } catch (error) {
            return res.status(500).json({
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
            return res.status(422).json({
                erro:true,
                mensagem:"Usuário não encontrado",
            });
        }
        //verificação da senha//
        //o bcrypt vai pegar a senha e calcular o rash dela e comparar com a senha que está dentro de usuario.password//
        const senhaCorreta = bcryptjs.compareSync(password, usuario.password);

        if (!senhaCorreta){
            return res.status(422).json({
                erro: true,
                mensagem: "Senha incorreta",
            });
        }

    const token = jwt.sign({id: usuario.id}, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });

    res.status(200).json({
        erro: false,
        mensagem:"Autenticado com sucesso!",
        token: token,
    });
}
}

module.exports = AuthController; 



