document.addEventListener("DOMContentLoaded", async () => {
    const contentDiv = document.getElementById("post-content");
    const headerDiv = document.getElementById("post-header");
    
    // 1. Get the post ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        contentDiv.innerHTML = "<h1>Error</h1><p>No post specified.</p>";
        return;
    }

    try {
        // 2. Fetch posts.json to find the correct file and metadata
        const res = await fetch("/assets/posts.json");
        if (!res.ok) throw new Error("Could not load posts.json");
        const posts = await res.json();
        
        const postData = posts.find(p => p.id === postId);
        
        if (!postData) {
            contentDiv.innerHTML = "<h1>Error</h1><p>Post not found.</p>";
            return;
        }

        // 2.5 Update the page title and header
        document.title = postData.title || "Post";
        
        // Add title and date to the header based on JSON data
        headerDiv.innerHTML = `
            <h1 class="post-title">${postData.title || "Untitled"}</h1>
            <div class="post-meta">
                <span>${postData.date || ""}</span> 
                ${postData.market ? `• <span>Market: ${postData.market.toUpperCase()}</span>` : ""}
            </div>
        `;
        
        // If there's a chart image for the post, optionally display it before content
        if (postData.chart) {
            headerDiv.innerHTML += `<img src="${postData.chart}" alt="Chart" style="max-width: 100%; border-radius: 8px; margin-top: 20px;">`;
        }

        // 3. Fetch the markdown file
        const mdRes = await fetch("/" + postData.file); 
        if (!mdRes.ok) throw new Error("Could not load markdown file");
        
        let markdownText = await mdRes.text();

        // 4. Strip the frontmatter block (everything between the first --- and second ---)
        markdownText = markdownText.replace(/^---[\s\S]*?---\n*/, '');

        // 5. Convert to HTML and display
        const htmlContent = marked.parse(markdownText);
        contentDiv.innerHTML = htmlContent;

    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = "<h1>Error</h1><p>Failed to load the post.</p>";
    }
});
