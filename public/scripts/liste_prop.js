function updatePropositionStatus(index) {
    const selectElement = document.getElementById(`statut-${index}`);
    const titleElement = document.getElementById(`proposition-title-${index}`);
    const modal = document.getElementById('choiceModal');
    const modalOui = document.getElementById('modalOui');
    const modalNon = document.getElementById('modalNon');

    const propositionElement = document.querySelector(`.proposition[data-index="${index}"]`);
    //const originalIdTroqueur = propositionElement.getAttribute('data-id-destinataire');
    const originalIdDestinataire = propositionElement.getAttribute('data-id-troqueur');
    const originalChecksum = propositionElement.getAttribute('data-checksum');
    const originalDateFichier = propositionElement.getAttribute('data-date-fichier');

    if (selectElement && titleElement && modal && modalOui && modalNon) {
        switch (selectElement.value) {
            case 'accepte':
                titleElement.textContent = 'Proposition acceptée';
                titleElement.className = 'accepted';
                modal.style.display = 'block';
                break;
            case 'valide':
                titleElement.textContent = 'Proposition validée';
                titleElement.className = 'validated';
                modal.style.display = 'block';
                break;
            case 'annule':
                titleElement.textContent = 'Proposition annulée';
                titleElement.className = 'canceled';
                modal.style.display = 'block';
                break;
            case 'refuse':
                titleElement.textContent = 'Proposition refusée';
                titleElement.className = 'rejected';
                modal.style.display = 'block';
                break;
            default:
                titleElement.textContent = 'Message reçu';
                titleElement.className = '';
                break;
        }

        modalOui.addEventListener('click', function() {
            modal.style.display = 'none';
            //document.getElementById('chosenStatut').value = selectElement.value;
            document.getElementById('chosenStatut').value = 'propose';
            proposeForm.classList.remove('hidden');
            
            // Pre-fill the hidden fields with existing data
            //document.getElementById('newIdTroqueur').value = originalIdTroqueur;
            document.getElementById('newIdDestinataire').value = originalIdDestinataire;
            document.getElementById('newChecksum').value = originalChecksum;
            document.getElementById('newDateFichier').value = originalDateFichier;

            window.scrollTo(0, 0);
        });

        modalNon.onclick = function() {
            console.log('User selected Non');
            modal.style.display = 'none';
            // Code to handle "Non"
        };
    }
}

// Close modal when clicking outside of it (optional)
window.onclick = function(event) {
    const modal = document.getElementById('choiceModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
window.onload = function() {
    // Get the current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();

    // Format the date as "jj-mm-aaaa"
    const formattedDate = `${day}-${month}-${year}`;

    // Set the date fields
    document.getElementById('newDateMessage').value = formattedDate;
};
function addNewObject() {
    // Sélectionner le conteneur des champs d'objets
    const container = document.getElementById('objectFieldsContainer');

    // Obtenir le nombre actuel d'objets dans le formulaire
    const objectCount = container.getElementsByClassName('object-entry').length;

    // Cloner le bloc d'entrée d'objet
    const newObject = document.createElement('div');
    newObject.classList.add('object-entry');
    newObject.innerHTML = `
        <hr style="border: 1px solid green; width: 100%; margin: 10px auto;">
        <label for="newTitre${objectCount + 1}">Titre de l'objet:</label>
        <input type="text" name="listeObjet[${objectCount}][titre]" required>
        <br><br>
        
        <label for="newDescription${objectCount + 1}">Description de l'objet:</label>
        <textarea name="listeObjet[${objectCount}][description]"></textarea>
        <br><br>
        
        <label for="newQualite${objectCount + 1}">Qualité (0-5):</label>
        <input type="number" name="listeObjet[${objectCount}][qualite]" min="0" max="5" required>
        <br><br>
        
        <label for="newQuantite${objectCount + 1}">Quantité:</label>
        <input type="number" name="listeObjet[${objectCount}][quantite]" min="1" required>
        <br><br>
    `;

    // Ajouter le nouveau bloc d'objet au conteneur
    container.appendChild(newObject);
}
