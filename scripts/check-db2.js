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
    const settings = await prisma.settings.findMany();
    console.log("Settings rows:", settings.length);
    if(settings.length > 0) {
      console.log(settings.map(s => ({ id: s.id, ngoName: s.ngoName })));
    }
    
    const adminUsers = await prisma.adminUser.findMany();
    console.log("Admin rows:", adminUsers.length);
  } catch (error) {
    console.error("Error querying DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}
checkDb();
