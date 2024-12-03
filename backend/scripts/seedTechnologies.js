const mongoose = require('mongoose');
const Technology = require('../models/Technology');
require('dotenv').config();

const technologies = [
  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Vue.js', category: 'frontend' },
  { name: 'Angular', category: 'frontend' },
  { name: 'HTML5', category: 'frontend' },
  { name: 'CSS3', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  
  // Backend
  { name: 'Node.js', category: 'backend' },
  { name: 'Express.js', category: 'backend' },
  { name: 'Python', category: 'backend' },
  { name: 'Django', category: 'backend' },
  { name: 'Flask', category: 'backend' },
  { name: 'PHP', category: 'backend' },
  { name: 'Laravel', category: 'backend' },
  
  // Database
  { name: 'MongoDB', category: 'database' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'Redis', category: 'database' },
  
  // DevOps
  { name: 'Docker', category: 'devops' },
  { name: 'Kubernetes', category: 'devops' },
  { name: 'AWS', category: 'devops' },
  { name: 'Git', category: 'devops' },
  { name: 'CI/CD', category: 'devops' }
];

async function seedTechnologies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing technologies
    await Technology.deleteMany({});
    
    // Insert predefined technologies
    await Technology.insertMany(technologies);
    
    console.log('Technologies seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding technologies:', error);
    process.exit(1);
  }
}

seedTechnologies(); 