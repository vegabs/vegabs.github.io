document.addEventListener("DOMContentLoaded", () => {
    const renderList = (containerId, jsonFile, showImage = false) => {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        return fetch(jsonFile)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${jsonFile}`);
                }
                return response.json();
            })
            .then((items) => {
                items.forEach((item) => {
                    const article = document.createElement("article");
                    article.className = showImage ? "publication project-card" : "publication";

                    const renderWithBoldName = (text) => {
                        const escaped = document.createElement("div");
                        escaped.textContent = text || "";
                        return escaped.innerHTML.replace(/Gabriela Vega/g, "<strong>Gabriela Vega</strong>");
                    };

                    const title = document.createElement("div");
                    title.className = "pub-title";
                    title.innerHTML = renderWithBoldName(item.title);

                    if (showImage) {
                        article.appendChild(title);
                    }

                    if (showImage && item.image) {
                        const img = document.createElement("img");
                        img.src = item.image;
                        img.alt = item.title;
                        img.className = "pub-image";
                        article.appendChild(img);
                    }

                    const content = document.createElement("div");
                    content.className = "pub-content";

                    if (!showImage) {
                        content.appendChild(title);
                    }

                    if (item.description) {
                        const description = document.createElement("p");
                        description.className = "project-description";
                        description.textContent = item.description;
                        content.appendChild(description);
                    }

                    const venueText = item["venue published"] || item.venue_published || "";

                    if (item.url) {
                        const link = document.createElement("a");
                        link.className = "publication-link";
                        link.href = item.url;
                        link.target = "_blank";
                        link.rel = "noreferrer noopener";
                        link.innerHTML = `${renderWithBoldName(venueText)} <span aria-hidden="true">↗</span>`;
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

    const projectGallery = document.querySelector(".project-gallery");
    const projectRequest = renderList("publications-list", "publications.json", true);
    const otherProjectsRequest = renderList("other-projects-list", "others.json", false);

    if (projectGallery) {
        Promise.all([projectRequest, otherProjectsRequest]).then(() => {
            const track = projectGallery.querySelector(".project-track");
            const cards = Array.from(track.querySelectorAll(".project-card"));
            const previousButton = projectGallery.querySelector(".gallery-nav-previous");
            const nextButton = projectGallery.querySelector(".gallery-nav-next");
            const mobileLayout = window.matchMedia("(max-width: 900px)");
            let currentIndex = 0;

            if (!cards.length) {
                previousButton.hidden = true;
                nextButton.hidden = true;
                return;
            }

            const wrapIndex = (index) => (index + cards.length) % cards.length;
            const updateGalleryLayout = () => {
                const isList = mobileLayout.matches;
                projectGallery.classList.toggle("is-list", isList);
                previousButton.hidden = isList || cards.length < 2;
                nextButton.hidden = isList || cards.length < 2;
                cards.forEach((card, cardIndex) => {
                    card.setAttribute("aria-hidden", String(!isList && cardIndex !== currentIndex));
                });
            };

            const showProject = (index) => {
                currentIndex = wrapIndex(index);
                const previousIndex = wrapIndex(currentIndex - 1);
                const nextIndex = wrapIndex(currentIndex + 1);

                cards.forEach((card, cardIndex) => {
                    card.classList.toggle("is-current", cardIndex === currentIndex);
                    card.classList.toggle(
                        "is-previous",
                        cards.length > 2 && cardIndex === previousIndex
                    );
                    card.classList.toggle(
                        "is-next",
                        cards.length > 1 && cardIndex === nextIndex
                    );
                });
                updateGalleryLayout();
            };

            mobileLayout.addEventListener("change", updateGalleryLayout);
            previousButton.addEventListener("click", () => showProject(currentIndex - 1));
            nextButton.addEventListener("click", () => showProject(currentIndex + 1));
            showProject(currentIndex);
        });
    }
});
