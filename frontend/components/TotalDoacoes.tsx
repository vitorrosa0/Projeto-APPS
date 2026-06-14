interface TotalDoacoesProps {
  totalFinanceiro: string;
  totalProdutos: number;
}

export default function TotalDoacoes({ totalFinanceiro, totalProdutos }: TotalDoacoesProps) {
  return (
    <div className="pt-3 mt-1 border-t border-gray-200">
      <p className="text-sm font-bold text-gray-800 mb-2">Total de Doações:</p>

      <div className="flex justify-between text-sm text-gray-700 px-2">
        <span className="font-semibold">Financeira:</span>
        <span className="font-semibold">{totalFinanceiro}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-700 px-2 mt-0.5">
        <span className="font-semibold">Produtos:</span>
        <span className="font-semibold">{totalProdutos}</span>
      </div>
    </div>
  );
}