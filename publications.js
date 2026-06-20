document.addEventListener("DOMContentLoaded", () => {
    const renderList = (containerId, jsonFile, showImage = false) => {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        fetch(jsonFile)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${jsonFile}`);
                }
                return response.json();
            })
            .then((items) => {
                items.forEach((item) => {
                    const article = document.createElement("article");
                    article.className = "publication";

                    if (showImage && item.image) {
                        const img = document.createElement("img");
                        img.src = item.image;
                        img.alt = item.title;
                        img.className = "pub-image";
                        article.appendChild(img);
                    }

                    const content = document.createElement("div");
                    content.className = "pub-content";

                    const renderWithBoldName = (text) => {
                        const escaped = document.createElement("div");
                        escaped.textContent = text || "";
                        return escaped.innerHTML.replace(/Gabriela Vega/g, "<strong>Gabriela Vega</strong>");
                    };

                    const title = document.createElement("div");
                    title.className = "pub-title";
                    title.innerHTML = renderWithBoldName(item.title);
                    content.appendChild(title);

                    const author = document.createElement("p");
                    author.innerHTML = renderWithBoldName(item.author);
                    content.appendChild(author);

                    const venueText = item["venue published"] || item.venue_published || "";

                    if (item.url) {
                        const link = document.createElement("a");
                        link.className = "publication-link";
                        link.href = item.url;
                        link.target = "_blank";
                        link.rel = "noreferrer noopener";
                        link.innerHTML = `Published at ${renderWithBoldName(venueText)} <span aria-hidden="true">→</span>`;
                        content.appendChild(link);
                    }

                    article.appendChild(content);
                    container.appendChild(article);
                });
            })
            .catch((error) => {
                container.innerHTML = "<p>Failed to load items.</p>";
                console.error(error);
            });
    };

    renderList("publications-list", "publications.json", true);
    renderList("other-projects-list", "others.json", false);
});
