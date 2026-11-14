# EVERGREN INVESTIMENTOS

Novo projeto separado do Firebase antigo.

## Estrutura planejada

- `public/`: interface pública e painel administrativo.
- Firebase Authentication: login por e-mail e senha.
- Firebase Realtime Database: dados separados por usuário.
- Operações financeiras: solicitações registradas; aprovação administrativa no servidor.
- Auditoria: histórico imutável de solicitações e decisões.

## Segurança obrigatória

- O banco permanece fechado por padrão até a publicação de regras revisadas.
- Clientes não podem gravar saldos, aprovar depósitos, ativar planos ou aprovar saques.
- O UID administrativo autorizado para este projeto é configurado no backend/regras, nunca em campos editáveis pelo cliente.
- Chaves privadas e credenciais de conta de serviço nunca devem ser publicadas neste repositório.
- A configuração Web do Firebase não substitui regras de segurança.

## Aviso importante

Este repositório é a base técnica de um sistema de cadastro e controle administrativo. Não deve apresentar retornos de investimento como garantidos nem captar recursos antes de validação jurídica e regulatória aplicável no Brasil. Qualquer plano exibido precisa informar claramente riscos, condições e ausência de garantia de rentabilidade.

## Projeto Firebase

- Project ID: `evergren-invetimentos`
- Web app: `Evergren Investimentos`

## Backend inicial adicionado

- Realtime Database permanece totalmente fechado em `database.rules.json`.
- `createDepositRequest` registra uma solicitação pendente; não credita saldo.
- `createWithdrawalRequest` registra um pedido para análise; não envia dinheiro.
- `reviewDepositRequest` exige UID administrativo configurado no ambiente das Functions e registra a conferência manual; não altera saldo.
- A revisão é transacional e impede que a mesma solicitação pendente seja processada duas vezes.

## Antes de publicar

1. Configure `ADMIN_UID` no ambiente das Cloud Functions com o UID da conta administrativa.
2. Configure faturamento/plano compatível com Cloud Functions, se exigido pelo Firebase no momento da implantação.
3. Revise as regras, funções e requisitos legais/regulatórios com profissional qualificado.
4. Só então faça o deploy com Firebase CLI e teste em ambiente controlado.

**Não há carteira, crédito de saldo, rendimento, ativação de investimento ou pagamento automático implementado.** A aprovação registrada neste estágio significa apenas que a solicitação foi conferida; não movimenta dinheiro.
