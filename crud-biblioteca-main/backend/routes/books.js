const express = require('express');
const router = express.Router();
const db = require('../db');

/* ============================
   GET — listar todos os livros
============================ */
router.get('/', (req, res) => {
    const sql = `
        SELECT 
        b.id,
        b.title,
        b.year,
        b.category,
        a.id AS author_id,
        a.name AS author_name
        FROM books b
        JOIN authors a ON b.author_id = a.id;
    `;

    // o join relacionada cada livro com o seu autor.

    db.query(sql, (err, results) => { // // executa a query no mysql
        if (err) {
            console.error('Erro ao buscar livros:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        
        const formattedBooks = results.map(book => ({
        id: book.id,
        title: book.title,
        year: book.year,
        category: book.category,
        author: {
            id: book.author_id,
            name: book.author_name
        }
        }));

        res.json(formattedBooks);
    });
});

/* ============================
   GET — livro por ID
============================ */
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT * FROM books WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            res.json(results[0]);
        }
    );
});

/* ============================
   POST — criar livro
============================ */
router.post('/', (req, res) => {
    const { title, year, category, author_id } = req.body;

    if (!title || !author_id) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
    }

    const sql = `
        INSERT INTO books (title, year, category, author_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [title, year, category, author_id], (err, result) => { // executa a query no mysql
        if (err) {
            console.error('Erro ao criar livro:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        res.status(201).json({
            id: result.insertId,
            title,
            year,
            category,
            author_id
        });
    });
});

/* ============================
   PUT — atualizar livro
============================ */
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, year, category, author_id } = req.body;

    const sql = `
        UPDATE books
        SET title = ?, year = ?, category = ?, author_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, year, category, author_id, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar livro:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            res.json({ message: 'Livro atualizado com sucesso' });
        }
    );
});

/* ============================
   DELETE — remover livro
============================ */
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM books WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error('Erro ao deletar livro:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            res.json({ message: 'Livro removido com sucesso' });
        }
    );
});

module.exports = router;
