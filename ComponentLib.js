async function createComponent(htmlFilePath, targetElement) {
    try {
        // Fetch the HTML file
        const response = await fetch(htmlFilePath);
        const htmlContent = await response.text();

        // Create a temporary container for the HTML content
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent;

        // Resolve relative paths for images, links, scripts, etc.
        resolveRelativePaths(tempContainer, htmlFilePath);

        if (!targetElement) {
            throw new Error('Target element not found');
        }

        // Insert the HTML content
        while (tempContainer.firstChild) {
            targetElement.appendChild(tempContainer.firstChild);
        }

        // Execute any script tags found in the HTML
        executeScripts(targetElement);
    } catch (error) {
        console.error('Error loading or inserting HTML:', error);
    }
}

function resolveRelativePaths(container, htmlFilePath) {
    const baseUri = new URL(htmlFilePath, window.location.href);
    const elementsWithSrc = container.querySelectorAll('[src]');
    const elementsWithHref = container.querySelectorAll('[href]');

    elementsWithSrc.forEach(el => {
        const src = el.getAttribute('src');
        if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
            el.src = new URL(src, baseUri).href;
        }
    });

    elementsWithHref.forEach(el => {
        const href = el.getAttribute('href');
        if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
            el.href = new URL(href, baseUri).href;
        }
    });
}

function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
        oldScript.parentNode.removeChild(oldScript);
    });
}