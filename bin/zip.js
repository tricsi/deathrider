const fs = require("fs");
const ect = require("ect-bin");
const { execFile } = require("child_process");

execFile(ect, ["-zip", "-9", "index.html"], err => {
    const stat = fs.statSync("index.html.zip");
    console.log(stat.size);
});