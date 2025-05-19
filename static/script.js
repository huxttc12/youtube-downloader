async function download() {
    const url = document.getElementById("url").value;
    const format = document.getElementById("format").value;
    const status = document.getElementById("status");

    status.textContent = "Downloading...";

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, format })
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