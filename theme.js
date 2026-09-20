const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
        const updateThemeButton = () => {
            const isDark = document.documentElement.classList.contains("dark-mode");
            themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            themeButton.setAttribute("aria-pressed", String(isDark));
        };

        themeButton.addEventListener("click", () => {
            const isDark = document.documentElement.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeButton();
        });

        updateThemeButton();
    }

    const contactButton = document.querySelector("#contact-button");
    const contactStatus = document.querySelector("#contact-status");
    if (contactButton && contactStatus) {
        const email = "gabriela@latinxinai.org";

        contactButton.addEventListener("click", async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = email;
                    textArea.setAttribute("readonly", "");
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    textArea.remove();
                }

                contactStatus.textContent = "Email copied 👽";
                window.setTimeout(() => {
                    contactStatus.textContent = "";
                }, 2000);
            } catch (error) {
                contactStatus.textContent = email;
            }
        });
    }
});
