const { spawn } = require('child_process');
const path = require('path');

// Start backend server
const backend = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start frontend server
const frontend = spawn('node', ['frontend.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

console.log('Starting HR Webapp...');
console.log('Frontend: http://localhost:3000');
console.log('Backend: http://localhost:5000');
console.log('Press Ctrl+C to stop both servers');