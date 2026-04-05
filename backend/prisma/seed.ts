import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sakharsansar.com" },
    update: {},
    create: {
      email: "admin@sakharsansar.com",
      password: hashedPassword,
      name: "SakharSansar Admin",
    },
  });

  console.log("Admin created:", admin.email);

  // Seed some sample orders
  const orders = [
    { customer: "Ram Thapa", phone: "+977-9841234567", address: "Kathmandu, Thamel", product: "Organic Jaggery Block", quantity: 3, amount: 1500, status: "DELIVERED" as const },
    { customer: "Sita Kumari", phone: "+977-9867654321", address: "Lalitpur, Mangalbazar", product: "Jaggery Powder", quantity: 2, amount: 900, status: "SHIPPED" as const },
    { customer: "Hari Bahadur", phone: "+977-9812345678", address: "Bhaktapur, Durbar Square", product: "Jaggery Cubes", quantity: 5, amount: 1750, status: "CONFIRMED" as const },
    { customer: "Gita Sharma", phone: "+977-9854321098", address: "Pokhara, Lakeside", product: "Liquid Jaggery", quantity: 1, amount: 600, status: "PENDING" as const },
    { customer: "Bikash Rai", phone: "+977-9823456789", address: "Biratnagar, Main Road", product: "Date Palm Jaggery", quantity: 2, amount: 1400, status: "DELIVERED" as const },
    { customer: "Anita Gurung", phone: "+977-9876543210", address: "Chitwan, Bharatpur", product: "Spiced Jaggery Mix", quantity: 4, amount: 1600, status: "DELIVERED" as const },
    { customer: "Deepak KC", phone: "+977-9834567890", address: "Dharan, BP Chowk", product: "Jaggery Candy", quantity: 10, amount: 2500, status: "SHIPPED" as const },
    { customer: "Mina Tamang", phone: "+977-9845678901", address: "Butwal, Traffic Chowk", product: "Jaggery Spread", quantity: 2, amount: 1100, status: "PENDING" as const },
  ];

  for (const order of orders) {
    await prisma.order.create({ data: order });
  }
  console.log(`${orders.length} sample orders created`);

  // Seed some sample expenses
  const expenses = [
    { title: "Sugarcane Purchase - March Batch", amount: 15000, category: "Raw Materials", description: "Bought sugarcane from 3 farmers in Sankhuwasabha" },
    { title: "Packaging Materials", amount: 5000, category: "Packaging", description: "Eco-friendly boxes and labels" },
    { title: "Courier & Shipping", amount: 3500, category: "Logistics", description: "Monthly shipping partner bill" },
    { title: "Wood Fuel for Boiling", amount: 4000, category: "Raw Materials", description: "Firewood for traditional boiling process" },
    { title: "Marketing — Facebook Ads", amount: 2000, category: "Marketing", description: "Social media campaign for April" },
    { title: "Warehouse Rent", amount: 8000, category: "Operations", description: "Monthly storage facility rent" },
    { title: "Labor - 3 Workers", amount: 12000, category: "Labor", description: "Monthly wages for production workers" },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense });
  }
  console.log(`${expenses.length} sample expenses created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
