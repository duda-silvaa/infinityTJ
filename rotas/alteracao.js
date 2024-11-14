app.put('/alterar-dados', (req, res) => {
    const { id, novaSenha, novoEmail, novoNome } = req.body;
    const sql = 'UPDATE usuarios SET senha = ?, email = ?, nome = ? WHERE id = ?';

    db.query(sql, [novaSenha, novoEmail, novoNome, id], (err, result) => {
        if (err) throw err;
        res.send('Dados alterados com sucesso!');
    });
});


