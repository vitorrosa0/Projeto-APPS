import InputGroup from "@/components/InputGroup";

interface DoacaoItensFormProps {
  itens: string;
  onChange: (itens: string) => void;
}

export default function DoacaoItensForm({ itens, onChange }: DoacaoItensFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">Itens doados:</label>
      <InputGroup
        label=""
        name="itens"
        type="text"
        placeholder="Ex: 10kg ração, cobertores..."
        value={itens}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}