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
