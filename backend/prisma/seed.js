// Cria um usuário admin padrão e alguns cães e gatos de exemplo para
// facilitar o desenvolvimento. Rode com: npm run seed
// Pode ser executado mais de uma vez: só cria o que ainda não existe.
const prisma = require("../src/prisma");
const bcrypt = require("bcryptjs");

// Dados fictícios, apenas para desenvolvimento.
const ANIMAIS_EXEMPLO = [
  { nome: "Paçoca", tipo: "cao", raca: "SRD", idade: "3 anos", sexo: "Masculino", setor: "A", canil: "Baia 1", cor: "Caramelo", temperamento: "Dócil", vacinacao: "Completa", dataVacinacao: "2026-03-10" },
  { nome: "Pipoca", tipo: "cao", raca: "SRD", idade: "8 meses", sexo: "Feminino", setor: "B", canil: "5 Estrelas", cor: "Branca", temperamento: "Agitada", vacinacao: "Incompleta" },
  { nome: "Thor", tipo: "cao", raca: "Pastor Alemão", idade: "6 anos", sexo: "Masculino", setor: "C", canil: "Baia 3", cor: "Preto e marrom", vacinacao: "Não vacinado" },
  { nome: "Mingau", tipo: "gato", raca: "SRD", idade: "2 anos", sexo: "Masculino", setor: "E", canil: "Baia 1", cor: "Cinza", temperamento: "Tímido", vacinacao: "Completa", dataVacinacao: "2026-05-02" },
  { nome: "Frajola", tipo: "gato", idade: "1 ano", sexo: "Feminino", setor: "F", canil: "Baia 2", cor: "Preta e branca", vacinacao: "Incompleta" },
  { nome: "Nina", tipo: "gato", raca: "Siamês", idade: "4 anos", sexo: "Feminino", cor: "Creme" },
];

async function main() {
  const email = "admin@sjpa.com";
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: { nome: "Administrador", email, senhaHash },
  });

  console.log("Usuário admin pronto -> email: admin@sjpa.com | senha: admin123");

  let criados = 0;
  for (const animal of ANIMAIS_EXEMPLO) {
    const existe = await prisma.animal.findFirst({ where: { nome: animal.nome, tipo: animal.tipo } });
    if (!existe) {
      await prisma.animal.create({ data: animal });
      criados++;
    }
  }
  console.log(`Animais de exemplo: ${criados} criado(s), ${ANIMAIS_EXEMPLO.length - criados} já existia(m).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
