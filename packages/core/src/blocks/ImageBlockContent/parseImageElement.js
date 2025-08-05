export const parseImageElement = (imageElement) => {
    const url = imageElement.src || undefined;
    const previewWidth = imageElement.width || undefined;
    return { url, previewWidth };
};
//# sourceMappingURL=parseImageElement.js.map