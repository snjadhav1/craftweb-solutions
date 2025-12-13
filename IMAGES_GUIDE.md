# Co-Founders Images Setup Guide

## Image Requirements

Place the following images in your project directory:

### Required Image Files:

1. **1.jpeg** - Atish Gatkal (Co-Founder & Client Success Head)
   - Recommended size: 600x600px minimum
   - Format: JPEG, PNG, or WebP
   - Square or portrait orientation works best

2. **2.jpeg** - Saniya Bhosale (Co-Founder & Backend / DevOps Lead)
   - Recommended size: 600x600px minimum
   - Format: JPEG, PNG, or WebP
   - Square or portrait orientation works best

3. **3.jpeg** - Swadesh Jadhav (Co-Founder & Product / Frontend Lead)
   - Recommended size: 600x600px minimum
   - Format: JPEG, PNG, or WebP
   - Square or portrait orientation works best

## Image Specifications:

- **Minimum Resolution**: 600x600 pixels
- **Aspect Ratio**: 1:1 (square) preferred
- **File Size**: Under 500KB for optimal loading
- **Format**: JPEG (.jpg or .jpeg), PNG (.png), or WebP (.webp)
- **Quality**: High-quality, professional headshots

## File Location:

Place all three image files in the same directory as your HTML files:
```
CRAFTWEB_SOLUTIONS/
├── index.html
├── about.html
├── 1.jpeg (Atish)
├── 2.jpeg (Saniya)
├── 3.jpeg (Swadesh)
├── styles.css
├── about.css
└── about.js
```

## Fallback Images:

If your images are not available, the page will automatically use placeholder images from Unsplash:
- Professional male portrait for Atish
- Professional female portrait for Saniya
- Professional male portrait for Swadesh

## Tips for Best Results:

1. **Professional Headshots**: Use clear, well-lit professional photos
2. **Consistent Style**: All three photos should have similar background/lighting
3. **Face Centered**: Ensure faces are centered and clearly visible
4. **High Quality**: Use high-resolution images to look sharp on all devices
5. **Optimized**: Compress images without losing quality for faster loading

## Alternative Naming:

If you prefer different image names, update the `src` attribute in about.html:

```html
<!-- Change this: -->
<img src="1.jpeg" alt="Atish Gatkal">

<!-- To your preferred name: -->
<img src="atish-photo.jpg" alt="Atish Gatkal">
```

---

**Note**: The page is fully responsive and will display beautifully on all devices, from mobile phones to large desktop screens.
