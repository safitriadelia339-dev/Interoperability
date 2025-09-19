const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3200;

let idSeq = 3;
let movies = [
    { id: 1, title: 'Parasite', director: 'Bong Joon-ho', year: 2019},
    { id: 2, title: 'The Dark Knight', director: 'Nolan', year: 2008},
];

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === ROUTES ===
app.get('/status', (req, res) => {
  res.json({
    ok: true,
    service: 'film-api',
    time: new Date().toISOString()
  });
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);
    if (!movie) return res.status(404). json({error: 'Movie tidak ditemukan'});
    res.json(movie);
});

//POST = Membuat Film Baru
app.post('/movies', (req, res) => {
    const { title, director, year} = req.body || {};
    if (!title || !director || !year) {
        return res.status(400).json({ error: 'title, director, year wajib diisi'});
    }
    const newMovie = { id: idSeq++, title, director, year};
    movies.push(newMovie);
    res.status(201).json(newMovie); 
});

//PUT = Memperbarui Data Film
app.put('/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({error: 'Movie tidak ditemukan'});
    }
    const { title, director, year} = req.body || {};
    const updattedMovie = ( id, title, director, year );
    res.json (updattedMovie);
});

//DELETE
app.delete('/movies/:id', (req, res) =>{
    const id = Number(req.params.id);
    const movieIndex = movies.findIndex(m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie tidak ditemukan'});
    }
    movies.splice(movieIndex, 1);
    res.status(204).send();
});

// Middleware fallback untuk menangani rute 404 Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Rute tidak ditemukan' });
});

//Error Handler terpusat
app.use((err, req, res, _next) => {
    console.error('[ERROR]', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server'});
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
