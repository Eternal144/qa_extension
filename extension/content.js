// 监听来自 popup 的消息，请求获取页面内容
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
      // 简单示例，提取 body 内的纯文本
      const content = document.body.innerText;
      sendResponse({ content });
    }
    // 注意：如果是异步响应，则需返回 true
  });
  