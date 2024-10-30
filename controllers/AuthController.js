const {PrismaClient} = require ("@prisma/client");
const prisma = new PrismaClient();

const bcryptjs = require("bcryptjs"); //pacote do node que contém várias funções de criptografia senhas //

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

        const salt = bcryptjs.genSaltSync(10); //valor aleatório que da uma camada a mais de segurança para a senha//
        const hashPassword = bcryptjs.hashSync(password, salt);

        try { //cadastrar
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
                token: "122mmjgyg",
            });
        } catch (error) {
            return res.json({
                erro: false,
                mensagem: "Ocorreu um erro, tente novamente mais tarde!" + error,
                token: "122mmjgyg",
            });
        }
        }

        

    static async login (req, res){

    }
}

module.exports = AuthController; 