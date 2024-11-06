window.onload = function() {
    // Initialiser la date actuelle pour les champs de date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    document.getElementById('dateFichier').value = formattedDate;
    document.getElementById('dateMessage').value = formattedDate;

    // Gérer l'ajout dynamique d'objets
    document.getElementById('ajouterObjet').addEventListener('click', function() {
        const listeObjets = document.getElementById('listeObjets');
        const objetCount = listeObjets.querySelectorAll('.objet').length;
        
        // Créer un nouvel objet
        const nouvelObjet = document.createElement('div');
        nouvelObjet.classList.add('objet');
        nouvelObjet.innerHTML = `
            <label for="titre${objetCount + 1}">Titre de l'objet:</label>
            <input type="text" name="messages[0][listeObjet][${objetCount}][titre]" required>
            <br><br>

            <label for="description${objetCount + 1}">Description de l'objet:</label>
            <textarea name="messages[0][listeObjet][${objetCount}][description]"></textarea>
            <br><br>

            <label for="qualite${objetCount + 1}">Qualité (0-5):</label>
            <input type="number" name="messages[0][listeObjet][${objetCount}][qualite]" min="0" max="5" required>
            <br><br>

            <label for="quantite${objetCount + 1}">Quantité:</label>
            <input type="number" name="messages[0][listeObjet][${objetCount}][quantite]" min="1" required>
            <br><br>
        `;

        // Ajouter le nouvel objet à la liste des objets
        listeObjets.appendChild(nouvelObjet);
    });
};
