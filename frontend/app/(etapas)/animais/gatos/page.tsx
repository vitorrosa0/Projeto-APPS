import AnimalListPage, { Animal } from "@/components/AnimalListPage";

const MOCK_GATOS: Animal[] = [
  { id: 1, nome: "Bola de Neve", idade: "5 anos", raca: "Vira-lata", setor: "B", canil: "Canil 3" },
  { id: 2, nome: "Garfield",     idade: "4 anos", raca: "Vira-lata", setor: "B", canil: "Canil 3" },
  { id: 3, nome: "Atchim",       idade: "9 anos", raca: "Vira-lata", setor: "A", canil: "Canil 8" },
  { id: 4, nome: "Listrado",     idade: "3 anos", raca: "Vira-lata", setor: "B", canil: "Canil 3" },
  { id: 5, nome: "Napolitano",   idade: "5 anos", raca: "Vira-lata", setor: "B", canil: "Canil 3" },
  { id: 6, nome: "Mingau",       idade: "2 anos", raca: "Siamês",    setor: "C", canil: "Baia 1" },
  { id: 7, nome: "Frajola",      idade: "6 anos", raca: "SRD",       setor: "A", canil: "5 Estrelas" },
  { id: 8, nome: "Lua",          idade: "1 ano",  raca: "Persa",     setor: "D", canil: "Baia 2" },
];

export default function GatosPage() {
  return <AnimalListPage titulo="Relação de Gatos" tipo="gato" animaisIniciais={MOCK_GATOS} />;
}