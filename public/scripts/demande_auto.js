window.onload = function() {
    // Get the current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();

    // Format the date as "jj-mm-aaaa"
    const formattedDate = `${day}-${month}-${year}`;

    // Set the date fields
    document.getElementById('dateFichier').value = formattedDate;
    document.getElementById('dateDemande').value = formattedDate;
};

// Initialisation des compteurs pour chaque groupe
const groupCounters = {
    g1: 1,
    g2: 1,
    g4: 1,
    g5: 1
};

document.getElementById('groupSelect').addEventListener('change', function() {
    const group = this.value;
    if (group) {
        // Utiliser et incrémenter le compteur pour le groupe sélectionné
        const currentCount = groupCounters[group]++;
        document.getElementById('idDestinataire').value = `${group}.${currentCount}`;
    } else {
        document.getElementById('idDestinataire').value = '';
    }
});