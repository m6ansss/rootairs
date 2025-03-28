// 네비게이션 스크립트
document.addEventListener("DOMContentLoaded", function () {
    fetch("https://www.rootairs.com/api/member/status", {
        method: "GET",
        credentials: "include",  // 쿠키 포함
        mode: "cors"             // CORS 설정 추가
    })
    .then(response => response.json())
    .then(data => {
        const navbarMember = document.getElementById("navbar_member");
        navbarMember.innerHTML = "";  // 기존 내용 초기화
        if (data.is_authenticated) {
            if (data.is_admin) {
                // ✅ 관리자 계정
                const adminUrl = data.admin_url;
                navbarMember.innerHTML = `
                    <li class="navbar_signup"><a href="https://www.rootairs.com/api/member/logout">로그아웃</a></li>
                    <li class="navbar_login"><a href="${adminUrl}">회원정보</a></li>
                `;
            } else {
                // ✅ 일반 로그인 사용자
                navbarMember.innerHTML = `
                    <li class="navbar_signup"><a href="https://www.rootairs.com/api/member/logout">로그아웃</a></li>
                    <li class="navbar_login"><a href="https://www.rootairs.com/mypage/mypage.html">마이페이지</a></li>
                `;
            }
        } else {
            // ✅ 비로그인 상태
            navbarMember.innerHTML = `
                <li class="navbar_signup"><a href="https://www.rootairs.com/member/member_email.html">회원가입</a></li>
                <li class="navbar_login"><a href="https://www.rootairs.com/member/member_login.html">로그인</a></li>
            `;
        }
    })
    .catch(error => console.error("사용자 상태 확인 중 오류 발생:", error));
});

// `fetch` 요청이 들어오는 URL에서 `https://https://` 오류 수정
/*document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        let flashMessages = document.querySelectorAll('.flash-message');
        flashMessages.forEach(function(message) {
            message.style.opacity = "0";
            setTimeout(() => message.remove(), 300); // 부드럽게 제거
        });

        // ✅ 새로고침 시 메시지가 남아있지 않도록 세션에서 제거
        fetch('https://www.rootairs.com/clear_flash', { method: 'POST' });  // URL 오류 수정
    }, 5000);
});*/

