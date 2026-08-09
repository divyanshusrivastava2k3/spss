import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const sqlite = new Database(dbPath);

async function migrate() {
  console.log('Connecting to local SQLite database...');
  console.log('Migrating AdminUsers...');
  const adminUsers = sqlite.prepare('SELECT * FROM AdminUser').all() as any[];
  for (const user of adminUsers) {
    // Convert SQLite 1/0 to true/false or handle dates if needed
    user.createdAt = new Date(user.createdAt);
    user.updatedAt = new Date(user.updatedAt);
    if (user.lastLogin) user.lastLogin = new Date(user.lastLogin);
    
    await prisma.adminUser.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    });
  }

  console.log('Migrating Settings...');
  const settings = sqlite.prepare('SELECT * FROM Settings').all() as any[];
  for (const s of settings) {
    await prisma.settings.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  console.log('Migrating ContentBlocks...');
  const blocks = sqlite.prepare('SELECT * FROM ContentBlock').all() as any[];
  for (const b of blocks) {
    b.isActive = Boolean(b.isActive);
    b.createdAt = new Date(b.createdAt);
    b.updatedAt = new Date(b.updatedAt);
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: b,
      create: b,
    });
  }

  const models = [
    'Partner', 'BlogPost', 'TeamMember', 'DirectorMessage', 
    'HomePageContent', 'AboutPageContent', 'Program', 
    'GalleryImage', 'ContactMessage'
  ];

  for (const model of models) {
    console.log(`Migrating ${model}...`);
    const rows = sqlite.prepare(`SELECT * FROM ${model}`).all() as any[];
    
    for (const row of rows) {
      // Fix boolean and date types
      if ('isActive' in row) row.isActive = Boolean(row.isActive);
      if ('isPublished' in row) row.isPublished = Boolean(row.isPublished);
      if (row.createdAt) row.createdAt = new Date(row.createdAt);
      if (row.updatedAt) row.updatedAt = new Date(row.updatedAt);
      if (row.publishedAt) row.publishedAt = new Date(row.publishedAt);
      if (row.startDate) row.startDate = new Date(row.startDate);
      if (row.endDate) row.endDate = new Date(row.endDate);

      await (prisma as any)[model.charAt(0).toLowerCase() + model.slice(1)].upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
  }

  console.log('✅ Migration complete!');
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqlite.close();
  });
