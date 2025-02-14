from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域请求（注意生产环境下需要更严格的设置）

# 生产环境请使用更安全的密钥
SECRET_KEY = "your_secret_key"

# 模拟用户数据库
USERS = {
    "user1": "password1"
}

def generate_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["username"]
    except Exception as e:
        return None

# 登录接口
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username in USERS and USERS[username] == password:
        token = generate_token(username)
        return jsonify({"token": token})
    else:
        return jsonify({"error": "用户名或密码错误"}), 401

# 提问接口
@app.route("/query", methods=["POST"])
def query():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split("Bearer ")[-1]
    user = verify_token(token)
    if not user:
        return jsonify({"error": "无效或过期的 token"}), 401

    data = request.get_json()
    question = data.get("question")
    page_content = data.get("page_content")
    
    # 调用你的 AI 模型，这里假设你已有模型，示例返回简单回答
    # answer = ai_model.answer(question, page_content)
    answer = f"这是关于问题 '{question}' 的模拟回答，根据页面内容提取的信息。"
    
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
