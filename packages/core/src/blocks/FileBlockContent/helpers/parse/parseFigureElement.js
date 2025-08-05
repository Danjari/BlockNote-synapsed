export const parseFigureElement = (figureElement, targetTag) => {
    const targetElement = figureElement.querySelector(targetTag);
    if (!targetElement) {
        return undefined;
    }
    const captionElement = figureElement.querySelector("figcaption");
    const caption = captionElement?.textContent ?? undefined;
    return { targetElement, caption };
};
//# sourceMappingURL=parseFigureElement.js.map