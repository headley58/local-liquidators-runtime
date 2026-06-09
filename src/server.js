const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');
const CONFIG = require('./config');

const PORT = CONFIG.PORT;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';
  
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Static files
  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile('./public/index.html', res);
    return;
  }
  
  if (pathname === '/dashboard') {
    serveStaticFile('./public/dashboard.html', res);
    return;
  }
  
  if (pathname === '/crm') {
    serveStaticFile('./public/crm.html', res);
    return;
  }
  
  if (pathname === '/pipeline') {
    serveStaticFile('./public/pipeline.html', res);
    return;
  }
  
  if (pathname === '/intake') {
    serveStaticFile('./public/intake.html', res);
    return;
  }
  
  if (pathname === '/sop') {
    serveStaticFile('./public/sop.html', res);
    return;
  }
  
  if (pathname.startsWith('/sop/')) {
    const sopFile = pathname.replace('/sop/', './sop/') + '.md';
    serveStaticFile(sopFile, res);
    return;
  }
  
  if (pathname.startsWith('/public/')) {
    serveStaticFile('.' + pathname, res);
    return;
  }

  // API Routes
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      brand: CONFIG.BRAND.name,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Contacts API
  if (pathname === '/api/contacts') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.getContacts()));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const contact = JSON.parse(body);
          const newContact = db.createContact(contact);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newContact));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
    return;
  }

  if (pathname.startsWith('/api/contacts/')) {
    const id = pathname.split('/')[3];
    
    if (req.method === 'GET') {
      const contact = db.getContactById(id);
      if (contact) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(contact));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Contact not found' }));
      }
    } else if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const updated = db.updateContact(id, updates);
          if (updated) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updated));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Contact not found' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else if (req.method === 'DELETE') {
      if (db.deleteContact(id)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deleted: true }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Contact not found' }));
      }
    }
    return;
  }

  // Pipeline API
  if (pathname === '/api/pipeline') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.getPipeline()));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { contactId, stage } = JSON.parse(body);
          const deal = db.createDeal(contactId, stage);
          if (deal) {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deal));
          } else {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Contact not found' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
    return;
  }

  if (pathname === '/api/pipeline/move') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { dealId, toStage } = JSON.parse(body);
          const deal = db.moveDeal(dealId, toStage);
          if (deal) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deal));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Deal not found' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
    return;
  }

  // Tasks API
  if (pathname === '/api/tasks') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.getTasks()));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const task = JSON.parse(body);
          const newTask = db.createTask(task);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newTask));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
    return;
  }

  if (pathname.startsWith('/api/tasks/')) {
    const id = pathname.split('/')[3];
    
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          if (updates.completed) {
            const task = db.completeTask(id);
            if (task) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(task));
            } else {
              res.writeHead(404);
              res.end(JSON.stringify({ error: 'Task not found' }));
            }
          } else {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid update' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else if (req.method === 'DELETE') {
      if (db.deleteTask(id)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deleted: true }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Task not found' }));
      }
    }
    return;
  }

  // Activities API
  if (pathname === '/api/activities') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.getActivities()));
    return;
  }

  // Dashboard data
  if (pathname === '/api/dashboard') {
    const contacts = db.getContacts();
    const pipeline = db.getPipeline();
    const tasks = db.getTasks();
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      contacts: {
        total: contacts.length,
        hot: contacts.filter(c => c.status === 'Hot').length,
        warm: contacts.filter(c => c.status === 'Warm').length,
        cold: contacts.filter(c => c.status === 'Cold').length
      },
      pipeline: {
        total: pipeline.deals.length,
        stages: pipeline.deals.reduce((acc, d) => {
          acc[d.stage] = (acc[d.stage] || 0) + 1;
          return acc;
        }, {})
      },
      tasks: {
        total: tasks.length,
        pending: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
      },
      recent: db.getActivities(10)
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`${CONFIG.BRAND.name} Server running on port ${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`CRM: http://localhost:${PORT}/crm`);
  console.log(`Intake Form: http://localhost:${PORT}/intake`);
});

module.exports = server;