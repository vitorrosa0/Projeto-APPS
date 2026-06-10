import AnimalListPage, { Animal } from "@/components/AnimalListPage";

const MOCK_CAES: Animal[] = [
  { id: 1,  nome: "Robson",    idade: "6 anos", raca: "Dachshund",        setor: "A", canil: "Canil X" },
  { id: 2,  nome: "Widow",     idade: "4 anos", raca: "Buldogue Francês", setor: "A", canil: "Canil S2" },
  { id: 3,  nome: "Pretinha",  idade: "4 anos", raca: "Puddle",           setor: "A", canil: "Canil 2" },
  { id: 4,  nome: "Cristiano", idade: "5 anos", raca: "Vira-lata",        setor: "B", canil: "Canil 7" },
  { id: 5,  nome: "Jorge",     idade: "8 anos", raca: "Vira-lata",        setor: "B", canil: "Canil X" },
  { id: 6,  nome: "Bolinha",   idade: "2 anos", raca: "Poodle",           setor: "C", canil: "Baia 1" },
  { id: 7,  nome: "Luna",      idade: "3 anos", raca: "SRD",              setor: "C", canil: "Baia 2" },
  { id: 8,  nome: "Thor",      idade: "1 ano",  raca: "Labrador",         setor: "D", canil: "Baia 3" },
  { id: 9,  nome: "Mel",       idade: "7 anos", raca: "Shih-tzu",         setor: "A", canil: "5 Estrelas" },
  { id: 10, nome: "Pipoca",    idade: "3 anos", raca: "Vira-lata",        setor: "E", canil: "Baia 1" },
];

export default function CaesPage() {
  return <AnimalListPage titulo="Relação de Cães" tipo="cao" animaisIniciais={MOCK_CAES} />;
}