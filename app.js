const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// アップロードファイルを保存するディレクトリを作成
const publicDir = path.join(__dirname, 'public');
const uploadDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multerのストレージ設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // ファイルを保存するディレクトリ
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // ファイルの拡張子を取得
    const basename = path.basename(file.originalname, ext);  // 拡張子を除いたファイル名
    cb(null, `${basename}-${Date.now()}${ext}`);  // 新しいファイル名を作成
  }
});

// Multerの設定
const upload = multer({ storage: storage });

// 静的ファイルの提供（HTMLフォームやアップロードされた画像など）
app.use(express.static(publicDir));

// ファイルアップロードのエンドポイント
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  res.send({
    msg: 'File uploaded successfully',
    file: req.file
  });
});

// アップロードされた画像を表示するエンドポイント
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);
  res.sendFile(filePath);
});
// アップロードされた画像の一覧を取得するエンドポイント
app.get('/uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to list files' });
    }
    res.json({ files });
  });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
