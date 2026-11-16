# CyberOregon — Site Exclusivo Next.js

Projeto Next.js (App Router + Tailwind CSS v4) independente para a **CyberOregon**, com:
- Portfólio completo de **Pentest**, **Red Team** e **Security Review**;
- Simulador interativo de escopo;
- Alternância de tema via URL (`?tema=claro` ou padrão escuro);
- Formulário com persistência no MongoDB (`cyber_oregon_leads`) e notificação por e-mail via SMTP Hostinger;
- Suporte opcional a Google Analytics 4 e Meta Pixel com banner de consentimento.

## Como rodar

1. Copie esta pasta para o diretório do novo projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie `.env.local` a partir de `.env.example` e preencha suas credenciais do MongoDB e SMTP da Hostinger.
4. Inicie em desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para produção:
   ```bash
   npm run build
   npm run start
   ```
