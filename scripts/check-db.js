const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.pfdmdrzpldoqtpxzadxd:Spssadmin2024@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function checkDb() {
  try {
    const settings = await prisma.settings.findFirst();
    console.log("Settings:", settings);
    
    const adminCount = await prisma.adminUser.count();
    console.log("Admin Users Count:", adminCount);
  } catch (error) {
    console.error("Error querying DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}
checkDb();
