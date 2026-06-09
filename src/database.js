const fs = require('fs');
const path = require('path');
const CONFIG = require('./config');

class Database {
  constructor() {
    this.ensureDataDir();
    this.contacts = this.load(CONFIG.CONTACTS_FILE) || [];
    this.pipeline = this.load(CONFIG.PIPELINE_FILE) || { stages: {}, deals: [] };
    this.tasks = this.load(CONFIG.TASKS_FILE) || [];
    this.activities = this.load(CONFIG.ACTIVITIES_FILE) || [];
  }

  ensureDataDir() {
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
      fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
    }
  }

  load(filePath) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  save(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Contacts CRUD
  getContacts() {
    return this.contacts;
  }

  getContactById(id) {
    return this.contacts.find(c => c.id === id);
  }

  createContact(contact) {
    const newContact = {
      id: `ctc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...contact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
    this.save(CONFIG.CONTACTS_FILE, this.contacts);
    this.logActivity('contact_created', newContact.id, `Created contact: ${newContact.name}`);
    return newContact;
  }

  updateContact(id, updates) {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save(CONFIG.CONTACTS_FILE, this.contacts);
    this.logActivity('contact_updated', id, `Updated contact: ${this.contacts[index].name}`);
    return this.contacts[index];
  }

  deleteContact(id) {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    const name = this.contacts[index].name;
    this.contacts.splice(index, 1);
    this.save(CONFIG.CONTACTS_FILE, this.contacts);
    this.logActivity('contact_deleted', id, `Deleted contact: ${name}`);
    return true;
  }

  // Pipeline
  getPipeline() {
    return this.pipeline;
  }

  moveDeal(dealId, toStage) {
    const deal = this.pipeline.deals.find(d => d.id === dealId);
    if (!deal) return null;
    
    const fromStage = deal.stage;
    deal.stage = toStage;
    deal.updatedAt = new Date().toISOString();
    deal.history = deal.history || [];
    deal.history.push({
      timestamp: new Date().toISOString(),
      from: fromStage,
      to: toStage
    });
    
    this.save(CONFIG.PIPELINE_FILE, this.pipeline);
    this.logActivity('deal_moved', dealId, `Moved ${deal.contactName} from ${fromStage} to ${toStage}`);
    return deal;
  }

  createDeal(contactId, stage = 'New Lead') {
    const contact = this.getContactById(contactId);
    if (!contact) return null;
    
    const deal = {
      id: `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contactId,
      contactName: contact.name,
      stage,
      value: contact.propertyValue || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        from: null,
        to: stage
      }]
    };
    
    this.pipeline.deals.push(deal);
    this.save(CONFIG.PIPELINE_FILE, this.pipeline);
    this.logActivity('deal_created', deal.id, `Created deal for ${contact.name}`);
    return deal;
  }

  // Tasks
  getTasks() {
    return this.tasks;
  }

  createTask(task) {
    const newTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...task,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.save(CONFIG.TASKS_FILE, this.tasks);
    this.logActivity('task_created', newTask.id, `Created task: ${newTask.title}`);
    return newTask;
  }

  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    
    task.completed = true;
    task.completedAt = new Date().toISOString();
    this.save(CONFIG.TASKS_FILE, this.tasks);
    this.logActivity('task_completed', id, `Completed task: ${task.title}`);
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.save(CONFIG.TASKS_FILE, this.tasks);
    return true;
  }

  // Activities
  getActivities(limit = 50) {
    return this.activities.slice(0, limit);
  }

  logActivity(type, entityId, description) {
    const activity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      entityId,
      description,
      timestamp: new Date().toISOString()
    };
    this.activities.unshift(activity);
    if (this.activities.length > 500) {
      this.activities = this.activities.slice(0, 500);
    }
    this.save(CONFIG.ACTIVITIES_FILE, this.activities);
    return activity;
  }
}

module.exports = new Database();