import { rejects } from "assert";
import express, { json } from "express";
import fs from "fs";
import { dirname, resolve } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect("/accueil");
});
app.get("/accueil", (req, res) => {
    res.render("accueil.ejs");
});
app.get("/demandes", (req, res) => {
    const folderPath = path.join(__dirname, 'msg_autorisation'); // Update with your folder path

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Initialize an array to hold the parsed JSON objects
        const demandes = [];

        // Creer un array de promesses pour lire et parser chaque fichier json
        const filePromises = files.map(file => {
            const filePath = path.join(folderPath, file);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        const jsonData = JSON.parse(data);
                        demandes.push(jsonData); // Ajouter la data du json parsé à array
                        resolve();
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });
        });

        // Attendre que tous les fichiers soient lus
        Promise.all(filePromises)
            .then(() => {
                res.render("liste_demandes.ejs", { demandes });
            })
            .catch(error => {
                console.error('Error reading JSON files:', error);
                res.status(500).send('Internal Server Error');
            });
    });
});

app.get("/propositions", (req, res) => {
    const dirPath = path.join(__dirname, 'msg_troc');
    fs.readdir(dirPath, (err, files) => {
        if(err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const propositions = [];

        const filePromises = files.map(file => {
            const filePath = path.join(dirPath, file);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8',(err, data) => {
                    if(err) {
                        return reject(err);
                    }
                    try {
                        const jsonData = JSON.parse(data);
                        propositions.push(jsonData);
                        resolve();
                    }
                    catch(parseError) {
                        reject(parseError);
                    };
                });
            });
        });
        Promise.all(filePromises)
        .then(()=> {
            res.render("liste_prop.ejs", {propositions});
        })
        .catch(error => {
            console.error('Error reading JSON file', error);
            res.status(500).send('Internal server problem');
        });
    });
    
});
app.get("/submit", (req, res) => {
    res.render("proposer.ejs");
});
app.get("/autorisation", (req, res) => {
    res.render("demande_auto.ejs");
});
app.post("/autorisation", (req, res) => {
    const jsonData = req.body;

    // Read the counter file
    fs.readFile('./counter.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier du compteur:', err);
            return res.status(500).send('Erreur lors de la récupération du compteur');
        }

        let counterData = JSON.parse(data);
        counterData.lastUsed += 1; // Increment the last used number

        const idTroqueur = `g3.${counterData.lastUsed}`; // Generate the new idTroqueur
        // Create a new object with idTroqueur first
        const updatedJsonData = {
            idTroqueur: idTroqueur, // Place idTroqueur first
            ...jsonData // Spread the existing jsonData properties
        };
        const filePath = `./msg_autorisation/${jsonData.idFichier}.json`;

        fs.writeFile(filePath, JSON.stringify(updatedJsonData, null, 2), (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier JSON:', err);
                return res.status(500).send('Erreur lors de la sauvegarde des données');
            }
            console.log('Données sauvegardées dans data.json');

            // Write the updated counter back to the file
            fs.writeFile('./counter.json', JSON.stringify(counterData, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier du compteur:', err);
                    return res.status(500).send('Erreur lors de la mise à jour du compteur');
                }

                res.redirect("/accueil");
            });
        });
    });
});

app.post("/submit", (req, res) => {
    // Créer un objet JSON à partir des données du formulaire
    const jsonData = req.body;
    // Définir le chemin et le nom du fichier JSON
    const filePath = `./msg_troc/${jsonData.idFichier}.json`;

    // Écrire les données dans le fichier JSON
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier JSON:', err);
            return res.status(500).send('Erreur lors de la sauvegarde des données');
        }

        console.log('Données sauvegardées dans data.json');
        res.redirect("/accueil");
    });
});

app.post('/propositions', (req, res) => {
    const { checksum, idTroqueur, idDestinataire, idFichier, dateFichier, dateMessage, statut, listeObjet } = req.body;

    const data = {
        checksum,
        idTroqueur,
        idDestinataire,
        idFichier,
        dateFichier,
        messages: [
            {
                dateMessage,
                statut,
                listeObjet,
            },
        ],
    };

    const filePath = path.join(__dirname, `msg_troc/${req.body.idTroqueur}.json`);

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('File generated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});