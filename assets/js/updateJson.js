const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "../../posts");
const OUTPUT = path.join(__dirname, "../posts.json");

const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".md"))
    .map(f => {
        const content = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
        // Match frontmatter (group 1) and the body content (group 2)
        const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

        let obj = {
            id: f.replace(".md", ""),
            file: `posts/${f}`
        };

        if (match) {
            const yamlStr = match[1];
            const bodyStr = match[2].trim();

            // Create a preview from the first 120 characters of the body
            obj.preview = bodyStr.length > 120 ? bodyStr.slice(0, 40).trimEnd() + "..." : bodyStr;

            const lines = yamlStr.split('\n');
            lines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const key = line.slice(0, colonIndex).trim();
                    let value = line.slice(colonIndex + 1).trim();

                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    } else if (value.startsWith("'") && value.endsWith("'")) {
                        value = value.slice(1, -1);
                    } else if (value.startsWith("[") && value.endsWith("]")) {
                        value = value.slice(1, -1).split(',').map(item => {
                            let val = item.trim();
                            if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
                            if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
                            return val;
                        }).filter(Boolean);
                    } else if (!isNaN(Number(value)) && value !== '') {
                        value = Number(value);
                    }

                    obj[key] = value;
                }
            });
        }

        return obj;
    });

fs.writeFileSync(OUTPUT, JSON.stringify(files, null, 2));
console.log(`posts.json updated — ${files.length} post(s) found:`);
files.forEach(f => console.log(`  ${f.file}`));