import 'dotenv/config';
import { exec, spawn } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';

const USE_NGROK = process.env.USE_NGROK === 'true';
const LOCAL_IP = process.env.LOCAL_IP || 'localhost';
const API_PORT = process.env.API_PORT || '8080';
const BASE_URL = USE_NGROK
  ? `http://localhost:${API_PORT}`
  : `http://${LOCAL_IP}:${API_PORT}`;

function updateApiConfig(url: string) {
  const config = `export const BASE_URL: string = '${url}';\n`;
  fs.writeFileSync('config/api.ts', config);
  console.log(`✅ config/api.ts updated with BASE_URL: ${url}`);
}

async function checkApiReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/api/observations/nearby?lat=53.27&lon=-9.05&radiusKm=1`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    console.log('🟢 API reachable. Sample response:', JSON.stringify(json).slice(0, 100) + '...');
    return true;
  } catch (err: any) {
    console.log(`🔴 Cannot reach API at ${url}/api/observations/nearby`);
    console.error(err.message);
    return false;
  }
}

function startExpo() {
  console.log('🚀 Launching Expo...');
  spawn('npx', ['expo', 'start'], {
    stdio: 'inherit',
    shell: true
  });
}

// Main logic
(async () => {
  if (USE_NGROK) {
    console.log(`🌐 Starting ngrok on http://localhost:${API_PORT}...`);
    const ngrok = await import('ngrok'); // dynamic import , safer
    const url = await ngrok.default.connect(parseInt(API_PORT));
    updateApiConfig(url);
    console.log(`🟢 ngrok tunnel active at: ${url}`);
    startExpo();
  } else {
    updateApiConfig(BASE_URL);
    const reachable = await checkApiReachable(BASE_URL);
    if (!reachable) {
      console.log('⚠️ Warning: API seems unreachable. Continuing anyway...');
    }
    startExpo();
  }
})();
