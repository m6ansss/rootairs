document.addEventListener("DOMContentLoaded", function () {
    // 사용자 상태 확인
    fetch("https://www.rootairs.com/api/member/status", {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        const navbarMember = document.getElementById("navbar_member");
        navbarMember.innerHTML = "";  // 기존 내용 초기화

        if (data.is_authenticated) {
            if (data.is_admin) {
                // ✅ 관리자 계정
                const adminUrl = data.admin_url;
                navbarMember.innerHTML =`
                    <li class="navbar_signup"><a href="https://www.rootairs.com/api/member/logout">로그아웃</a></li>
                    <li class="navbar_login"><a href="${adminUrl}">회원정보</a></li>
                `;
            } else {
                // ✅ 일반 로그인 사용자
                navbarMember.innerHTML =`
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

    // 첫 페이지 로딩 시 전체 문의를 불러옵니다.
    fetchInquiryList(1);
});

// ✅ 현재 활성화된 탭 ("all" = 전체 문의, "my" = 나의 문의)
let currentTab = "all";
let CURRENT_USER_ID = null;  // ✅ 로그인한 사용자 ID 저장
let currentPage = 1;  // ✅ 현재 페이지

// ✅ 탭 전환 기능
window.showTab = function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // 현재 탭 상태 변경 및 API 호출
    if (tabId === "all-questions") {
        currentTab = "all";
        fetchInquiryList(1);  // 전체 문의사항 로드
    } else if (tabId === "my-questions") {
        currentTab = "my";
        fetchMyInquiryList(1);  // 나의 문의 로드
    }
}

// ✅ 페이지당 표시할 개수 및 현재 페이지 설정
const itemsPerPage = 5;

// 전체 문의 불러오기
function fetchInquiryList(page = 1) {
    fetch(`https://www.rootairs.com/api/qna/?page=${page}`, {
        method: "GET",
        credentials:"include"
    })
        .then(response => response.json())
        .then(data => {
            displayInquiryList(data.qna);  // 문의사항 목록을 테이블에 표시
            createPaginationButtons(data.total_pages, page, "all");
        })
        .catch(error => {
            alert("로그인 하셔야합니다.");
            window.location.href = "https://www.rootairs.com/member/member_login.html";
            console.error("🚨 문의사항 로드 오류:", error);
        });
}

// 나의 문의 불러오기
function fetchMyInquiryList(page = 1) {
    fetch(`https://www.rootairs.com/api/qna/my?page=${page}`, {
       method: "GET",
       credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        displayMyInquiryList(data.qna_list);  // 나의 문의 목록을 테이블에 표시
        createPaginationButtons(data.total_pages, page, "my");
    })
    .catch(error => console.error("🚨 나의 문의 데이터를 불러오는 중 오류 발생:", error));
}

// 전체 문의 목록 표시
function displayInquiryList(qna) {
    let questionList = document.getElementById("question-list");
    if (!questionList) {
        return;
    }
    questionList.innerHTML = ""; // 기존 내용 비우기

    qna.forEach((item) => {
        let created_at_display = item.created_at ? item.created_at : "날짜 없음";
        let user_id_display = item.user_id ? item.user_id.replace(/'/g, "\\'") : "알 수 없음"; // 작은따옴표 이스케이프 처리
        let row = `
            <tr onclick="viewDetail(${item.qna_id}, ${item.is_secret},'${item.user_id}')">
                <td>${item.qna_id}</td>
                <td><a href="javascript:void(0);">${item.title}</a></td>
                <td>${user_id_display}</td>
                <td>${created_at_display}</td>
            </tr>
        `;
        questionList.innerHTML += row;
    });
}

// 나의 문의 목록 표시
function displayMyInquiryList(qna) {
    let myQuestionList = document.getElementById("my-question-list");
    if (!myQuestionList) {
        return;
    }
    myQuestionList.innerHTML = ""; // 기존 내용 비우기
    if (!Array.isArray(qna) || qna.length === 0) {
        myQuestionList.innerHTML = "<tr><td colspan='3' style='text-align:center;'>등록된 문의가 없습니다.</td></tr>";
        return;
    }

    qna.forEach((item) => {
        let row = `
            <tr onclick="viewDetail(${item.qna_id}, '${item.user_id}')">
                <td>${item.qna_id}</td>
                <td><a href="javascript:void(0);">${item.title}</a></td>
                <td>${item.created_at}</td>
            </tr>
        `;
        myQuestionList.innerHTML += row;
    });
}

// 페이지네이션 버튼 생성
function createPaginationButtons(totalPages, currentPage, tabType="all") {
    let paginationId = tabType === "all" ? "pagination" : "my-pagination";
    let pagination = document.getElementById(paginationId);
    pagination.innerHTML = "";

    // "Previous" 버튼
    let prevButton = document.createElement("button");
    prevButton.innerText = "← Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (tabType === "all") {
            fetchInquiryList(currentPage - 1);
        } else {
            fetchMyInquiryList(currentPage - 1);
        }
    };
    pagination.appendChild(prevButton);

    // 페이지 번호 버튼 생성
    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.classList.add("page-btn");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.onclick = () => {
            if (tabType === "all") {
                fetchInquiryList(i);
            } else {
                fetchMyInquiryList(i);
            }
        };
        pagination.appendChild(pageButton);
    }

    // "Next" 버튼
    let nextButton = document.createElement("button");
    nextButton.innerText = "Next →";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (tabType === "all") {
            fetchInquiryList(currentPage + 1);
        } else {
            fetchMyInquiryList(currentPage + 1);
        }
    };
    pagination.appendChild(nextButton);
}

// 문의사항 상세 페이지 이동
function viewDetail(qna_id, is_secret, writer_id) {
    if (is_secret === 1 && String(writer_id) !== String(CURRENT_USER_ID)) {
        alert("비밀글은 작성자만 볼 수 있습니다.");
        return;
    }
    window.location.href = `/qna/qna_detail.html?id=${qna_id}`;
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    fetchInquiryList(1); // 페이지 로드 시 문의사항 목록 불러오기
});

