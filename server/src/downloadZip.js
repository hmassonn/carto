const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateToken(length) {
  return crypto.randomBytes(length).toString('hex');
}

async function downloadZip() {
    try {
      const url = 'https://donnees.roulez-eco.fr/opendata/instantane';
      const response = await axios({
          url,
          method: 'GET',
          responseType: 'stream',
      });
  
      // Générer un token de 32 octets (64 caractères hexadécimaux)
      const token = generateToken(32);
      const outputPath = path.resolve(__dirname+"/zip_files", token+".zip");
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
  
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve(token));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier ZIP:', error);
      throw error; // Rejeter l'erreur pour la gérer à un niveau supérieur
    }
  }

module.exports = downloadZip;