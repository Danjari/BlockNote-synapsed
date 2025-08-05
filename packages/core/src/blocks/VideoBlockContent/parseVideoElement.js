export const parseVideoElement = (videoElement) => {
    const url = videoElement.src || undefined;
    const previewWidth = videoElement.width || undefined;
    return { url, previewWidth };
};
//# sourceMappingURL=parseVideoElement.js.map