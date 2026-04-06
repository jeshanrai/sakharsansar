import prisma from "./prisma";
import bcrypt from "bcryptjs";

const admins = [
  { email: "jeshan@sakharsansar.com", name: "Jeshan Rai" },
  { email: "nishan@sakharsansar.com", name: "Nishan Magar" },
  { email: "rasu@sakharsansar.com", name: "Rasu Bhandari" },
];

export async function seedDatabase() {
  const existingCount = await prisma.admin.count();
  if (existingCount > 0) return;

  console.log("Seeding admin users...");
  const hashedPassword = await bcrypt.hash("Sakhar123", 10);

  for (const admin of admins) {
    await prisma.admin.create({
      data: {
        email: admin.email,
        password: hashedPassword,
        name: admin.name,
      },
    });
    console.log(`  Admin created: ${admin.email}`);
  }

  console.log("Seeding complete.");
}
