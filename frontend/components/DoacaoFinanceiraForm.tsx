import InputGroup from "@/components/InputGroup";

interface DoacaoFinanceiraFormProps {
  valor: string;
  onChange: (valor: string) => void;
}

export default function DoacaoFinanceiraForm({ valor, onChange }: DoacaoFinanceiraFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">Valor da doação:</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 text-sm font-medium pointer-events-none">
          R$:
        </span>
        <InputGroup
          label=""
          name="valor"
          type="number"
          placeholder="0,00"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}