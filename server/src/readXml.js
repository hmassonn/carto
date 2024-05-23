const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Fonction pour lire et analyser le fichier XML
async function readXml(file_path) {
  try {
    const xmlFilePath = path.resolve(__dirname+"/uncompress_files", file_path+'/PrixCarburants_instantane.xml');
    // Lire le contenu du fichier XML
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

    // Créer un parseur XML
    const parser = new xml2js.Parser();

    // Analyser le fichier XML en un objet JavaScript
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        throw err;
      }

      // Afficher l'objet JavaScript résultant
      console.log('Objet JavaScript:', JSON.stringify(result, null, 2));
    });
  } catch (error) {
    console.error('Erreur lors de la lecture ou de l\'analyse du fichier XML:', error);
  }
}

module.exports = readXml;
