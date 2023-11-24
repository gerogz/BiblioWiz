function isCitations() {
    const elements = document.querySelectorAll('[href]');

    elements.forEach(element => {
        if (!isNaN(element.innerHTML)) {
            element.style.backgroundColor = 'yellow';
            element.addEventListener('mouseover', showCitationDetails);
            element.addEventListener('mouseout', hideCitationDetails);
        }
    });
}

function showCitationDetails(e) {
    const referenceID = e.target.getAttribute('href').slice(1); // Remove the '#'
    const citationDetails = document.querySelector(`a[name="${referenceID}"]`);

    if (citationDetails) {
        const citationText = citationDetails.parentElement.innerText;
        fetchCitationDetails(citationText, e.clientX, e.clientY, e.target);
    }
}

function fetchCitationDetails(citationText, x, y, targetElement) {
    const endpoint = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(citationText)}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            if (data.message.items && data.message.items.length > 0) {
                const item = data.message.items[0];

                // Extract necessary details
                const title = item.title ? item.title[0] : 'N/A';
                const year = item.published ? item.published['date-parts'][0][0] : 'N/A';
                const authors = item.author ? item.author.map(a => `${a.given} ${a.family}`).join(', ') : 'N/A';
                const abstract = item.abstract ? item.abstract : 'N/A';

                // Display the details in your popup
                displayPopup(x, y, { title, authors, year, abstract }, targetElement);
            }
        })
        .catch(error => {
            console.error('Error fetching citation details:', error);
        });
}

function displayPopup(x, y, details) {
    let popup = document.getElementById('citation-popup');
    
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'citation-popup';
        popup.style.position = 'fixed';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.style.zIndex = '10000';
        document.body.appendChild(popup);
    }

    popup.innerHTML = `
        <strong>Title:</strong> ${details.title}<br>
        <strong>Authors:</strong> ${details.authors}<br>
        <strong>Year:</strong> ${details.year}<br>
        <strong>Abstract:</strong> ${details.abstract}
`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
}

function hideCitationDetails(e) {
    const popup = document.getElementById('citation-popup');
    if (popup && e.target !== popup && !popup.contains(e.relatedTarget)) {
        popup.remove();
    }
}

isCitations();

