const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Kullanıcı bilgileri
const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

// JWT için gizli anahtar
const secretKey = 'gizlianahtar';



app.get("/posts", authenticateToken, (req, res)=>{
  console.log("Token is valid")
  console.log(req.user.user)
  res.send(`${req.user.user} successfully accessed post`)
  })

// Kullanıcı girişi ve JWT oluşturma endpoint'i
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // Kullanıcı doğrulandı, JWT oluşturulur
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1m" });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
  }
});

// Korumalı bir endpoint örneği
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Bu bir korumalı endpointtir' });
});

// JWT doğrulama işlevi
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
}

// Sunucuyu dinlemeye başla
app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor...');
});
