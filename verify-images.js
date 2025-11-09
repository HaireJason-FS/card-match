const fs = require("fs");
const path = require("path");

const imageDir = path.resolve(__dirname, "src", "IMG");

// List all image filenames you expect to exist:
const expectedImages = [
  "c-logo.png",
  "c++-logo.png",
  "csharp-logo.png",
  "css3-logo.png",
  "goMascot-logo.png",
  "HTML-logo.png",
  "java-logo.png",
  "JavaScript-logo.png",
  "php-logo.png",
  "python-logo.png",
  "card-flip-card-image.png",
];

// Helper function to check for missing files
let missing = [];
expectedImages.forEach((img) => {
  const filePath = path.join(imageDir, img);
  if (!fs.existsSync(filePath)) {
    missing.push(img);
  }
});

if (missing.length > 0) {
  console.error("\n Missing image files in /src/IMG/:");
  missing.forEach((img) => console.error("   - " + img));
  console.error("\nPlease double-check the filenames and case sensitivity.");
  process.exit(1);
} else {
  console.log(" All expected images found in /src/IMG/");
}
