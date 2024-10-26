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