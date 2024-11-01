const schemaTroc = {
        "type": "object",
        "required": [
            "idTroqueur",
            "idDestinataire",
            "idFichier",
            "dateFichier",
            "messages",
            "checksum"
        ],
        "properties": {
            "checksum": {
                "type": "string",
                "description": "String permettant la gestion des erreurs de transfert de donnees"
            },
            "idTroqueur": {
                "type": "string",
                "pattern": "^g\\d\\.\\d+$",
                "description": "Doit etre un string representant l'expediteur."
            },
            "idDestinataire": {
                "type": "string",
                "pattern": "^g\\d\\.\\d+$",
                "description": "Doit etre un string representant le destinataire."
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
            "messages": {
                "type": "array",
                "minItems": 1,
                "items": {
                    "type": "object",
                    "required": [
                        "dateMessage",
                        "statut",
                        "listeObjet"
                    ],
                    "properties": {
                        "dateMessage": {
                            "type": "string",
                            "pattern": "^\\d{2}-\\d{2}-\\d{4}$",
                            "description": "Date au format jj-mm-yyyy."
                        },
                        "statut": {
                            "type": "string",
                            "enum": [
                                "accepte",
                                "valide",
                                "annule",
                                "refuse",
                                "propose"
                            ],
                            "description": "Statut de la proposition : 'accepte', 'valide', 'annule', 'refuse' ou 'propose'."
                        },
                        "listeObjet": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": [
                                    "titre",
                                    "qualite",
                                    "quantite"
                                ],
                                "properties": {
                                    "titre": {
                                        "type": "string",
                                        "description": "Le titre de l'objet."
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "La description de l'objet."
                                    },
                                    "qualite": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 5,
                                        "description": "La qualite de l'objet entre 0 et 5."
                                    },
                                    "quantite": {
                                        "type": "number",
                                        "minimum": 1,
                                        "description": "Quantite de l'objet."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
export default schemaTroc;