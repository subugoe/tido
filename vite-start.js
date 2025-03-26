import { spawn } from 'child_process';

const project = process.argv[2] || null;
const args = project ? [`-- --project=${project}`] : [];

// Start Vite as a child process and pass the environment variable
const viteProcess = spawn('vite', args, {
  stdio: 'inherit', // <-- This ensures you see Vite's output in real-time
  shell: true, // <-- Needed for Windows compatibility
  env: { ...process.env } // Merge existing env variables
});

// Handle process exit
viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});
