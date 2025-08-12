// scripts/dev-lan.js
import os from "os";
import { writeFileSync } from "fs";
import { spawn } from "child_process";

// Get current LAN IP (IPv4, non-internal)
function getLanIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1"; // fallback
}

const ip = getLanIP();
console.log(`🌐 Detected LAN IP: ${ip}`);

// Create .env.lan
const envContent = `
NEXT_PUBLIC_WEB_URL=http://${ip}:3001
NEXT_PUBLIC_API_BASE_URL=http://${ip}:8080/metrics
`.trim();

writeFileSync(".env.lan", envContent);
console.log("✅ .env.lan updated:\n", envContent);

// Run Next.js dev server
const devProcess = spawn(
  "dotenv",
  ["-e", ".env.lan", "--", "next", "dev", "-H", ip, "-p", "3001"],
  { stdio: "inherit" }
);

devProcess.on("close", (code) => {
  process.exit(code);
});