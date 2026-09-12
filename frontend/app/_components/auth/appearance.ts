import type { ComponentProps } from "react";
import type { SignIn } from "@clerk/nextjs";

// Explicit colors also theme Clerk popovers rendered outside the page wrapper.
export const authAppearance = {
  variables: {
    colorPrimary: "#16181c",
    colorPrimaryForeground: "#fafaf9",
    colorForeground: "#16181c",
    colorMutedForeground: "#5a5d63",
    colorBackground: "#ffffff",
    colorInput: "#ffffff",
    colorInputForeground: "#16181c",
    colorMuted: "#f2f2f0",
    colorNeutral: "#16181c",
    colorBorder: "#e3e3e0",
    colorDanger: "#b33a46",
    colorSuccess: "#0e8a6a",
    colorRing: "#2d5bd6",
    borderRadius: "5px",
    fontFamily: '"Instrument Sans", var(--font-geist), system-ui, sans-serif',
    fontSize: "14px",
  },
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
} satisfies ComponentProps<typeof SignIn>["appearance"];
