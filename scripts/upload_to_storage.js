// scripts/upload_to_storage.js
// Script CLI para sincronizar archivos PDF a Firebase Storage usando el REST API o Firebase Admin

const fs = require('fs');
const path = require('path');
const https = require('https');

const STORAGE_BUCKET = "morfo2-portal.firebasestorage.app";
const BASE_DIRS = [
    path.join(__dirname, "..", "Morfo 1"),
    path.join(__dirname, "..", "Morfo 2"),
    path.join(__dirname, "..", "Morfo 3"),
    path.join(__dirname, "..", "Bibliografias")
];

function getAllPdfs(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllPdfs(fullPath, arrayOfFiles);
        } else if (file.toLowerCase().endsWith('.pdf')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

console.log("==================================================");
console.log(" MORFO PORTAL - SCANNER DE ARCHIVOS A MIGRAR");
console.log("==================================================");

let allPdfs = [];
BASE_DIRS.forEach(dir => {
    const list = getAllPdfs(dir);
    console.log(`- ${path.basename(dir)}: ${list.length} archivos PDF encontrados.`);
    allPdfs = allPdfs.concat(list);
});

console.log(`\nTotal de archivos detectados: ${allPdfs.length} PDFs`);
console.log(`Bucket destino: ${STORAGE_BUCKET}`);
console.log(`\nPara subir por interfaz gráfica con barra de progreso, abre en tu navegador:`);
console.log(`http://localhost/Morfo/admin_storage_uploader.html\n`);
