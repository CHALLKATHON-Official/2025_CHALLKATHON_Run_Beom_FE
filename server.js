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
  const { userId, wastedTime, youtubeTime, instagramTime, totalTime } =
    req.body;

  if (!userId || typeof wastedTime !== 'number') {
    return res.status(400).json({ error: 'userId와 wastedTime은 필수입니다.' });
  }

  userData[userId] = { wastedTime, youtubeTime, instagramTime, totalTime };

  console.log(`[+] ${userId}의 기록 저장됨:`, userData[userId]);
  res.status(200).json({ message: '기록 완료', ...userData[userId] });
  console.log('📦 수신된 전체 req.body:', req.body);
});

// 🔹 GET /status/:userId → 낭비 시간 조회
app.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const data = userData[userId];

  if (!data) {
    return res.status(404).json({ error: '기록이 없습니다.' });
  }

  res.json(data);
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

// 🔹 GET /ranking → 사용자 랭킹 리스트
// 🔹 GET /ranking → 사용자 랭킹 리스트
app.get('/ranking', (req, res) => {
  const ranked = Object.entries(userData)
    .map(([userId, data]) => ({
      userId,
      wastedTime: data.wastedTime,
    }))
    .sort((a, b) => a.wastedTime - b.wastedTime);

  res.json(ranked);
});
