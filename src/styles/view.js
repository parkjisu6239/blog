const desktopWidth = 992;
const smallMobileWidth = 480;

export const smallMobile = `@media (max-width: ${smallMobileWidth}px)`;
export const mobile = `@media (max-width: ${desktopWidth - 1}px)`;
export const desktop = `@media (min-width: ${desktopWidth}px)`;
