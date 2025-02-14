// 定义全局变量存储页面文本
let pageText = "";

// 用于注入脚本，获取当前页面的文本内容
function getPageText() {
  return document.body.innerText;
}

// 获取当前活动标签页，并执行代码提取页面文本
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: getPageText
  }, (results) => {
    if (results && results[0] && results[0].result) {
      pageText = results[0].result;
    } else {
      console.error("无法获取页面文本");
    }
  });
});

// 显示对话信息
function appendMessage(sender, text) {
  const chat = document.getElementById("chat");
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  msgDiv.textContent = sender === "user" ? "你: " + text : "Bot: " + text;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

// 发送问题并调用后端接口
document.getElementById("sendBtn").addEventListener("click", () => {
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();
  if (!question) return;
  
  appendMessage("user", question);
  questionInput.value = "";
  
  // 调用后端接口（注意：确保后端服务地址正确，这里使用 localhost:5001）
  fetch("http://localhost:5001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: question,
      page_text: pageText
    })
  })
  .then(response => response.json())
  .then(data => {
    // 后端返回结果，假设返回结构中 answer 为答案
    const answer = data.answer || data.result || "未获取答案";
    appendMessage("bot", answer);
  })
  .catch(err => {
    console.error(err);
    appendMessage("bot", "调用后端接口出错");
  });
});
