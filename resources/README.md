# Resources Folder

Place your PDF files in this directory. The filenames should match the `href` values in `resources.html`.

## Expected files:
- `ai-ml-cheatsheet.pdf`
- `python-quick-reference.pdf`
- `dsa-roadmap.pdf`
- `neural-networks-guide.pdf`
- `python-libraries-toolkit.pdf`
- `big-o-complexity-chart.pdf`

## Adding new resources:
1. Add your PDF file to this folder
2. Add a new `<article class="resource-card">` block in `resources.html`
3. Set the `data-category` attribute to one of: `ai`, `python`, `dsa`
4. Update the `href` in the download button to match your filename
