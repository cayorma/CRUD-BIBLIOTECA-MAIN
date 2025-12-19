import './App.css';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [authorNationality, setAuthorNationality] = useState('');
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  // Buscar livros
  const fetchBooks = () => {
    fetch('http://localhost:3000/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  };

  // Buscar autores
  const fetchAuthors = () => {
    fetch('http://localhost:3000/authors')
      .then(res => res.json())
      .then(data => setAuthors(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { // Buscar dados de uma API
    fetchBooks();
    fetchAuthors();
  }, []);

    const handleAuthorSubmit = (e) => {
      e.preventDefault();

      const method = editingAuthor ? 'PUT' : 'POST';
      const url = editingAuthor
        ? `http://localhost:3000/authors/${editingAuthor.id}`
        : 'http://localhost:3000/authors';

      fetch(url, { // envia a requisicao pro backend
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: authorName,
          nationality: authorNationality // aqui adicionamos a nacionalidade
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Erro na requisição');
        return res.json();
      })
      .then(() => { // atualiza a interface
        setAuthorName('');
        setAuthorNationality('');
        setEditingAuthor(null);
        fetchAuthors();
        toast.success(editingAuthor ? 'Autor atualizado com sucesso!' : 'Autor cadastrado com sucesso!');
      })
      .catch(err => {
        console.error('Erro ao salvar autor:', err);
        toast.error('Erro ao salvar autor!');
      });
    };

const deleteAuthor = (id) => {
  fetch(`http://localhost:3000/authors/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      // Se o status for erro (não ok)
      if (!res.ok) {
        // Se for erro de restrição de chave estrangeira (geralmente retorna 400, 409 ou 500)
        throw new Error('vinculo');
      }
      return res;
    })
    .then(() => {
      fetchAuthors();
      toast.success('Autor excluído com sucesso!');
    })
    .catch(err => {
      if (err.message === 'vinculo') {
        toast.error('Não é possível excluir o autor pois ele possui livros cadastrados!');
      } else {
        console.error('Erro ao deletar autor:', err);
        toast.error('Erro ao excluir autor!');
      }
    });
};

const handleSubmit = (e) => {
  e.preventDefault();

  const method = editingBook ? 'PUT' : 'POST';
  const url = editingBook
    ? `http://localhost:3000/books/${editingBook.id}`
    : 'http://localhost:3000/books';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      year,
      category,
      author_id: authorId
    })
  })
    .then(() => {
      setTitle('');
      setYear('');
      setCategory('');
      setAuthorId('');
      setEditingBook(null);
      fetchBooks();
      toast.success(editingBook ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!');
    })
    .catch(err => {
     console.error('Erro ao salvar livro:', err);
     toast.error('Erro ao salvar livro!');
    });
};

  const deleteBook = (id) => {
  fetch(`http://localhost:3000/books/${id}`, {
    method: 'DELETE'
  })

    .then(() => { 
      fetchBooks();
      toast.success('Livro excluído com sucesso!');
    })
    .catch(err => {  
      console.error('Erro ao excluir livro:', err);
      toast.error('Erro ao excluir livro!');
    });
  };


  return (
    <div className="container">
      <h1>📚 Biblioteca</h1>
      <ToastContainer /> {/* ⚠️ adiciona aqui */}
      <h2>Cadastro de Autores</h2>

      <form onSubmit={handleAuthorSubmit}>
        <input
          type="text"
          placeholder="Nome do autor"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nacionalidade"
          value={authorNationality}
          onChange={e => setAuthorNationality(e.target.value)}
        />

        <button type="submit">
          {editingAuthor ? 'Atualizar' : 'Cadastrar'}
        </button>

        {editingAuthor && (
          <button
            type="button"
            onClick={() => {
              setAuthorName('');
              setEditingAuthor(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h3>Lista de Autores</h3>

      {authors.length === 0 ? (
        <p>Nenhum autor cadastrado.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Autor</th>
              <th>Nacionalidade</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
              {authors.map(author => (
                <tr key={author.id}>
                  <td>{author.name}</td>
                  <td>{author.nationality}</td>
                  <td className="action-buttons">
                    <button onClick={() => {
                      setEditingAuthor(author);
                      setAuthorName(author.name);
                      setAuthorNationality(author.nationality || '');
                    }}>
                      Editar
                    </button>
                    <button onClick={() => deleteAuthor(author.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}


      {/* <ul>
        {authors.map(author => (
          <li key={author.id}>
            {author.name}

            <button onClick={() => {
              setAuthorName(author.name);
              setEditingAuthor(author);
            }}>
              Editar
            </button>

            <button onClick={() => deleteAuthor(author.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul> */ }

      <h2>Cadastrar Livro</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Ano"
            value={year}
            onChange={e => setYear(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <select
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
            required
          >
            <option value="">Selecione o autor</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

      <button type="submit">
        {editingBook ? 'Atualizar' : 'Cadastrar'}
      </button>

      {editingBook && (
        <button
          type="button"
          onClick={() => {
            setEditingBook(null);
            setTitle('');
            setYear('');
            setCategory('');
            setAuthorId('');
          }}
        >
          Cancelar
        </button>
        )}

      </form>

      <hr />

      <h3>Lista de Livros</h3>

      {books.length === 0 ? (
        <p>Nenhum livro cadastrado.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Título</th>
              <th>Ano</th>
              <th>Categoria</th>
              <th>Autor</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.year}</td>
                <td>{book.category}</td>
                <td>{book.author?.name}</td>
                <td className="action-buttons">
                  <button onClick={() => {
                    setEditingBook(book);
                    setTitle(book.title);
                    setYear(book.year);
                    setCategory(book.category);
                    setAuthorId(book.author_id);
                  }}>
                    Editar
                  </button>
                  <button onClick={() => deleteBook(book.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
