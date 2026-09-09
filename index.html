const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Menyajikan file antarmuka statis dari folder root
app.use(express.static(__dirname));

// 1. Inisialisasi Database SQLite
const db = new sqlite3.Database('./koas_app.db', (err) => {
  if (err) console.error('Gagal membuka database:', err.message);
  else console.log('Terkoneksi ke database SQLite.');
});

// 2. Buat Tabel Data
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      token_balance INTEGER DEFAULT 5
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS token_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount INTEGER,
      action TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// 3. Endpoint Registrasi (Otomatis 5 Token Gratis)
app.post('/api/register', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email wajib diisi.' });

  db.run(`INSERT INTO users (email, token_balance) VALUES (?, 5)`, [email], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
    res.json({ message: 'Registrasi berhasil! 5 token trial aktif.', userId: this.lastID, tokens: 5 });
  });
});

// 4. Endpoint Cek Saldo
app.get('/api/user/:id', (req, res) => {
  db.get(`SELECT id, email, token_balance FROM users WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    res.json(row);
  });
});

// 5. Endpoint Eksekusi Fitur Utama (Potong 1 Token)
app.post('/api/execute-task', (req, res) => {
  const { userId, inputData } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID wajib disertakan.' });

  db.get(`SELECT token_balance FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    if (user.token_balance < 1) {
      return res.status(403).json({ error: 'Saldo token habis. Silakan hubungi admin.' });
    }

    // Ganti teks output ini sesuai logika sistem Anda nantinya
    const outputSistem = `Data berhasil dianalisis: "${inputData}". (Hasil diagnosis/rekap siap dipakai).`;

    db.run(`UPDATE users SET token_balance = token_balance - 1 WHERE id = ?`, [userId], function (err) {
      if (err) return res.status(500).json({ error: 'Gagal memotong token.' });

      db.run(`INSERT INTO token_logs (user_id, amount, action) VALUES (?, -1, 'EXECUTE_FEATURE')`, [userId]);

      res.json({
        success: true,
        remainingTokens: user.token_balance - 1,
        result: outputSistem
      });
    });
  });
});

// 6. Endpoint Menampilkan Halaman Utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));
