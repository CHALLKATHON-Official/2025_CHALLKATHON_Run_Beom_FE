let loginMethod = '';
let userName = '';
let userId = ''; // ✅ 추가됨

// 로그인 ↔ 회원가입 화면 전환
function showSignup() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
}
function showLogin() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

function register() {
  const id = document.getElementById('signup-id').value.trim();
  const pw = document.getElementById('signup-pw').value.trim();
  const nickname = document.getElementById('signup-nickname').value.trim();
  const birth = document.getElementById('signup-birth').value;

  if (!id || !pw || !nickname || !birth) {
    alert('모든 정보를 입력하세요!');
    return;
  }
  if (localStorage.getItem('user_' + id)) {
    alert('이미 존재하는 아이디입니다!');
    return;
  }
  localStorage.setItem('user_' + id, JSON.stringify({ pw, nickname, birth }));
  alert('회원가입이 완료되었습니다!');
  showLogin();
}

function login() {
  const id = document.getElementById('login-id').value;
  const pw = document.getElementById('login-pw').value;
  const saved = localStorage.getItem('user_' + id);
  const savedData = saved ? JSON.parse(saved) : null;

  if (savedData && savedData.pw === pw) {
    loginMethod = 'local';
    userName = savedData.nickname;
    userId = id; // ✅ 추가됨
    proceedToVideo();
  } else if (!savedData) {
    console.log('없는 회원정보입니다');
    document.getElementById('login-result').textContent =
      '❌ 존재하지 않는 계정입니다.';
  } else {
    console.log('비밀번호가 일치하지 않습니다');
    document.getElementById('login-result').textContent =
      '❌ 아이디 또는 비밀번호가 일치하지 않습니다.';
  }
}

function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

function handleGoogleLogin(response) {
  const payload = decodeJwtResponse(response.credential);
  loginMethod = 'google';
  userName = payload.name || payload.given_name || payload.email.split('@')[0];
  userId = payload.email.split('@')[0]; // 구글 로그인 시 userId 설정
  proceedToVideo();
}

function proceedToVideo() {
  const loginBox = document.getElementById('login-container');
  loginBox.style.display = 'none';
  document.getElementById('signup-container').style.display = 'none';

  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) bgVideo.style.display = 'none';

  const vc = document.getElementById('video-container');
  const video = document.getElementById('intro-video');
  vc.style.display = 'flex';
  video.play().catch(console.error);

  // ✅ 영상 끝나면 alice-container로 이동!
  video.addEventListener('ended', () => {
    vc.classList.add('fade-out-transition');

    setTimeout(() => {
      vc.style.display = 'none';
      document.getElementById('alice-container').style.display = 'block';
    }, 1000);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const hourSel = document.getElementById('goal-hour');
  const minSel = document.getElementById('goal-minute');
  if (hourSel && minSel) {
    for (let h = 0; h < 24; h++) {
      const o = document.createElement('option');
      o.value = o.textContent = String(h).padStart(2, '0');
      hourSel.append(o);
    }
    for (let m = 0; m < 60; m++) {
      const o = document.createElement('option');
      o.value = o.textContent = String(m).padStart(2, '0');
      minSel.append(o);
    }
  }
});

document.getElementById('toggle-desc').addEventListener('click', () => {
  document.getElementById('modal-overlay').style.display = 'flex';
});
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('modal-overlay').style.display = 'none';
});

function setGoalTime() {
  const h = document.getElementById('goal-hour').value;
  const m = document.getElementById('goal-minute').value;
  if (h === '' || m === '') {
    alert('목표 시간을 선택해주세요.');
    return;
  }

  const timeInput = `${h}:${m}`;
  document.getElementById('goal-status').textContent =
    loginMethod === 'google'
      ? `${userName} 님의 목표 시간은 ${timeInput}으로 설정되었습니다.`
      : `${userName}님의 목표 시간은 ${timeInput}으로 설정되었습니다.`;

  // ✅ 목표 설정 화면 페이드 아웃
  const alice = document.getElementById('alice-container');
  alice.classList.add('fade-out-transition');

  setTimeout(() => {
    alice.style.display = 'none';

    const gif = document.getElementById('intro-gif-container');
    gif.style.display = 'block';

    // gif는 2.5초 보이고, 이후 main으로 이동
    setTimeout(() => {
      gif.classList.add('fade-out-transition');

      setTimeout(() => {
        gif.style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        loadWastedTime();
      }, 1000); // 페이드 아웃 지속시간
    }, 1800); // gif 재생 시간 정확히 1.8초
  }, 1000); // alice-container 페이드아웃 후
}

function loadWastedTime() {
  const fixedUserId = 'hoho';

  fetch(`/status/${fixedUserId}`)
    .then((res) => res.json())
    .then((data) => {
      const wasted = data.wastedTime || 0;
      const youtube = data.youtubeTime ?? 0;
      const instagram = data.instagramTime ?? 0;
      const total = data.totalTime ?? 0;

      const scale = Math.max(0.2, 1 - wasted / 180);
      const img = document.querySelector('.alice-img');
      if (img) {
        img.style.transform = `scale(${scale})`;
      }

      document.getElementById(
        'total-time-heading'
      ).innerText = `총 사용 시간: ${total}분`;

      const youtubeBar = document.getElementById('youtube-bar');
      const instagramBar = document.getElementById('instagram-bar');
      const ytPercent = (youtube / total) * 100;
      const igPercent = (instagram / total) * 100;

      youtubeBar.style.width = `${ytPercent}%`;
      instagramBar.style.width = `${igPercent}%`;

      youtubeBar.querySelector(
        'span'
      ).textContent = `유튜브 사용시간: ${youtube}분`;
      instagramBar.querySelector(
        'span'
      ).textContent = `인스타 사용시간: ${instagram}분`;
    })
    .catch((err) => {
      console.error('❌ 사용자 데이터 불러오기 실패:', err);
    });
}
