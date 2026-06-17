// Cria um usuário admin padrão para facilitar o login durante o
// desenvolvimento. Rode com: npm run seed
const prisma = require("../src/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  const email = "admin@sjpa.com";
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: { nome: "Administrador", email, senhaHash },
  });

  console.log("Usuário admin pronto -> email: admin@sjpa.com | senha: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
