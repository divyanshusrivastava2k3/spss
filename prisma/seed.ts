import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@spss.org",
      password: hashed,
      role: "superadmin",
    },
  });
  console.log("✅ Admin created: admin / admin123");

  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({ data: {} });
    console.log("✅ Default Settings populated.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
