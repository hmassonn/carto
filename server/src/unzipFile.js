const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');

// Fonction pour dézipper le fichier
function unzipFile(file_name) {
  return new Promise((resolve, reject) => {
      const zipFilePath = path.resolve(__dirname+"/zip_files", file_name+'.zip');

      // Répertoire de destination pour les fichiers décompressés
      const outputDir = path.resolve(__dirname+'/uncompress_files', file_name);

      // Créer le répertoire de destination s'il n'existe pas
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // Créer un flux de lecture pour le fichier ZIP
      const zipStream = fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: outputDir }));

      // Promesse pour gérer la fin de la décompression
      zipStream.on('close', () => {
        // console.log('new file: '+zipFilePath);
        resolve();
      });

      zipStream.on('error', (err) => {
        console.error('Erreur lors de la décompression:', err);
        reject(err);
      });
  })
}

module.exports = unzipFile;
