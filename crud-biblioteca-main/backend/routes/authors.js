const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /authors

router.get('/', (req,res) => {
    db.query('SELECT * FROM authors', (err, results) => {
        if (err) {
            console.error('Erro ao buscar autores', err)
            return res.status(500).json({ error: 'Erro no servidor'});
        }

        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { name, nationality } = req.body; // agora pega nationality

    if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const sql = 'INSERT INTO authors (name, nationality) VALUES (?, ?)';
    db.query(sql, [name, nationality || null], (err, results) => {
        if (err) {
            console.error('Erro ao criar autor:', err);
            return res.status(500).json({ error: "Erro no servidor" });
        }

        res.status(201).json({
            id: results.insertId,
            name,
            nationality: nationality || null
        });
    });
});

// Atualizar autor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, nationality } = req.body; // agora pega nationality

    if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const sql = 'UPDATE authors SET name = ?, nationality = ? WHERE id = ?';
    db.query(sql, [name, nationality || null, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar autor:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Autor não encontrado' });
        }

        res.json({
            id: parseInt(id),
            name,
            nationality: nationality || null
        });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM authors WHERE id = ?', [id], (err, results) => {
        if (err) {
            // Se o erro for de vínculo (chave estrangeira), retorna 409
            if (err.errno === 1451) {
                return res.status(409).json({ error: 'Não é possível excluir: autor possui livros vinculados' });
            }
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Autor não encontrado' });
        res.json({ message: 'Autor deletado com sucesso' });
    });
});

module.exports = router;
