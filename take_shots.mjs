import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "screenshots");

const routes = [
  { name: "home", url: "http://localhost:3000/" },
  { name: "dashboard", url: "http://localhost:3000/dashboard/jee-main/physics" },
  { name: "formulas", url: "http://localhost:3000/formulas/jee-main/physics" },
  { name: "my_dashboard", url: "http://localhost:3000/my-dashboard" },
  { name: "about", url: "http://localhost:3000/about" },
  { name: "evaluation", url: "http://localhost:3000/evaluation" },
];

for (const r of routes) {
  const desk = path.join(outDir, `${r.name}_desktop.png`);
  const mob = path.join(outDir, `${r.name}_mobile_375.png`);

  console.log(`[DESKTOP] ${r.name}`);
  execSync(
    `google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1280,850 --screenshot="${desk}" "${r.url}"`,
    { stdio: "inherit" }
  );

  console.log(`[MOBILE 375] ${r.name}`);
  execSync(
    `google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=375,812 --screenshot="${mob}" "${r.url}"`,
    { stdio: "inherit" }
  );
}

console.log("SUCCESS! All screenshots generated.");
