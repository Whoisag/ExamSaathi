const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: "home", url: "http://localhost:3000/" },
  { name: "dashboard", url: "http://localhost:3000/dashboard/jee-main/physics" },
  { name: "formulas", url: "http://localhost:3000/formulas/jee-main/physics" },
  { name: "my_dashboard", url: "http://localhost:3000/my-dashboard" },
  { name: "about", url: "http://localhost:3000/about" },
  { name: "evaluation", url: "http://localhost:3000/evaluation" },
];

console.log("Capturing screenshots for all routes...");

for (const r of routes) {
  // Desktop
  const deskFile = path.join(outDir, `${r.name}_desktop.png`);
  console.log(`Capturing Desktop: ${r.url} -> ${deskFile}`);
  try {
    execSync(
      `google-chrome --headless=new --disable-gpu --no-sandbox --window-size=1280,900 --virtual-time-budget=2500 --screenshot="${deskFile}" "${r.url}"`,
      { stdio: "ignore" }
    );
  } catch (e) {
    console.error(`Error on desktop ${r.name}:`, e.message);
  }

  // Mobile 375px
  const mobFile = path.join(outDir, `${r.name}_mobile_375.png`);
  console.log(`Capturing Mobile 375px: ${r.url} -> ${mobFile}`);
  try {
    execSync(
      `google-chrome --headless=new --disable-gpu --no-sandbox --window-size=375,812 --virtual-time-budget=2500 --screenshot="${mobFile}" "${r.url}"`,
      { stdio: "ignore" }
    );
  } catch (e) {
    console.error(`Error on mobile ${r.name}:`, e.message);
  }
}

console.log("All screenshots captured!");
const files = fs.readdirSync(outDir);
console.log("Files:", files);
