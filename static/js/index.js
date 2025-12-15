let index = 0;
let attempts = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-item:center; position:absolute; top:50%; left:50%; transform:translateX(-50%); background:#000; color:#fff; padding:16px;";
    document.body.appendChild(div);
  };

  const gameOver = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const nextLine = () => {
    attempts += 1;
    index = 0;
    if (attempts === 6) {
      gameOver();
    }
  };

  const handleEnterKey = async () => {
    if (attempts >= 6) return;

    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json(); //이렇게 서버에 요청을 보내야하는구나 정도
    // const 정답 = 정답_객체.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      if (!block) continue;

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
      }
      block.style.color = "#fff";
    }

    if (맞은_갯수 === 5) {
      gameOver();
    } else {
      nextLine();
    }
  };

  const handleBackspae = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      if (preBlock) preBlock.innerText = "";
      index -= 1;
    }
  };

  const handleKeydown = (event) => {
    // 🚨 게임 종료 상태면 입력 완전 차단!
    if (attempts === 6) return;

    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;

    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") {
      handleBackspae();
      return;
    }

    if (event.key === "Enter") {
      if (index === 5) handleEnterKey();
      return;
    }

    // 알파벳 입력
    if (65 <= keyCode && keyCode <= 90) {
      if (!thisBlock) return; // 🔒 null 보호
      if (index < 5) {
        thisBlock.innerText = key;
        index += 1;
      }
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString();
      const 초 = 흐른_시간.getSeconds().toString();
      const timeH1 = document.querySelector("#timer");
      timeH1.innerText = `${분.padStart(2, "0")}:${초.padStart(2, "0")}`; //백틱을 쓰면 분초가 나옴
    }

    timer = setInterval(setTime, 1000); // 주기성
    // setTimeout(sayHello, 1000) // 1회성

    //.padStart(2,'0') - 숫자에는 지원하지않음 (문자열만 지원 - toString)
  };

  startTimer();

  window.addEventListener("keydown", handleKeydown);
}

appStart();
