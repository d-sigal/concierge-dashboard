/**
 * Appearance shared by the Clerk sign-in and sign-up forms. Clerk derives its
 * shades from a concrete color, so this mirrors `--primary` in globals.css
 * instead of referencing the CSS variable.
 */
export const clerkAppearance = {
  variables: { colorBackground: '#fff', colorPrimary: '#1F2A44' },
  layout: { logoImageUrl: '/logo.svg' },
};
