async function isCitations() {
    const container = document.body; // Use a more specific container if possible
    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
}

function handleMouseOver(e) {
    const element = e.target;
    if (!isNaN(element.innerHTML)) {
        element.classList.add('highlighted');
        const referenceID = element.getAttribute('href').slice(1);
        const citationDetails = document.querySelector(`a[name="${referenceID}"]`);
        if (citationDetails) {
            const citationText = citationDetails.parentElement.innerText;
            fetchCitationDetails(citationText, e.clientX, e.clientY);
        }
    }
}

function handleMouseOut(e) {
    const element = e.target;
    if (!isNaN(element.innerHTML)) {
        element.classList.remove('highlighted');
        hideCitationDetails();
    }
}

async function fetchCitationDetails(citationText, x, y) {
    try {
        const endpoint = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(citationText)}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.message.items && data.message.items.length > 0) {
            const item = data.message.items[0];
            const details = {
                title: item.title ? item.title[0] : 'N/A',
                year: item.published ? item.published['date-parts'][0][0] : 'N/A',
                authors: item.author ? item.author.map(a => `${a.given} ${a.family}`).join(', ') : 'N/A',
                abstract: item.abstract ? item.abstract : 'N/A'
            };
            displayPopup(x, y, details);
        }
    } catch (error) {
        console.error('Error fetching citation details:', error);
    }
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

function hideCitationDetails() {
    const popup = document.getElementById('citation-popup');
    if (popup) {
        popup.remove();
    }
}

isCitations();
