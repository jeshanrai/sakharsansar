import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Sakhar123", 10);

  const admins = [
    { email: "jeshan@sakharsansar.com", name: "Jeshan Rai" },
    { email: "nishan@sakharsansar.com", name: "Nishan Magar" },
    { email: "rasu@sakharsansar.com", name: "Rasu Bhandari" },
  ];

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        password: hashedPassword,
        name: admin.name,
      },
    });
    console.log("Admin created:", admin.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
