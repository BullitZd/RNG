const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

const dataTable = path.join(__dirname, 'src', 'assets', 'data-table.json');
const hisFile = path.join(__dirname, 'src', 'assets', 'his.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/his'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint untuk menyimpan data ball
app.post('/save-ball', (req, res) => {
  const data = req.body;
  
  fs.readFile(hisFile, 'utf-8', (err, fileData) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).send('Error reading file');
    }
    let history = fileData ? JSON.parse(fileData) : [];
    history.push(data);
    fs.writeFile(hisFile, JSON.stringify(history, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.status(200).send('Data berhasil disimpan');
    });
  });
});

// Endpoint untuk menampilkan halaman histori
app.get('/history', (req, res) => {
  fs.readFile(hisFile, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.render('history', { history: [] });
      } else {
        return res.status(500).send('Error reading file');
      }
    }
    const history = JSON.parse(data).reverse();
    res.render('history', { history });
  });
});

// Endpoint untuk menambahkan data tabel
app.post('/add-data-table', (req, res) => {
  const newRow = req.body;
  
  fs.readFile(dataTable, (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Gagal membaca file data tabel' });
    }
    
    const tableData = data ? JSON.parse(data) : [];
    tableData.push(newRow);
    
    fs.writeFile(dataTable, JSON.stringify(tableData, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Gagal menyimpan data tabel' });
      }
      
      res.json(newRow);
    });
  });
});

// Endpoint untuk mendapatkan data tabel
app.get('/data-table', (req, res) => {
  fs.readFile(dataTable, (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Gagal membaca file data tabel' });
    }
    
    const tableData = data ? JSON.parse(data) : [];
    res.json(tableData.reverse());
  });
});

// Tambahkan rute untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
