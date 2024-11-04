app.post('/suporte', (req, res) => {
    const { usuario_id, nome, email, mensagem } = req.body;
    const sql = 'INSERT INTO suporte (usuario_id, nome, email, mensagem) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [usuario_id, nome, email, mensagem], (err, result) => {
        if (err) throw err;
        res.send('Mensagem enviada para o suporte');
    });
});
