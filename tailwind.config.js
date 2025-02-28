module.exports = {
  content: ["./src/**/*.{tsx,jsx,ts,js,css}", "./*.{html}"],
  theme: {
    extend: {
      colors: {
        "neutral-dark": "#121212",  // Dark Gray (Background)
        "neutral-light": "#F5F5F7", // Light Gray (Text)

        secondary: "#8C8C8C", // Medium Gray (Secondary)
        primary: "#9BD7F6",  // Muted Sky Blue
        danger: "#C00000",   // Bold Red
        success: "#008827",  // Deep Green
        warning: "#EAB308",  // Warm Yellow

        "brand-vinted": "#007782", // Vinted Brand Color
      },
      keyframes: {
        "fade-out": {
          "from": {
            opacity: "1",
          },
          "to": {
            opacity: "0",
          },
        },
        "slide-in-left": {
          "from": {
            opacity: "0",
            transform: "translateX(-100%)",
          },
          "to": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        fadeOut: 'fade-out 150ms ease-in-out forwards',
        slideInLeft: 'slide-in-left 150ms ease-in-out',
      }
    },
  },
  plugins: [],
}
