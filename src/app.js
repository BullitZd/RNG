const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'public', 'his'));

app.use(express.json());

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

app.post('/save', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, '..', 'src', 'cache', 'his.json');
  
  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).send('Error reading file');
    }
    let history = fileData ? JSON.parse(fileData) : [];
    history.push(data);
    fs.writeFile(filePath, JSON.stringify(history, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.status(200).send('Data berhasil disimpan');
    });
  });
});

app.get('/history', (req, res) => {
    const filePath = path.join(__dirname, '..', 'src', 'cache', 'his.json');
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        let history = fileData ? JSON.parse(fileData) : [];
        history = history.reverse();
        history = history.map(item => {
            return {
                ...item,
                formattedTimestamp: formatDate(item.timestamp)
            };
        });
        res.render('history', { history });
    });
});

app.delete('/clear-history', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'cache', 'his.json');
  
  fs.writeFile(filePath, '[]', 'utf-8', (err) => {
    if (err) {
      return res.status(500).send('Error clearing history');
    }
    res.status(200).send('History cleared');
  });
});

app.post('/update-status', (req, res) => {
  const { index, status } = req.body;
  console.log(`Menerima pembaruan untuk indeks: ${index}, status: ${status}`); // Logging
  const filePath = path.join(__dirname, '..', 'src', 'cache', 'his.json');

  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err) {
      console.error('Error membaca file:', err);
      return res.status(500).send('Error membaca file');
    }
    let history = fileData ? JSON.parse(fileData) : [];
    console.log(`History saat ini: ${JSON.stringify(history, null, 2)}`); // Logging
    if (history[index]) {
      history[index].status = status; // Update status berdasarkan indeks
    }
    fs.writeFile(filePath, JSON.stringify(history, null, 2), (err) => {
      if (err) {
        console.error('Error menulis file:', err);
        return res.status(500).send('Error menulis file');
      }
      res.status(200).send('Status diperbarui');
    });
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
