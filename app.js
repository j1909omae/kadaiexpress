const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// アップロードファイルを保存するディレクトリを作成
const uploadDir = path.join(__dirname, 'uploads');
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

// 静的ファイルの提供（HTMLフォームなど）
app.use(express.static('public'));

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

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
