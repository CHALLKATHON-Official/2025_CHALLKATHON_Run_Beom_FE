const userId = 'hoho';

fetch('/ranking')
  .then((res) => res.json())
  .then((data) => {
    const tbody = document.querySelector('#ranking-table tbody');
    const table = document.getElementById('ranking-table');
    const effectOverlay = document.getElementById('effect-overlay');
    const effectImg = document.getElementById('effect-img');

    const rankIndex = data.findIndex((user) => user.userId === userId);
    const isOnlyUser = data.length === 1;
    const isFirst = rankIndex === 0;
    const isLast = rankIndex === data.length - 1;

    // 조건에 따라 연출용 GIF 보여주기
    if (isOnlyUser || isFirst || isLast) {
      effectImg.src =
        isOnlyUser || isFirst ? 'smile-alice.gif' : 'cry-alice.gif';
      effectOverlay.style.display = 'flex';
      effectOverlay.style.opacity = '1';

      setTimeout(() => {
        effectOverlay.style.opacity = '0';
        setTimeout(() => {
          effectOverlay.style.display = 'none';
          table.style.display = 'table';
        }, 1000);
      }, 1500);
    } else {
      table.style.display = 'table';
    }

    // 테이블 생성
    data.forEach((user, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index === 0 ? '👑 1위' : `${index + 1}위`}</td>
        <td>${user.userId}</td>
        <td>${user.wastedTime}분</td>
      `;
      if (index === 0) {
        tr.style.backgroundColor = '#ffe066';
        tr.style.fontWeight = 'bold';
      }
      tbody.appendChild(tr);
    });
  })
  .catch(() => {
    document.body.innerHTML +=
      '<p style="text-align:center;">❌ 데이터를 불러올 수 없습니다.</p>';
  });
