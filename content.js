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
        fetchCitationDetails(citationText, e.clientX, e.clientY);
        // displayPopup(e.clientX, e.clientY, parsedDetails);
    }
}

function fetchCitationDetails(citationText, x, y) {
    const endpoint = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(citationText)}`;
    // Fetch the details from CrossRef
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
                displayPopup(x, y, {title, authors, year, abstract});
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

function hideCitationDetails() {
    const popup = document.getElementById('citation-popup');
    if (popup) {
        popup.remove();
    }
}

isCitations();



// function parseCitation(text) {
//     // This is a simple parser. It may need adjustments based on variations in citation format.
//     const authorRegex = /^(.+?)\./; // Match everything up to the first period as the author(s)
//     const titleRegex = /\. (.+?)\./; // Match everything between two periods as the title
//     const yearRegex = /(\d{4})\.$/; // Match a 4-digit number at the end as the year

//     const authors = (text.match(authorRegex) || [])[1];
//     const title = (text.match(titleRegex) || [])[1];
//     const year = (text.match(yearRegex) || [])[1];

//     return {
//         authors,
//         title,
//         year
//     };
// }


// document.body.addEventListener('mouseover', function(e) {
//     if (e.target.tagName === 'A' && e.target.innerText.match(/^\[\d+\]$/)) {
//         // Extract the reference ID from the href attribute
//         const referenceID = e.target.getAttribute('href').slice(1);  // removing the '#' from the start

//         // Find the citation details using the reference ID
//         const citationDetails = document.querySelector(`a[name="${referenceID}"]`);
//         if (citationDetails) {
//             const citationText = citationDetails.parentElement.innerText;
//             showPopup(e.clientX, e.clientY, citationText);
//         }
//     }
// });



// function showPopup(x, y, text) {
//     // Create a popup div (if it doesn't already exist)
//     let popup = document.getElementById('citation-popup');
//     if (!popup) {
//         popup = document.createElement('div');
//         popup.id = 'citation-popup';
//         popup.style.position = 'fixed';
//         popup.style.backgroundColor = 'white';
//         popup.style.border = '1px solid black';
//         popup.style.padding = '10px';
//         popup.style.zIndex = '10000';
//         document.body.appendChild(popup);
//     }
//     // Set the content and position of the popup
//     popup.innerText = text;
//     popup.style.left = `${x}px`;
//     popup.style.top = `${y}px`;
// }

// document.body.addEventListener('mouseout', function(e) {
//     if (e.target.tagName === 'A' && e.target.innerText.match(/^\[\d+\]$/)) {
//         const popup = document.getElementById('citation-popup');
//         if (popup) {
//             popup.remove();
//         }
//     }
// });



// //using pdf.js library, extract text from PDF
// // function extractTextFromPDF(url) {
// //     pdfjsLib.getDocument(url).promise.then(function(pdf) {
// //         let totalPages = pdf.numPages;
// //         let allTextPromises = [];

// //         for (let i = 1; i <= totalPages; i++) {
// //             let pageTextPromise = pdf.getPage(i).then(function(page) {
// //                 return page.getTextContent();
// //             }).then(function(textContent) {
// //                 return textContent.items.map(item => item.str).join(' ');
// //             });
// //             allTextPromises.push(pageTextPromise);
// //         }

// //         Promise.all(allTextPromises).then(function(pageTexts) {
// //             let fullText = pageTexts.join(' ');
// //             sendTextToGROBID(fullText);
// //         });
// //     });
// // }

// // //detect if current page is a PDF and if the extension is active, then call extractTextFromPDF
// // if (window.location.href.endsWith('.pdf')) {
// //     extractTextFromPDF(window.location.href);
// // }

// // This script interacts with web pages.

// document.body.addEventListener('mouseover', function(e) {
//     if (e.target.tagName === 'A' && e.target.innerText.match(/^\[\d+\]$/)) {
//         // Extract the reference ID from the href attribute
//         const referenceID = e.target.getAttribute('href').slice(1);  // removing the '#' from the start

//         // Find the citation details using the reference ID
//         const citationDetails = document.querySelector(`a[name="${referenceID}"]`);
//         if (citationDetails) {
//             const citationText = citationDetails.parentElement.innerText;
//             showPopup(e.clientX, e.clientY, citationText);
//         }
//     }
// });

// console.log("Content script injected");

// (function() {

//     //Parse the document's references and return a structured format
//     function parseReferences() {
//         const references = document.querySelectorAll('reference_selector_here');
//     }
// })








// const fullText = document.body.innerText;
// sendTextToGROBID(fullText);


// //send full text to GROBID
// async function sendTextToGROBID(text) {
//     try {
//         const response = await fetch('http://localhost:8070/api/processFulltextDocument', {
//             method: 'POST',
//             body: text,
//             headers: {
//                 'Content-Type': 'text/plain'
//             }
//         });

//         if (!response.ok) {
//             throw new Error('GROBID responded with status: ${response.status}');
//         }

//         const data = await response.json();
//         console.log(data);

//         //Parse the received data and then highlight the citations
//         parseGROBIDResponse(data);
//         highlightCitations();
        
//     } catch (error) {
//         console.error("Error sending data to GROBID:", error);
//     }
// }

// let detectableCitations = [];

// //GROBID will be in TEI format, an XML structure.
// //To parse this into a usable format for your application, 
// //you'll need to convert this XML data into a JavaScript object/array.
// function parseGROBIDResponse(data) {
//     // Use DOMParser to convert the string into an XML Document
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(data, "text/xml");

//     //Check for XML parsing errors
//     if (xmlDoc.getElementsByTagName("parsererror").length) {
//         console.error("Error parsing XML");
//         return;
//     }

//     //Now, extract the desired information from the parsed XML
//     const references = xmlDoc.querySelectorAll('listBibl biblStruct');

//     grobidData = Array.from(references).map((ref, index) => {
//         const citationNumber = index + 1; //assuming a 1-based index for citations
//         detectableCitations.push(citationNumber); //store the citation number

//         return {
//             number: citationNumber,
//             title: ref.querySelector('title')?.textContent,
//             author: Array.from(ref.querySelectorAll('author')).map(a => a.textContent).join(', '),
//             abstract: ref.querySelector('abstract')?.textContent,
//             DOI: ref.querySelector('idno[type="DOI"]')?.textContent
//         };
//     })
// }   

// //Identify and highlight in-text citations in a web page
// function highlightCitations() {
//     //A regular expression  to match patterns like [1], [25], etc. 
//     //These are typically used in academic papers and articles to indicate in-text citations.
//     const regex = /\[\d+\]/g;
//     const bodyText = document.body.innerHTML;
    
//     //"replace" function is used to substitute each in-text citation with a span that has 
//     //a class of "citation". This allows easier interaction (like hover effects).
//     const updatedText = bodyText.replace(/\[\d+\]/g, function(match) {
//         const citationNumber = parseInt(match.replace(/\[|\]/g, ''));
//         if (detectableCitations.includes(citationNumber)) {
//             return `<span class="citation">${match}</span>`;
//         }
//         return match; //return the original match if not detectable
//     });
    
//     document.body.innerHTML = updatedText;
// }

// //As soon as the script runs, it will automatically search for in-text citations
// //in the web page and wrap them in spans.
// highlightCitations();

// //This event listener will listen for "mouseover" events (i.e., when the user hovers their mouse over an element).
// document.body.addEventListener('mouseover', function(event) {
//     //Checks if element being hovered over has a class of "citation"
//     if (event.target.classList.contains('citation')) {
//         const refNumber = parseInt(event.target.innerText.replace(/\[|\]/g, ''));
//         const reference = grobidData.find(ref => ref.number === refNumber);
//     }
// })

// //When a user hovers over an in-text citation, use the "refNumber" to find the corresponding reference data








// // Function to load a script dynamically
// function loadScript(url, callback) {
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = url;
//     script.onload = callback;
//     document.body.appendChild(script);
// }

// console.log("Script loading started...");

// // Load pdf.js library dynamically
// loadScript(chrome.runtime.getURL('build/pdf.js'), function () {
//     // pdf.js library has loaded
//     console.log("pdf.js script has loaded");
//     if (document.contentType === "application/pdf" || window.location.href.endsWith('.pdf')) {
//         console.log("PDF detected!");

//         // Use pdfjsLib here
        // pdfjsLib.getDocument('URL_TO_PDF').promise.then(function(pdf) {
        //     let totalPages = pdf.numPages;
        //     let allText = [];

        //     for (let i = 1; i <= totalPages; i++) {
        //         pdf.getPage(i).then(function (page) {
        //             page.getTextContent().then(function (textContent) {
        //                 allText.push(...textContent.items.map(item => item.str));
        //                 if (allText.length === totalPages) {
        //                     let extractedText = allText.join(' ');
        //                     // Now you have the extracted text in 'extractedText' variable
        //                 }
        //             });

        //             // Render the PDF with a text layer for hover detection
        //             let scale = 1.5;
        //             let viewport = page.getViewport({ scale: scale });

        //             let canvas = document.createElement('canvas');
//                     document.body.appendChild(canvas);
//                     let context = canvas.getContext('2d');
//                     canvas.height = viewport.height;
//                     canvas.width = viewport.width;

//                     let renderContext = {
//                         canvasContext: context,
//                         viewport: viewport,
//                         textLayerMode: pdfjsLib.TextLayerMode.ENABLE
//                     };

//                     page.render(renderContext);

//                     let textLayerDiv = document.createElement('div');
//                     textLayerDiv.setAttribute('id', 'text-layer');
//                     document.body.appendChild(textLayerDiv);

//                     let textLayer = new pdfjsLib.TextLayerBuilder({
//                         textLayerDiv: textLayerDiv,
//                         pageIndex: i - 1, // pageIndex is 0-based
//                         viewport: viewport,
//                     });

//                     page.getTextContent().then(function (textContent) {
//                         textLayer.setTextContent(textContent);
//                         textLayer.render();
//                     });
//                 });
//                 // Fetch annotations and look for internal links
//                 page.getAnnotations().then(function (annotations) {
//                     annotations.forEach(function (annotation) {
//                         if (annotation.subtype === 'Link' && annotation.dest) {
//                             // This is an internal link, possibly from an in-text citation to its bibliography entry
//                             // You can utilize annotation.rect for the position of the link on the page
//                             handleInternalLink(annotation);
//                         }
//                     });
//                 });
//                 // Log details of internal link
//                 function handleInternalLink(annotation) {
//                     console.log("Found an internal link at:", annotation.rect);
//                     console.log("The link points to destination:", annotation.dest);
//                 }
//             }

//             // Add hover detection
//             setTimeout(() => {
//                 let textLayer = document.querySelector('.textLayer');
//                 if (textLayer) {
//                     textLayer.addEventListener('mouseover', function (event) {
//                         if (event.target.classList.contains('textLayer')) {
//                             let hoveredText = event.target.textContent;

//                             if (hoveredText.startsWith('[') && hoveredText.endsWith(']')) {
//                                 alert('Hovered over citation: ' + hoveredText);
//                             }
//                         }
//                     });
//                 }
//             }, 5000);  // 5 seconds delay; Adjust delay as needed
//         });
//     }
// });

    

//     document.getElementById('text-layer').addEventListener('mouseover', function(event) {
//         if (event.target.classList.contains('textLayer')) {
//             let hoveredText = event.target.textContent;
    
//             // Check if the hovered text resembles an in-text citation
//             if (isCitation(hoveredText)) {
//                 // Further processing, e.g., fetching details from GROBID or Google Scholar
//                 fetchReferenceDetails(hoveredText);
//             }
//         }
//     });
    
//     function isCitation(text) {
//         // A basic check; this can be enhanced based on typical in-text citation patterns
//         return text.startsWith('[') && text.endsWith(']');
//     }
    
//     function fetchReferenceDetails(citation) {
//         // Use GROBID or another method to fetch detailed info about the reference
//         // and display it to the user
//     }
    
    

