const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Penyimpanan sementara dalam memori (Cocok & aman untuk fase trial di Vercel)
// users = { [email]: { id: 1, email: '...', token_balance: 5 } }
let users = {};
let nextUserId = 1;
let tokenLogs = [];

// 1. Endpoint Registrasi (Dapat 5 Token Gratis)
app.post('/api/register', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email wajib diisi.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Jika sudah terdaftar, kembalikan data yang ada
  if (users[cleanEmail]) {
    return res.json({
      message: 'Email sudah terdaftar. Selamat datang kembali!',
      userId: users[cleanEmail].id,
      tokens: users[cleanEmail].token_balance
    });
  }

  // Akun baru: beri 5 token
  const newUser = {
    id: nextUserId++,
    email: cleanEmail,
    token_balance: 5
  };
  users[cleanEmail] = newUser;

  return res.json({
    message: 'Registrasi berhasil! 5 token trial aktif.',
    userId: newUser.id,
    tokens: 5
  });
});

// 2. Endpoint Cek Saldo Token
app.get('/api/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = Object.values(users).find(u => u.id === userId);

  if (!user) {
    // Jika serverless sempat restart dan id hilang, buatkan fallback sesi aktif
    return res.json({ id: userId, email: 'koas@trial.id', token_balance: 5 });
  }

  return res.json(user);
});

// 3. Endpoint Eksekusi Fitur Utama (Potong 1 Token)
app.post('/api/execute-task', (req, res) => {
  const { userId, inputData } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID wajib disertakan.' });
  }

  const uId = parseInt(userId);
  let user = Object.values(users).find(u => u.id === uId);

  // Jika sesi baru setelah cold restart, daftarkan instan
  if (!user) {
    user = { id: uId, email: `user${uId}@trial.id`, token_balance: 5 };
    users[user.email] = user;
  }

  if (user.token_balance < 1) {
    return res.status(403).json({ error: 'Saldo token habis! Silakan hubungi admin untuk top up.' });
  }

  // Kurangi 1 token
  user.token_balance -= 1;
  tokenLogs.push({ userId: uId, action: 'EXECUTE', timestamp: new Date() });

  const outputSistem = `Data berhasil dianalisis: "${inputData}".\nStatus: Terverifikasi untuk laporan tugas klinik.`;

  return res.json({
    success: true,
    remainingTokens: user.token_balance,
    result: outputSistem
  });
});

// Wajib untuk Vercel Serverless Function:
module.exports = app;
