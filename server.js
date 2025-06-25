const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 유저별 wastedTime 저장
const userData = {};

// 🔹 POST /submit → 낭비 시간 전송
app.post('/submit', (req, res) => {
  const { userId, wastedTime } = req.body;

  if (!userId || typeof wastedTime !== 'number') {
    return res.status(400).json({ error: 'userId와 wastedTime은 필수입니다.' });
  }

  userData[userId] = wastedTime;
  console.log(`[+] ${userId}의 낭비 시간 기록됨: ${wastedTime}분`);
  res.status(200).json({ message: '기록 완료', wastedTime });
});

// 🔹 GET /status/:userId → 낭비 시간 조회
app.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const wastedTime = userData[userId] || 0;
  res.json({ userId, wastedTime });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

// 🔹 GET /ranking → 사용자 랭킹 리스트
app.get('/ranking', (req, res) => {
  const ranked = Object.entries(userData)
    .map(([userId, wastedTime]) => ({ userId, wastedTime }))
    .sort((a, b) => a.wastedTime - b.wastedTime);

  res.json(ranked);
});
app.use((req, res, next) => {
  console.log('📥 Content-Type:', req.headers['content-type']);
  next();
});
