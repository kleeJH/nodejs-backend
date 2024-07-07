async function renderHTMLTemplate(
    filePath,
    args) {
    const templateFile = await fs.readFile(filePath);
    let template = templateFile.toString("utf-8");
    for (const key in args) {
        template = template.replaceAll(`%${key}%`, args[key]);
    }
    return template;
}

export { renderHTMLTemplate }