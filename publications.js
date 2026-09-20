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
            let currentIndex = 0;

            const wrapIndex = (index) => (index + cards.length) % cards.length;

            const showProject = (index) => {
                currentIndex = wrapIndex(index);
                const order = [
                    wrapIndex(currentIndex - 1),
                    currentIndex,
                    wrapIndex(currentIndex + 1),
                    ...cards.map((_, cardIndex) => cardIndex)
                        .filter((cardIndex) => ![
                            wrapIndex(currentIndex - 1),
                            currentIndex,
                            wrapIndex(currentIndex + 1)
                        ].includes(cardIndex))
                ];

                order.forEach((cardIndex) => {
                    const card = cards[cardIndex];
                    card.classList.toggle("is-current", cardIndex === currentIndex);
                    track.appendChild(card);
                });

                requestAnimationFrame(() => {
                    const currentCard = cards[currentIndex];
                    const isVertical = window.matchMedia("(max-width: 900px)").matches;

                    if (isVertical) {
                        const centeredTop = currentCard.offsetTop - (track.clientHeight - currentCard.offsetHeight) / 2;
                        track.scrollTo({ top: centeredTop, behavior: "smooth" });
                    } else {
                        const centeredLeft = currentCard.offsetLeft - (track.clientWidth - currentCard.offsetWidth) / 2;
                        track.scrollTo({ left: centeredLeft, behavior: "smooth" });
                    }
                });
            };

            cards.forEach((card, cardIndex) => {
                const image = card.querySelector(".pub-image");
                image.addEventListener("click", () => showProject(cardIndex));
            });

            if (cards.length) {
                showProject(currentIndex);
            }
        });
    }
});
