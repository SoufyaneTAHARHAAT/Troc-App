        function updateDemandeStatus(index) {
            const selectElement = document.getElementById(`statutAutorisation-${index}`);
            const titleElement = document.getElementById(`demande-title-${index}`);

            if (selectElement && titleElement) {
                if (selectElement.value === 'accepte') {
                    titleElement.textContent = 'Demande acceptée';
                    titleElement.classList.add('accepted');
                    titleElement.classList.remove('rejected');
                } else if (selectElement.value === 'refuse') {
                    titleElement.textContent = 'Demande refusée';
                    titleElement.classList.add('rejected');
                    titleElement.classList.remove('accepted');
                }
            }
        }