"""
Build script to copy CSS/JS files and generate index.html from src to dist directory.
"""
import os
import shutil

def build():
    src_dir = 'src'
    dist_dir = 'dist'
    
    print(f"Building from {src_dir} to {dist_dir}...")

    # Ensure dist directory exists
    if not os.path.exists(dist_dir):
        os.makedirs(dist_dir)
        print(f"Created {dist_dir} directory.")

    # 1. Copy CSS and JS files
    for filename in ['style.css', 'script.js']:
        src_file = os.path.join(src_dir, filename)
        dist_file = os.path.join(dist_dir, filename)
        if os.path.exists(src_file):
            shutil.copy2(src_file, dist_file)
            print(f"Copied {filename} to {dist_dir}.")
        else:
            print(f"Warning: {filename} not found in {src_dir}.")

    # 2. Build index.html
    src_html_path = os.path.join(src_dir, 'index.html')
    dist_html_path = os.path.join(dist_dir, 'index.html')

    if os.path.exists(src_html_path):
        try:
            with open(src_html_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            # Fallback for Windows default encoding if utf-8 fails
            with open(src_html_path, 'r', encoding='mbcs') as f:
                content = f.read()

        # HTML Template
        html_template_start = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Beam Animation</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
"""
        html_template_end = """
    <script src="./script.js"></script>
</body>
</html>"""

        # Logic to extract content from src HTML
        # If it has body tags, strip them to avoid duplication, or just use the whole thing if it's cleaner
        final_content = content
        if "<body>" in content:
            final_content = content.split("<body>")[1]
        if "</body>" in final_content:
            final_content = final_content.split("</body>")[0]
        
        # Remove existing script tags to script.js to avoid double loading if we add our own
        # (Though simple string replacement is crude, it helps here)
        final_content = final_content.replace('<script src="script.js"></script>', '')
        final_content = final_content.replace('<script src="./script.js"></script>', '')

        final_html = html_template_start + final_content + html_template_end

        with open(dist_html_path, 'w', encoding='utf-8') as f:
            f.write(final_html)
        print(f"Built index.html to {dist_dir}.")
    else:
        print(f"Error: {src_html_path} needs to exist.")

if __name__ == "__main__":
    build()
