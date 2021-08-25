import cheerio from "cheerio";
import fetch from "node-fetch";
import open from "open";

const URL_TO_CHECK = "https://zotacstore.queue-it.net/?c=zotacstore&e=zotacprod46&cid=en-US";

function print(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

const interval = setInterval(async () => {
  const res = await fetch(URL_TO_CHECK, {
    redirect: "manual",
  });

  if (res.status === 302) {
    return print("queue inactive");
  } else if (res.status === 200) {
    const $ = cheerio.load(await res.text());
    const header = $("#lbHeaderH2").text();

    if (header === "You are now in line") {
      print(`QUEUE ACTIVE -> ${URL_TO_CHECK}`);

      open(URL_TO_CHECK);
      clearInterval(interval);
    } else {
      return print(`got unknown header: ${header}`);
    }
  } else {
    return print(`request failed: ${res.status} ${res.statusText}`);
  }
}, 500);
