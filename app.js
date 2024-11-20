

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const session = require('express-session');

// Configuração do CORS para permitir requisições do front-end
app.use(cors({
    origin: '*', // Permite apenas o endereço específico do front-end 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



app.use(session({
    secret: 'infinity', //  chave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

require('dotenv').config();

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net', // Host do Railway
    user: 'root',                    // Usuário do Railway
    password: 'BzHxdTlEmHMeWEAeVmaZiGFfILQNiccA', // Senha do Railway
    database: 'railway',             // Nome do banco no Railway
    port: 38654                      // Porta fornecida pelo Railway
});


// Conecta ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para parse de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Sessão ativa:", req.session);
    next();
});


// Rota de login
app.post('/login', (req, res) => {
    console.log("Requisição recebida em /login");

    const { email, senha } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
    }

    // Query para verificar email e senha
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(sql, [email, senha], (err, result) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (result.length > 0) {
            // Se o login for bem-sucedido
            req.session.userID = result[0].id; 
            console.log("Sessão após login:", req.session);

            return res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            // Se email ou senha estiverem incorretos
            return res.json({ success: false, message: 'Email ou senha incorretos' });
        }
    });
});

//rota de cadastro 
app.post('/register', (req, res) => {
    console.log("Requisição recebida em /register");

    const { regNome, regEmail, regSenha } = req.body;

    // Verifica se os campos foram preenchidos
    if (!regNome || !regEmail || !regSenha) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
    }

    // Verifica se o email já está registrado
    const checkUserSql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(checkUserSql, [regEmail], (err, result) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (result.length > 0) {
            // Se o email já estiver registrado
            return res.json({ success: false, message: 'Email já cadastrado' });
        }

        // Se o email não estiver registrado, insere o novo usuário
        const insertUserSql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        db.query(insertUserSql, [regNome, regEmail, regSenha], (err, result) => {
            if (err) {
                console.error("Erro ao registrar usuário:", err);
                return res.status(500).json({ success: false, message: 'Erro no servidor ao registrar usuário' });
            }

            res.json({ success: true, message: 'Usuário registrado com sucesso!' });
        });
    });
});


//rota para solicitacao 

app.post('/solicitacao-orcamento', (req, res) => {
    console.log("Sessão atual:", req.session); // Verifique a sessão completa aqui
    const { descricao, telefone } = req.body;
    const usuario_id = req.session.userID;

    if (!usuario_id) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const sql = 'INSERT INTO solicitacoes_orcamento (descricao, data_solicitacao, usuario_id, telefone) VALUES (?, NOW(), ?, ?)';
    db.query(sql, [descricao, usuario_id, telefone], (err, result) => {
        if (err) {
            console.error("Erro ao salvar a solicitação no banco de dados:", err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar a solicitação.' });
        }
        res.status(200).json({ success: true, message: 'Solicitação enviada com sucesso!' });
    });
});

//rota suporte - 

// Rota de suporte
app.post('/suporte', (req, res) => {
    const { nomeSup, emailSup, messageSup } = req.body;
    const usuario_id = req.session.userID;

    // Verifica se o usuário está logado
    if (!usuario_id) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    // Verifica se os campos obrigatórios estão preenchidos
    if (!nomeSup || !emailSup || !messageSup) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos.' });
    }

    const sql = 'INSERT INTO suporte (usuario_id, nome, email, mensagem) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [usuario_id, nomeSup, emailSup, messageSup], (err, result) => {
        if (err) {
            console.error("Erro ao enviar mensagem para o suporte:", err);
            return res.status(500).json({ success: false, message: 'Erro ao enviar a mensagem para o suporte.' });
        }
        
        res.status(200).json({ success: true, message: 'Mensagem enviada para o suporte com sucesso!' });
    });
});


/*rota esqueceu senha -
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Provedor de e-mail (pode ser Gmail, Yahoo, Outlook, etc.)
    auth: {
      user: 'maria.eduarda.s19961@gmail.com', // O endereço de e-mail que enviará as mensagens
      pass: 'comida19961', // Senha do e-mail ou senha de aplicativo
    },
  });
  
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Verificar se o e-mail existe no banco de dados
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'E-mail não encontrado.' });
      }
  
      // Gerar um token único
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token válido por 1 hora
      await user.save();
  
      // Enviar o e-mail com o link de redefinição
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      const mailOptions = {
        from: 'seu_email@gmail.com',
        to: email,
        subject: 'Redefinição de senha',
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'E-mail de recuperação enviado.' });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
  });

//rota atualizar senha no bd 
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Encontrar o usuário pelo token
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Verificar se o token ainda é válido
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'Token inválido ou expirado.' });
      }
  
      // Atualizar a senha e limpar os campos de token
      user.password = newPassword; // Lembre-se de criptografar a senha!
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({ success: true, message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
  }); */
  

// Definindo a porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
