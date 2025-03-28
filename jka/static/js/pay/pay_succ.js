 // 네비게이션 스크립트
    document.addEventListener("DOMContentLoaded", function () {
        fetch("https://www.rootairs.com/api/member/status", {
                mcdethod: "GET",
                credentials:"include"
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

