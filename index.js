import { rejects } from "assert";
import express, { json } from "express";
import fs from "fs";
import { dirname, resolve } from "path";
import path from "path";
import { fileURLToPath } from "url";
import Ajv from 'ajv';
import schemaAuto from './msg_autorisation_schema.js';
import schemaTroc from './msg_troc_schema.js';
import { v4 as uuidv4 } from 'uuid';
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const ajv = new Ajv();
const validateAuto = ajv.compile(schemaAuto);
const validateTroc = ajv.compile(schemaTroc);


app.get("/", (req, res) => {
    res.redirect("/accueil");
});
app.get("/accueil", (req, res) => {
    res.render("accueil.ejs");
});
app.get("/demandes", (req, res) => {
    const folderPath = path.join(__dirname, 'msg_autorisation');

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const demandes = [];

        const filePromises = files.map(file => {
            const filePath = path.join(folderPath, file);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        const jsonData = JSON.parse(data);
                        const isValid = validateAuto(jsonData); // Validation avec Ajv
        
                        if (isValid) {
                            demandes.push({ jsonData });
                        } else {
                            demandes.push({
                                error: 'Demande non conforme',
                                details: validateAuto.errors, // Ajoute les erreurs de validation
                                fileName: file // Ajoute le nom du fichier
                            });
                        }
                        resolve();
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });
        });

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
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const propositions = [];

        const filePromises = files.map(file => {
            const filePath = path.join(dirPath, file);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const jsonData = JSON.parse(data);
                        const isValid = validateTroc(jsonData); // Validation avec Ajv

                        if (isValid) {
                            propositions.push(jsonData);
                        } else {
                            propositions.push({
                                error: 'Message non valide',
                                fileName: file, // Nom du fichier non valide
                                details: validateTroc.errors // Erreurs de validation
                            });
                        }
                        resolve();
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });
        });

        Promise.all(filePromises)
            .then(() => {
                res.render("liste_prop.ejs", { propositions });
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

    fs.readFile('./counterAut.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier du compteur:', err);
            return res.status(500).send('Erreur lors de la récupération du compteur');
        }

        let counterData = JSON.parse(data);
        counterData.lastUsed += 1;

        const idTroqueur = `g3.${counterData.lastUsed}`;
        const idMessage = uuidv4(); // Génère un idMessage unique avec uuid

        const updatedJsonData = {
            idTroqueur: idTroqueur,
            idDestinataire: jsonData.idDestinataire,
            //idFichier: jsonData.idFichier,
            idFichier: idTroqueur,
            dateFichier: jsonData.dateFichier,
            checksum: jsonData.checksum,
            MessageDemandeAutorisation: {
                statutAutorisation: jsonData.statutAutorisation,
                date: jsonData.dateDemande,
                idMessage: idMessage,
                coordonnees: {
                    mail: jsonData.mail,
                    telephone: jsonData.telephone,
                    nomAuteur: jsonData.nomAuteur
                }
            }
        };

        const filePath = `./msg_autorisation/autor_${idTroqueur}_${jsonData.idDestinataire}_${jsonData.dateFichier}.json`;
        
        fs.writeFile(filePath, JSON.stringify(updatedJsonData, null, 2), (err) => {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier JSON:", err);
                return res.status(500).send("Erreur lors de la sauvegarde des données");
            }
            console.log("Données sauvegardées dans", filePath);

            fs.writeFile('./counterAut.json', JSON.stringify(counterData, null, 2), (err) => {
                if (err) {
                    console.error("Erreur lors de l'écriture du fichier du compteur:", err);
                    return res.status(500).send("Erreur lors de la mise à jour du compteur");
                }

                res.redirect("/demandes");
            });
        });
    });
});

app.post("/submit", (req, res) => {
    // Extraire les données du formulaire
    const jsonData = req.body;
    fs.readFile('./counterProp.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier du compteur:', err);
            return res.status(500).send('Erreur lors de la récupération du compteur');
        }

        let counterData = JSON.parse(data);
        counterData.lastUsed += 1; // Increment the last used number

        const idTroqueur = `g3.${counterData.lastUsed}`; // Generate the new idTroqueur
    // Construire l'objet JSON dans le format souhaité
        const formattedData = {
            checksum: jsonData.checksum,
            idTroqueur: idTroqueur,
            idDestinataire: jsonData.idDestinataire,
            //idFichier: jsonData.idFichier,
            idFichier: idTroqueur,
            dateFichier: jsonData.dateFichier,
            messages: [
                {
                    dateMessage: jsonData.dateMessage,
                    statut: jsonData.statut,
                    listeObjet: jsonData.messages[0].listeObjet.map(objet => ({
                        titre: objet.titre,
                        description: objet.description,
                        qualite: parseInt(objet.qualite),
                        quantite: parseInt(objet.quantite)
                    }))
                }
            ]
        };

    // Définir le chemin et le nom du fichier JSON
    const filePath = `./msg_troc/troc_${idTroqueur}_${jsonData.idDestinataire}_${jsonData.dateFichier}.json`;

    // Écrire les données formatées dans le fichier JSON
    fs.writeFile(filePath, JSON.stringify(formattedData, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier JSON:', err);
            return res.status(500).send('Erreur lors de la sauvegarde des données');
        }

        fs.writeFile('./counterProp.json', JSON.stringify(counterData, null, 2), (err) => {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier du compteur:", err);
                return res.status(500).send("Erreur lors de la mise à jour du compteur");
            }

            res.redirect("/propositions");
        });
    });
    });
});


app.post('/submit-proposal', (req, res) => {
    const jsonData = req.body;
    fs.readFile('./counterProp.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier du compteur:', err);
            return res.status(500).send('Erreur lors de la récupération du compteur');
        }

        let counterData = JSON.parse(data);
        counterData.lastUsed += 1; // Increment the last used number

        const idTroqueur = `g3.${counterData.lastUsed}`; // Generate the new idTroqueur

    const formattedData = {
        checksum: jsonData.checksum,
        idTroqueur: idTroqueur,
        idDestinataire: jsonData.idDestinataire,
        idFichier: idTroqueur,
        dateFichier: jsonData.dateFichier,
        messages: [
            {
                dateMessage: jsonData.dateMessage,
                statut: jsonData.statut, // Capture chosen statut
                listeObjet: jsonData.listeObjet.map(objet => ({
                    titre: objet.titre,
                    description: objet.description,
                    qualite: parseInt(objet.qualite),
                    quantite: parseInt(objet.quantite)
                }))
            },
        ],
    }
    

    const filePath = path.join(__dirname, `msg_troc/troc_${idTroqueur}_${jsonData.idDestinataire}_${jsonData.dateFichier}.json`);

    fs.writeFile(filePath, JSON.stringify(formattedData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
            return res.status(500).send('Internal Server Error');
        }
        fs.writeFile('./counterProp.json', JSON.stringify(counterData, null, 2), (err) => {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier du compteur:", err);
                return res.status(500).send("Erreur lors de la mise à jour du compteur");
            }

            res.redirect("/propositions");
        });
    })
    });
});

app.get("/generer-fichiers", (req, res) => {
    const dirPath = path.join(__dirname, 'msg_troc');
    const groupes = ['g1', 'g2', 'g4', 'g5']; // Les critères de recherche

    groupes.forEach((groupe) => {
        const outputFilePath = path.join(__dirname, 'output', `fichiers_${groupe}.json`);
        let contenu = {
            idTroqueur: '',
            idDestinataire: '',
            idFichier: '',
            dateFichier: '',
            messages: [],
            checksum: ''
        };

        // Lire le dossier et rechercher les fichiers commençant par 'troc_g3'
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.error(`Erreur lors de la lecture du dossier msg_troc pour ${groupe}:`, err);
                return res.status(500).send(`Erreur lors de la lecture du dossier pour ${groupe}`);
            }

            files.forEach(file => {
                if (file.startsWith('troc_g3') && file.includes(groupe)) {
                    const filePath = path.join(dirPath, file);
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Lecture et parse du contenu JSON

                    // Ajouter les détails du fichier au contenu agrégé
                    if (!contenu.idTroqueur) contenu.idTroqueur = data.idTroqueur;
                    if (!contenu.idDestinataire) contenu.idDestinataire = data.idDestinataire;
                    if (!contenu.idFichier) contenu.idFichier = data.idFichier;
                    if (!contenu.dateFichier) contenu.dateFichier = data.dateFichier;

                    // Ajouter le checksum du premier message seulement
                    if (!contenu.checksum && data.checksum) {
                        contenu.checksum = data.checksum;
                    }

                    // Ajouter les messages au tableau
                    contenu.messages.push(...data.messages);
                }
            });

            // Écrire l'objet JSON final dans le fichier de sortie
            fs.writeFile(outputFilePath, JSON.stringify(contenu, null, 2), (err) => {
                if (err) {
                    console.error(`Erreur lors de la génération du fichier pour ${groupe}:`, err);
                } else {
                    console.log(`Fichier généré et stocké dans ${outputFilePath}`);
                }
            });
        });
    });

    res.send('Les fichiers commençant par "troc_g3" ont été générés avec succès pour chaque groupe.');
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});