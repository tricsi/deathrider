const fs = require("fs");
const ect = require("ect-bin");
const glob = require("glob");
const { execFile } = require("child_process");
const texturePacker = require("free-tex-packer-core");

const files = glob.sync("./sprite/*.png");
const images = [];

for (const path of files) {
    images.push({ path, contents: fs.readFileSync(path) });
}

texturePacker(images, {
    textureName: "texture",
    padding: 1,
    allowRotation: false,
    prependFolderName: false,
    removeFileExtension: true,
    packer: "MaxRectsPacker",
    packerMethod: "SmartArea",
    tinify: false,
    exporter: {
        fileExt: "ts",
        template: "./bin/sprite.tpl",
    }
}, (files, err) => {
    if (err) {
        console.error(err);
        return;
    }
    for (const file of files) {
        const filename = "./src/asset/" + file.name;
        fs.writeFileSync(filename, file.buffer);
        if (!filename.match(/\.png*/i)) {
            continue;
        }
        execFile(ect, ["-strip", "-9", filename], err => {
            const stat = fs.statSync(filename);
            console.log(stat.size);
        });
    }
});
