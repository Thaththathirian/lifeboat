import http from 'http';

// Test the health endpoint
const testHealth = () => {
  const options = {
    hostname: 'localhost',
    port: 80,
    path: '/google-firebase-auth/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Health check status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('📋 Health check response:', JSON.parse(data));
    });
  });

  req.on('error', (err) => {
    console.error('❌ Health check failed:', err.message);
  });

  req.end();
};

// Test the main page
const testMainPage = () => {
  const options = {
    hostname: 'localhost',
    port: 80,
    path: '/google-firebase-auth/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Main page status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('📱 Frontend is accessible at: http://localhost/google-firebase-auth/');
    }
  });

  req.on('error', (err) => {
    console.error('❌ Main page failed:', err.message);
  });

  req.end();
};

console.log('🧪 Testing server endpoints...');
console.log('');

setTimeout(testHealth, 1000);
setTimeout(testMainPage, 2000);

console.log('📋 Available URLs:');
console.log('   Frontend: http://localhost/google-firebase-auth/');
console.log('   API: http://localhost/google-firebase-auth/google_auth');
console.log('   Health: http://localhost/google-firebase-auth/health');
console.log('');
console.log('🔧 If server is not running, start it with: node server.js'); 