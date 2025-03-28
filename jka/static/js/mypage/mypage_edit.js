
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 JavaScript 로드 완료!");

    // ✅ 비밀번호 확인 모달 요소
    const passwordModalpage = document.getElementById("passwordModal_page");
    const passwordModal = document.getElementById("passwordModal");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordBtn = document.getElementById("confirmPasswordBtn");

    // ✅ 비밀번호 확인 모달 숨기기
   // const passwordModalPage = document.getElementById("passwordModal_page");
   // if (passwordModalPage) {
   //     passwordModalPage.style.display = "none";  // 모달 숨기기
   // }

    // ✅ 회원정보 폼 요소
    const editFormContainer = document.getElementById("editFormContainer");
    const editForm = document.getElementById("Edit_memberinfoForm");

    // ✅ 회원정보 수정 폼이 보이도록 강제 설정
    //if (editFormContainer) {
    //    editFormContainer.style.display = "flex";  // 폼 보이게 설정
    //    editFormContainer.style.flexDirection = "column"; // 세로 정렬
    //    editFormContainer.style.alignItems = "center"; // 중앙 정렬
    //    editFormContainer.style.justifyContent = "center"; // 내부 요소 가운데 정렬
    //    editFormContainer.style.visibility = "visible"; // 혹시 hidden 상태라면 보이게 설정
    //    editFormContainer.style.opacity = "1"; // 투명도 조절
    //}

    // ✅ 사용자 정보 불러오기
    function loadUserInfo() {
        fetch("https://www.rootairs.com/api/mypage/user_info", {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log("📌 불러온 사용자 정보:", data);

            if (data.success) {
                const user = data.user;

                document.getElementById("name").value = user.username;
                document.getElementById("userId").value = user.user_id;
                document.getElementById("phone").value = user.phone_number;
                document.getElementById("postcode").value = user.postal_code;
                document.getElementById("address").value = user.address;
                document.getElementById("extra_address").value = user.add_detail;
                document.getElementById("email").value = user.email;
            } else {
                alert("사용자 정보를 불러올 수 없습니다: " + data.message);
            }
        })
        .catch(error => console.error("🚨 사용자 정보 불러오기 중 오류 발생:", error));
    }

  loadUserInfo();

    // ✅ 비밀번호 확인 버튼 클릭 이벤트
    if (confirmPasswordBtn) {
        confirmPasswordBtn.addEventListener("click", function () {
            const password = passwordInput.value.trim();
            if (!password) {
                alert("비밀번호를 입력하세요.");
                return;
            }

            console.log("📌 비밀번호 확인 요청 시작...");
            fetch("https://www.rootairs.com/api/mypage/verify_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ password })
            })
            .then(response => response.json())
            .then(data => {
                console.log("📌 비밀번호 확인 응답:", data);
                if (data.success) {
                    alert("비밀번호 확인 완료!");
                    passwordModalpage.style.display = "none";
                    passwordModal.style.display = "none";  
                    editFormContainer.style.display = "block";  // ✅ 회원정보 수정 폼 보이기
                    loadUserInfo();  // ✅ 사용자 정보 불러오기
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            })
            .catch(error => {
                console.error("❌ 비밀번호 확인 중 오류 발생:", error);
                alert("비밀번호 확인 중 오류가 발생했습니다.");
            });
        });
    }

    // ✅ 주소찾기 (Daum Postcode API)
    const findAddressBtn = document.getElementById("findAddressBtn");
    if (findAddressBtn) {
        findAddressBtn.addEventListener("click", function () {
            new daum.Postcode({
                oncomplete: function (data) {
                    document.getElementById("postcode").value = data.zonecode;
                    document.getElementById("address").value = data.roadAddress || data.jibunAddress;
                }
            }).open();
        });
    }

    // ✅ 회원정보 수정 폼 제출 이벤트
    if (editForm) {
        editForm.addEventListener("submit", function (event) {
            event.preventDefault();  // ✅ 기본 제출 방지

            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm_password").value.trim();
            const extraAddress = document.getElementById("extra_address").value.trim();
            const postalCode = document.getElementById("postcode").value.trim();
            const address = document.getElementById("address").value.trim();

            // ✅ 비밀번호 유효성 검사
            if (password) {
               // const isValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
               // if (!isValid) {
                 //   alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자로 설정해야 합니다.");
                   // return;
               // }
                if (password !== confirmPassword) {
                    alert("비밀번호가 일치하지 않습니다.");
                    return;
                }
            }

            // ✅ 업데이트할 데이터 확인
            const updateData = {};
            if (password) updateData.password = password;
            if (confirmPassword) updateData.confirm_password = confirmPassword;
            if (extraAddress) updateData.extra_address = extraAddress;
            if (postalCode) updateData.postal_code = postalCode;
            if (address) updateData.address = address;

            if (Object.keys(updateData).length === 0) {
                alert("업데이트할 내용이 없습니다.");
                return;
            }

            // ✅ 서버로 회원정보 업데이트 요청
            fetch("https://www.rootairs.com/api/mypage/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updateData)
            })
            .then(response => response.json())
            .then(data => {
                console.log("📌 회원정보 수정 응답:", data);
                if (data.success) {
                    alert("회원정보가 성공적으로 업데이트되었습니다.");
                    window.location.href = "https://www.rootairs.com/mypage/mypage.html";  // ✅ 마이페이지로 이동
                } else {
                    alert("업데이트 실패: " + data.message);
                }
            })
            .catch(error => {
                console.error("❌ 업데이트 중 오류 발생:", error);
                alert("업데이트 처리 중 오류가 발생했습니다.");
            });
        });
    }
});

