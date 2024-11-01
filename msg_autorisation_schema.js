const schema = {
        "type": "object",
        "required": [
            "idTroqueur",
            "idDestinataire",
            "idFichier",
            "dateFichier",
            "MessageDemandeAutorisation",
            "checksum"
        ],
        "properties": {
            "checksum": {
                "type": "string",
                "description": "String permettant la gestion des erreurs de transfert de donnees"
            },
            "idFichier": {
                "type": "string",
                "pattern": "^g\\d\\.\\d+$",
                "description": "Format obligatoire : 'g' suivi d'un seul chiffre, un point, et un nombre."
            },
            "dateFichier": {
                "type": "string",
                "pattern": "^\\d{2}-\\d{2}-\\d{4}$",
                "description": "Date au format jj-mm-yyyy."
            },
            "idDestinataire": {
                "type": "string",
                "pattern": "^g\\d\\.\\d+$",
                "description": "Doit etre un string representant le destinataire."
            },
            "idTroqueur": {
                "type": "string",
                "pattern": "^g\\d\\.\\d+$",
                "description": "Doit etre un string representant le troqueur."
            },
            "MessageDemandeAutorisation": {
                "type": "object",
                "required": [
                    "statutAutorisation",
                    "date",
                    "idMessage"
                ],
                "properties": {
                    "coordonnees": {
                        "type": "object",
                        "properties": {
                            "mail": {
                                "type": "string",
                                "description": "Adresse mail de l'utilisateur"
                            },
                            "telephone": {
                                "type": "string",
                                "description": "Numéro de téléphone de l'utilisateur"
                            },
                            "nomAuteur": {
                                "type": "string",
                                "description": "Nom de l'auteur du message"
                            }
                        },
                        "description": "Coordonnées du troqueur"
                    },
                    "statutAutorisation": {
                        "type": "string",
                        "enum": [
                            "accepte",
                            "refuse",
                            "demande"
                        ],
                        "description": "Statut de la demande d'autorisation"
                    },
                    "date": {
                        "type": "string",
                        "pattern": "^\\d{2}-\\d{2}-\\d{4}$",
                        "description": "Date à laquelle la demande a été effectuée"
                    },
                    "idMessage": {
                        "type": "string",
                        "description": "Identifiant unique du message de demande d'autorisation"
                    }
                }
            }
        }
}
export default schema;