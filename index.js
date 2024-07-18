const express = require('express')
const app = express()
const port = 3000
const path = require('path');

// 静的ファイルの提供とキャッシュの有効化
app.use(express.static('public', { maxAge: 86400000 }));

// test-imageリクエスト
app.get('/test-image', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/test.png'));
});

// GETリクエスト
app.get('/', (req, res) => {
  res.send({
    msg:'GET request'
  });
});

// POSTリクエスト
app.post('/', (req, res) => {
  res.send({
    msg:'POST request'
  });
});

// PUTリクエスト
app.put('/:id', (req, res) => {
  res.send({
    id: req.params.id,
    msg:'PUT request'
  });
});

// DELETEリクエスト
app.delete('/:id', (req, res) => {
  res.send({
    id: req.params.id,
    msg:'DELETE request'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
