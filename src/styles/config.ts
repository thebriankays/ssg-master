export const screens = {
  mobile: {
    width: 768,
  },
  tablet: {
    width: 1024,
  },
  desktop: {
    width: 1440,
  },
  wide: {
    width: 1920,
  },
}

export const breakpoints = {
  mobile: `(max-width: ${screens.mobile.width}px)`,
  tablet: `(max-width: ${screens.tablet.width}px)`,
  desktop: `(min-width: ${screens.desktop.width}px)`,
  wide: `(min-width: ${screens.wide.width}px)`,
}

export default { screens, breakpoints }