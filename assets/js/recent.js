// ─── Card Renderer ────────────────────────────────────────────────────────────

function renderCard(post) {
    const outcome = post["r-multiple"];
    const tags = Array.isArray(post.tags) ? post.tags : (post.tags ? [post.tags] : []);
    const slug = post.id;

    return `
    <a class="trade-card" href="/pages/post.html?id=${slug}">

      <div class="trade-card__image-wrap">
        ${post.chart
            ? `<img class="trade-card__image" src="${post.chart}" alt="${post.market ?? "chart"}" loading="lazy">`
            : `<div class="trade-card__image trade-card__image--placeholder"></div>`
        }
      </div>

      <div class="trade-card__body">

        ${post.title ? `<h3 class="trade-card__title">${post.title}</h3>` : ""}

        <div class="trade-card__meta-row">
          <span class="trade-card__market">${(post.market ?? "—").toUpperCase()}</span>
          ${post.playbook ? `<span class="trade-card__playbook">${post.playbook}</span>` : ""}
        </div>

        <div class="trade-card__meta-row">
          <span class="trade-card__outcome"><span class="rr">R:R: ${outcome ?? "—"}</span></span>
          <span class="trade-card__date">${post.date ?? ""}</span>
        </div>

        ${post.preview ? `<p class="trade-card__preview">${post.preview}</p>` : ""}

      </div>
    </a>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function loadRecentTrades() {
    const container = document.getElementById("recent-trades");
    if (!container) return;

    try {
        // 1. Fetch the manifest that contains all metadata AND the previews
        const res = await fetch("assets/posts.json");
        if (!res.ok) throw new Error("Could not load posts.json");
        const posts = await res.json();

        // 2. Filter: tag must include "trading"
        const tradingPosts = posts.filter(p =>
            p.tags && (Array.isArray(p.tags) ? p.tags.includes("trading") : p.tags === "trading")
        );

        // 3. Sort by date descending
        tradingPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4. Take 3 most recent
        const recent = tradingPosts.slice(0, 3);

        if (recent.length === 0) {
            container.innerHTML = `<p class="recent-trades__empty">No trades logged yet.</p>`;
            return;
        }

        // 5. Render
        container.innerHTML = recent.map(renderCard).join("");

    } catch (err) {
        console.error("[recent.js]", err);
        container.innerHTML = `<p class="recent-trades__empty">Could not load recent trades.</p>`;
    }
}

window.addEventListener("DOMContentLoaded", loadRecentTrades);