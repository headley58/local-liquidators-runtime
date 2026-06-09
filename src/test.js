const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    testsFailed++;
  }
}

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {}
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🏠 Local Liquidators - Test Suite');
  console.log('==================================\n');
  
  // Wait for server
  await new Promise(r => setTimeout(r, 1000));
  
  await test('Server health check', async () => {
    const res = await request('/api/health');
    if (res.status !== 200) throw new Error('Health check failed');
    if (res.data.brand !== 'Local Liquidators') throw new Error('Wrong brand');
  });
  
  let contactId;
  await test('Create contact', async () => {
    const res = await request('/api/contacts', 'POST', {
      name: 'Test Lead',
      email: 'test@example.com',
      phone: '555-1234',
      status: 'Hot',
      leadType: 'Seller',
      propertyAddress: '123 Test St',
      propertyValue: 250000
    });
    if (res.status !== 201) throw new Error('Failed to create contact');
    contactId = res.data.id;
  });
  
  await test('Get contacts', async () => {
    const res = await request('/api/contacts');
    if (res.status !== 200) throw new Error('Failed to get contacts');
    if (!Array.isArray(res.data)) throw new Error('Invalid response');
    if (res.data.length === 0) throw new Error('No contacts found');
  });
  
  await test('Update contact', async () => {
    const res = await request(`/api/contacts/${contactId}`, 'PUT', {
      status: 'Warm',
      notes: 'Updated via test'
    });
    if (res.status !== 200) throw new Error('Failed to update contact');
    if (res.data.status !== 'Warm') throw new Error('Status not updated');
  });
  
  await test('Create pipeline deal', async () => {
    const res = await request('/api/pipeline', 'POST', {
      contactId: contactId,
      stage: 'New Lead'
    });
    if (res.status !== 201) throw new Error('Failed to create deal');
  });
  
  await test('Get pipeline', async () => {
    const res = await request('/api/pipeline');
    if (res.status !== 200) throw new Error('Failed to get pipeline');
    if (!res.data.deals) throw new Error('Invalid pipeline data');
  });
  
  let taskId;
  await test('Create task', async () => {
    const res = await request('/api/tasks', 'POST', {
      title: 'Follow up with Test Lead',
      contactId: contactId,
      dueDate: new Date().toISOString()
    });
    if (res.status !== 201) throw new Error('Failed to create task');
    taskId = res.data.id;
  });
  
  await test('Complete task', async () => {
    const res = await request(`/api/tasks/${taskId}`, 'PUT', {
      completed: true
    });
    if (res.status !== 200) throw new Error('Failed to complete task');
    if (!res.data.completed) throw new Error('Task not marked complete');
  });
  
  await test('Get dashboard data', async () => {
    const res = await request('/api/dashboard');
    if (res.status !== 200) throw new Error('Failed to get dashboard');
    if (!res.data.contacts) throw new Error('Missing contacts data');
    if (!res.data.pipeline) throw new Error('Missing pipeline data');
    if (!res.data.tasks) throw new Error('Missing tasks data');
  });
  
  await test('Get activities', async () => {
    const res = await request('/api/activities');
    if (res.status !== 200) throw new Error('Failed to get activities');
    if (!Array.isArray(res.data)) throw new Error('Invalid activities data');
  });
  
  await test('Delete task', async () => {
    const res = await request(`/api/tasks/${taskId}`, 'DELETE');
    if (res.status !== 200) throw new Error('Failed to delete task');
  });
  
  await test('Delete contact', async () => {
    const res = await request(`/api/contacts/${contactId}`, 'DELETE');
    if (res.status !== 200) throw new Error('Failed to delete contact');
  });
  
  console.log('\n==================================');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log('==================================');
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(e => {
  console.error('Test suite failed:', e.message);
  process.exit(1);
});