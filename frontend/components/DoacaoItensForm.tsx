import { MdAdd, MdRemoveCircleOutline } from "react-icons/md";
import InputGroup from "@/components/InputGroup";

export interface LinhaItem {
  nome: string;
  quantidade: string;
}

interface DoacaoItensFormProps {
  itens: LinhaItem[];
  onChange: (itens: LinhaItem[]) => void;
}

export default function DoacaoItensForm({ itens, onChange }: DoacaoItensFormProps) {
  const atualizar = (i: number, campo: keyof LinhaItem, valor: string) =>
    onChange(itens.map((it, idx) => (idx === i ? { ...it, [campo]: valor } : it)));

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">Itens doados:</label>
      {itens.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            <InputGroup
              label=""
              name={`item-nome-${i}`}
              type="text"
              placeholder="Ex: Ração, cobertor..."
              value={it.nome}
              onChange={(e) => atualizar(i, "nome", e.target.value)}
            />
          </div>
          <div className="w-20">
            <InputGroup
              label=""
              name={`item-qtd-${i}`}
              type="number"
              placeholder="Qtd"
              value={it.quantidade}
              onChange={(e) => atualizar(i, "quantidade", e.target.value)}
            />
          </div>
          {itens.length > 1 && (
            <button
              type="button"
              aria-label="Remover item"
              onClick={() => onChange(itens.filter((_, idx) => idx !== i))}
              className="text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-none"
            >
              <MdRemoveCircleOutline size={20} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...itens, { nome: "", quantidade: "" }])}
        className="flex items-center gap-1 text-sm font-semibold text-[#2DB38B] cursor-pointer bg-transparent border-none self-start"
      >
        <MdAdd size={18} /> Adicionar item
      </button>
    </div>
  );
}
