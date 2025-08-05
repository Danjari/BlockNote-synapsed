// TODO: this system should probably be moved / refactored.
// The dependency from schema on this file doesn't make sense
export const defaultProps = {
    backgroundColor: {
        default: "default",
    },
    textColor: {
        default: "default",
    },
    textAlignment: {
        default: "left",
        values: ["left", "center", "right", "justify"],
    },
};
// Default props which are set on `blockContainer` nodes rather than
// `blockContent` nodes. Ensures that they are not redundantly added to
// a custom block's TipTap node attributes.
export const inheritedProps = ["backgroundColor", "textColor"];
//# sourceMappingURL=defaultProps.js.map