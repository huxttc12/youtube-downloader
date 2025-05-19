from flask import Flask, request, jsonify, render_template
import subprocess
import os
import uuid

app = Flask(__name__)
DOWNLOAD_DIR = "downloads"

# 确保下载目录存在
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    url = data.get("url")
    format = data.get("format", "webm")  # 默认 WebM

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # 生成唯一文件名
    filename = f"{uuid.uuid4()}.{format}"
    output_path = os.path.join(DOWNLOAD_DIR, filename)

    # 构建 yt-dlp 命令
    cmd = [
        "yt-dlp",
        "--merge-output-format", format,
        "-f", "bestvideo[height<=2160]+bestaudio/best",
        "-o", output_path,
        url
    ]

    try:
        # 执行 yt-dlp 命令
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return jsonify({"download_url": f"/downloads/{filename}"})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Download failed: {e.stderr}"}), 500

@app.route("/downloads/<filename>")
def serve_file(filename):
    return app.send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
