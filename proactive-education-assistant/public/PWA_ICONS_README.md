# PWA Icons Required

To complete the PWA setup, you need to generate and add the following icon files to this `public/` folder:

## Required Icons

1. `icon-192.png` - 192x192 pixels (Android)
2. `icon-512.png` - 512x512 pixels (Android splash screen)
3. `favicon.ico` - 32x32 pixels (Browser tab)

## How to Generate Icons

### Option 1: Use Online Generator (Recommended)
Visit: https://realfavicongenerator.net/
1. Upload your logo/icon image
2. Configure settings for different platforms
3. Download the generated icon pack
4. Copy the files to this folder

### Option 2: Use PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator your-logo.png ./public --icon-only
```

### Option 3: Manual Creation
Use any image editor (Photoshop, GIMP, Figma) to create:
- 192x192 PNG with transparent background
- 512x512 PNG with transparent background
- 32x32 ICO file

## Design Guidelines

- Use simple, recognizable design
- Ensure good contrast
- Test on both light and dark backgrounds
- Use transparent background for PNG files
- Recommended: Blue gradient with "PE" text (matching app theme)

## Temporary Solution

For development/testing, you can use placeholder icons:
1. Create a simple colored square with text
2. Export at required sizes
3. Replace with professional icons before production deployment

## Verification

After adding icons, test the PWA:
1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Open in Chrome DevTools > Application > Manifest
4. Verify all icons are loaded correctly
