const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Configuração do CORS para permitir requisições do front-end
app.use(cors({
    origin: 'http://127.0.0.1:5501', // Permite apenas o endereço específico do front-end
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '046024',
    database: 'bdinfinitytrabalheja'
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
            return res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            // Se email ou senha estiverem incorretos
            return res.json({ success: false, message: 'Email ou senha incorretos' });
        }
    });
});

// Definindo a porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
