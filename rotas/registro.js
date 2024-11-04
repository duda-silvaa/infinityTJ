app.post('/register', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) throw err;
        res.send('Usuário registrado com sucesso!');
    });
});