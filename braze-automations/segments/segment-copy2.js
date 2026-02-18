// segments.js
import fs from "fs";
import fetch from "node-fetch";

async function fetchSegments() {
  try {
    const url = "https://dashboard-02.braze.eu/engagement/segments?query%5B0%5D%5Bkey%5D=status&query%5B0%5D%5Bvalue%5D=active&query%5B1%5D%5Bkey%5D=&query%5B1%5D%5Bvalue%5D=&limit=20&start=0&sortby=last_edited&sortdir=-1&app_group_id=63d20ec21ca79800489b5c27&fields=description%2Ctags%2Cname%2Cmarked_as_deleted%2Clast_edited_by%2Clast_edited";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "if-none-match": `W/"b441f244adda79d9461765f3b4dbc71a"`,
        "priority": "u=1, i",
        "referer": "https://dashboard-02.braze.eu/engagement/segmenter/segmenter/63d20ec21ca79800489b5c27?start=0&limit=20&globalFilter=&columnFilters%5Bstatus%5D=active&sortby=last_edited&sortdir=-1&display=list",
        "sec-ch-ua": `"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"macOS"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "x-csrf-token": "RiIbNGcMwPoflNg9UdjPgbpn2NCOW6bJe-7T6xpiJBdoCiIz6HNuKGtCkn-7TmidVXxFTfXVYccWLiohRb0-zQ",
        "x-datadog-origin": "rum",
        "x-datadog-parent-id": "8565932089045540767",
        "x-datadog-sampling-priority": "1",
        "x-datadog-trace-id": "2434634745486912148",
        "x-requested-with": "XMLHttpRequest",
        // cookies from your curl - VERY IMPORTANT
        "cookie": `i18next=en; ab.storage.userId.bef30adf-6179-4b26-a3b5-42268996ad95=g%3A689121c9092d971bc637fbf9%7Ce%3Aundefined%7Cc%3A1754383763972%7Cl%3A1754383763973; ab.storage.deviceId.bef30adf-6179-4b26-a3b5-42268996ad95=g%3Ad4971d03-1a4c-7fcb-7886-2d6cc1a17346%7Ce%3Aundefined%7Cc%3A1754383763973%7Cl%3A1754383763973; authy_remember_device=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9RY21WdFpXMWlaWEpmYldWVU9neGxlSEJwY21WelZUb2dRV04wYVhabFUzVndjRzl5ZERvNlZHbHRaVmRwZEdoYWIyNWxXd2hKZFRvSlZHbHRaUTJzWVIvQUFrZlhWUWs2RFc1aGJtOWZiblZ0YVFMWkF6b05ibUZ1YjE5a1pXNXBCam9OYzNWaWJXbGpjbThpQjVoUU9nbDZiMjVsU1NJSVZWUkRCam9HUlVaSklnaFZWRU1HT3cxVVNYVTdDQTJzWVIvQUFrZlhWUWs3Q1drQzJRTTdDbWtHT3dzaUI1aFFPd3hBQ1RvUlpHVjJaV3h2Y0dWeVgybGtTU0lkTmpnNU1USXhZemt3T1RKa09UY3hZbU0yTXpkbVltWTVCanNOVkE9PSIsImV4cCI6IjIwMjUtMDktMTNUMTI6MjE6MjkuNDc2WiIsInB1ciI6bnVsbH19--43563df93329356c06f903220eb47cf7c67b01e7; ag_id___63d20ebb1ca79800489b5be9=63d20ec21ca79800489b5c27; f_ag_id___63d20ebb1ca79800489b5be9=63d20ec21ca79800489b5c27; remember_login_enc_v1=%242%24obzNTzEvVM4VdAu9s1Ln1w%3D%3D%240lfHy0ZXH%2FaJ%2FFwwLzUTVa2q5ZMqcIe%2BBemudXbBW1iyzCrulsqJvPGfyvXQ%0Aep9G; _session_id=2aff6ddd722fc627012f2b43f0228be7; fs_lua=1.1756231338198; fs_uid=#HT1ND#85673972-68cf-4119-a37d-344224bc4f02:ec7c8315-4672-45c6-b05a-1a5f2bf2491f:1756228990194::6#6222d080#/1785920184; ab.storage.sessionId.bef30adf-6179-4b26-a3b5-42268996ad95=g%3A2ee94713-87e6-54d3-bd93-0e2937631a1a%7Ce%3A1756231642062%7Cc%3A1756231340330%7Cl%3A1756231342062; _dd_s=logs=1&id=4dbab983-3917-405f-a3ba-affa852dc139&created=1756228999580&expire=1756232257694&rum=2`
      }
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    fs.writeFileSync("segments.json", JSON.stringify(data, null, 2));
    console.log(`Saved ${Array.isArray(data) ? data.length : 0} segments to segments.json`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

fetchSegments();
