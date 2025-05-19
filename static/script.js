let ws;

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:9001');
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.progress) {
            document.getElementById('progress').textContent = `Progress: ${data.progress}%`;
        }
    };
    ws.onclose = function() {
        setTimeout(connectWebSocket, 1000); // 断线重连
    };
}

connectWebSocket();

async function fetchResolutions() {
    const url = document.getElementById("url").value;
    const resolutionSelect = document.getElementById("resolution");
    const status = document.getElementById("status");

    if (!url) {
        status.textContent = "Please enter a URL";
        return;
    }

    try {
        const response = await fetch("/resolutions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        const data = await response.json();

        if (data.error) {
            status.textContent = `Error: ${data.error}`;
        } else {
            resolutionSelect.innerHTML = data.resolutions.map(res => `<option value="${res.replace('p', '')}">${res}</option>`).join('');
            status.textContent = "";
        }
    } catch (err) {
        status.textContent = "Error: Failed to fetch resolutions";
    }
}

async function download() {
    const url = document.getElementById("url").value;
    const format = document.getElementById("format").value;
    const resolution = document.getElementById("resolution").value;
    const status = document.getElementById("status");
    const progress = document.getElementById("progress");

    status.textContent = "Starting download...";
    progress.textContent = "Progress: 0%";

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, format, resolution })
        });
        const data = await response.json();

        if (data.error) {
            status.textContent = `Error: ${data.error}`;
        } else {
            status.textContent = "Download complete!";
            const link = document.createElement("a");
            link.href = data.download_url;
            link.download = "";
            link.click();
        }
    } catch (err) {
        status.textContent = "Error: Failed to connect to server";
    }
}
