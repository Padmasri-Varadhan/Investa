const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function traverseAndReplace(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) return console.log('Unable to scan directory: ' + err);

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (stats.isDirectory()) {
                    traverseAndReplace(filePath);
                } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
                    replaceContent(filePath);
                }
            });
        });
    });
}

function replaceContent(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return console.log(err);

        let result = data;

        // Colors
        result = result.replace(/#0288d1/g, '#007DA3');
        result = result.replace(/#01579b/g, '#005b7a'); // Darker shade of 007da3
        result = result.replace(/#e3f2fd/g, '#e6f5fa'); // Lighter shade of 007da3

        // Fonts
        result = result.replace(/Inter/g, 'Noto Sans');

        // Font Import in index.css
        if (filePath.endsWith('index.css')) {
            result = result.replace(/family=Noto\+Sans:wght@300;400;500;600;700;800&display=swap/g, 'family=Noto+Sans:wght@300;400;500;600;700;800&display=swap');
            result = result.replace(/family=Noto Sans:wght@300;400;500;600;700;800&display=swap/g, 'family=Noto+Sans:wght@300;400;500;600;700;800&display=swap');
        }

        if (result !== data) {
            fs.writeFile(filePath, result, 'utf8', (err) => {
                if (err) return console.log(err);
                console.log('Updated ' + filePath);
            });
        }
    });
}

traverseAndReplace(directoryPath);
