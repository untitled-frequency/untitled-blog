// 1. Immediately apply the theme to the HTML element to prevent any flashing
let currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

// 2. Wait for the page to load before attaching events to the button
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;

    let currentRotation = 0;

    if (btn) {
        // Set the initial icon
        btn.innerHTML = currentTheme === "light" ? moonIcon : sunIcon;

        // Attach click listener
        btn.addEventListener("click", () => {
            // Toggle theme
            currentTheme = currentTheme === "dark" ? "light" : "dark";

            // Apply it immediately via CSS variables
            document.documentElement.setAttribute("data-theme", currentTheme);
            localStorage.setItem("theme", currentTheme);

            // Rotate 360 degrees so it always ends up right-side up!
            currentRotation += 360;
            btn.style.transform = `rotate(${currentRotation}deg)`;
            btn.innerHTML = currentTheme === "light" ? moonIcon : sunIcon;
        });
    }
});

