const CONFIG = {
  PORT: process.env.PORT || 3000,
  DATA_DIR: './data',
  CONTACTS_FILE: './data/contacts.json',
  PIPELINE_FILE: './data/pipeline.json',
  TASKS_FILE: './data/tasks.json',
  ACTIVITIES_FILE: './data/activities.json',
  BRAND: {
    name: 'Local Liquidators',
    tagline: 'Fast Cash For Your Property',
    logo: '🏠',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af'
  }
};

module.exports = CONFIG;