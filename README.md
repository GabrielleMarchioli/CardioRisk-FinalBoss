CardioRisk ❤️

CardioRisk é um sistema web desenvolvido para médicos calcularem o risco cardiovascular de pacientes, oferecendo uma interface amigável e funcionalidades como autenticação segura, dashboard com estatísticas, cadastro de pacientes e redefinição de senha.
📋 Funcionalidades

Autenticação de médicos: Login seguro com e-mail e senha.
Redefinição de senha: Recuperação de conta via "Esqueceu a senha" com e-mail.
Dashboard: Visualização de consultas e gráficos.
Cadastro de pacientes: Formulário para registrar pacientes.
Cálculo de risco cardiovascular: Baseado em modelos como SCORE.
Responsividade: Interface adaptada para desktop e mobile.

🛠️ Tecnologias Utilizadas

Frontend: React, Tailwind CSS
Backend: Node.js, Express
Banco de Dados: MongoDB
Outros: Chart.js (gráficos), Nodemailer (e-mails), bcrypt (segurança)

🚀 Instalação
Pré-requisitos

Node.js (v20.x ou superior)
MongoDB (local ou Atlas)
Git

Passos

Clone o repositório:
git clone https://github.com/SEU_USUARIO/CardioRisk.git
cd CardioRisk


Instale as dependências do frontend:
cd cardiorisk-frontend
npm install


Instale as dependências do backend:
cd ../cardiorisk-backend
npm install


Configure as variáveis de ambiente:

Crie um arquivo .env na pasta cardiorisk-backend com:MONGO_URI=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta
PORT=5000
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app




Inicie o backend:
cd cardiorisk-backend
npm start


Inicie o frontend (em outro terminal):
cd cardiorisk-frontend
npm start


Acesse o app:

Abra http://localhost:3000 no navegador.



🖥️ Uso

Faça login com suas credenciais de médico.
Use "Esqueceu a senha?" pra recuperar o acesso, se necessário.
No dashboard, veja as estatísticas de consultas.
Cadastre pacientes e calcule o risco cardiovascular.

🤝 Contribuição

Faça um fork do projeto.
Crie uma branch pra sua feature (git checkout -b feature/nova-funcionalidade).
Commit suas mudanças (git commit -m 'Adiciona nova funcionalidade').
Envie pro repositório remoto (git push origin feature/nova-funcionalidade).
Abra um Pull Request.

📜 Licença
Este projeto está sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
