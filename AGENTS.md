# Instruções para trabalhar no SJPA

Este é o ponto de entrada das instruções do projeto para assistentes de IA. O guia completo está em [docs/uso-de-ia.md](docs/uso-de-ia.md), elaborado na DOC-07 e sujeito à validação da equipe. Identifique o que é acordo confirmado, proposta ou pendência nos documentos consultados.

## Antes de alterar arquivos

1. Leia o [guia de uso de IA](docs/uso-de-ia.md) e o cartão ou pedido que define a tarefa. Se não conseguir acessar uma referência necessária, informe a limitação; não invente seu conteúdo.
2. Consulte a [visão geral](docs/visao-geral.md). Para tarefas de módulos, consulte também o [estado dos módulos](docs/estado-dos-modulos.md); para escopo e prioridade, o [planejamento](docs/entregas-e-proximos-passos.md).
3. Use a tabela de leituras do guia para localizar as demais referências. Consulte [decisões técnicas](docs/decisoes-tecnicas.md) quando a tarefa envolver escolhas técnicas, dados ou integração; use seus status e IDs sem tratar prática atual como decisão confirmada. Procure `docs/arquitetura.md`, `docs/testes.md` e os guias da área quando forem relevantes. Se uma referência ainda não existir nesta branch, siga o procedimento de referências ausentes do guia. Não crie esses documentos como efeito colateral de outra tarefa.
4. Para branches, commits e PRs, consulte [CONTRIBUTING.md](CONTRIBUTING.md) quando disponível, respeitando as pendências de validação nele registradas.
5. Antes de trabalhar no frontend, leia [frontend/AGENTS.md](frontend/AGENTS.md) e as instruções aplicáveis no caminho até os arquivos alterados. Preserve as orientações específicas existentes, incluindo a consulta à documentação da versão instalada do Next.js antes de escrever código.
6. Confira a branch e as alterações locais. Preserve o trabalho existente de outras pessoas e os arquivos fora do escopo.

## Durante a tarefa

- Execute mudanças rotineiras já autorizadas dentro do escopo, seguindo os padrões aplicáveis. Não peça nova confirmação para uma decisão já autorizada e ainda válida.
- Informe o escopo e as referências consultadas antes da implementação; comunique divergências, limitações e mudanças relevantes de abordagem durante a tarefa.
- Antes de contrariar uma decisão técnica, definir uma regra de negócio pendente ou ampliar o escopo, explique a proposta, o motivo e o impacto e obtenha uma decisão humana. Continue as partes independentes enquanto aguarda.
- Propostas alternativas são permitidas. Registre a proposta e o resultado da consulta conforme a seção 5 do guia e o processo da DOC-06, preservando a decisão vigente até a aprovação da substituição. A autorização do solicitante não substitui a validação dos grupos ou da ONG quando necessária.
- Não use a ausência de documentação, o silêncio ou o estado atual do código como aprovação de uma nova decisão. Se documentos conflitarem, exponha a divergência e consulte o responsável antes da alteração que depende dela.
- Não reduza metas de cobertura, exclua código da medição, desative testes ou afrouxe verificações para fazer uma execução passar sem justificativa e decisão humana. A autorização para corrigir uma falha não autoriza enfraquecer o critério que a detectou.
- Confirme os scripts e pré-requisitos existentes antes de executar verificações. Não invente comandos, percentuais de cobertura ou resultados. Uma tarefa só documental exige revisão de conteúdo, links e formatação; não exige testes da aplicação.
- Atualize a documentação afetada na mesma entrega. Mudanças nas próprias regras também precisam de revisão; não reescreva uma regra para justificar retroativamente uma alteração não autorizada.

## Ao entregar

Informe os arquivos e comportamentos alterados, a justificativa, as verificações efetivamente realizadas e seus resultados, o que não foi verificado e por quê, as decisões humanas relevantes, os registros de consultas e divergências e as pendências. Diferencie implementação pronta para revisão de entrega aprovada e integrada. Uma avaliação da IA não substitui a revisão humana prevista no projeto.
