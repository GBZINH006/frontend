# 🎓 Sistema Escolar — Frontend

Interface web do sistema escolar desenvolvido como projeto final do curso de Desenvolvimento de Sistemas do SENAI.

**Equipe:** Gustavo, Ana, Erick e Gabriel

---

## 🚀 Tecnologias

- React
- Vite
- React Router DOM
- Axios
- PrimeReact (componentes UI)
- PrimeIcons
- jsPDF + jsPDF-AutoTable (exportar PDF)

---

## 📁 Estrutura do projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ScrollToTop.jsx
│   │   └── ToastProvider.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── UIContext.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── layout.css
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.css
│   │   ├── Topbar.jsx
│   │   └── Topbar.css
│   ├── pages/
│   │   ├── Attendance.jsx
│   │   ├── Classes.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Enrollments.jsx
│   │   ├── Grades.jsx
│   │   ├── login.jsx
│   │   ├── Myenrollments.jsx
│   │   ├── Mygrades.jsx
│   │   ├── Profile.jsx
│   │   ├── ProfessorDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── Students.jsx
│   │   └── Teachers.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Attendance.css
│   │   ├── Dashboard.css
│   │   ├── global.css
│   │   ├── login.css
│   │   └── Profile.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

---

## ⚙️ Como rodar o projeto

**1. Clone o repositório:**
```bash
git clone https://github.com/seuusuario/FullStack.git
cd FullStack/frontend
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure a URL da API no arquivo `src/services/api.js`:**
```javascript
const api = axios.create({
  baseURL: "http://localhost:3000",
});
```

**4. Rode o projeto:**
```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## 🔐 Autenticação

O sistema usa JWT armazenado no `localStorage`. O token é enviado automaticamente em todas as requisições pelo interceptor do Axios.

O login inicial é feito com as credenciais do admin criado automaticamente pelo backend:
```
Email: admin@admin.com
Senha: Admin123
```

---

## 👤 Dashboards por Role

### Admin
- Visão geral com estatísticas e gráfico de médias
- CRUD completo de alunos, professores, turmas, matrículas e notas
- Exportar notas em PDF
- Filtro por turma na página de notas

### Professor
- Dashboard com turmas e lançamento de notas
- Média e aprovações por turma
- Registro de frequência por aula e data
- Visualização de alunos e matrículas das suas turmas
- Histórico de alterações de notas

### Aluno
- Dashboard com resumo de turmas e notas
- Visualização das suas turmas e notas
- Situação por disciplina — Aprovado, Recuperação ou Reprovado

---

## 🔔 Notificações

O sistema envia notificações automáticas para o aluno quando:
- Uma nota é lançada
- Uma nota é atualizada

As notificações aparecem no sino no topo da página e podem ser marcadas como lidas.

---

## 📄 Exportar PDF

Na página de Notas, o admin pode exportar a lista de notas filtrada em PDF clicando no botão **Exportar PDF**.

---

## 🗂️ Rotas do frontend

| Rota | Página | Role |
|------|--------|------|
| `/login` | Login | Todos |
| `/` | Dashboard | Todos |
| `/profile` | Perfil | Todos |
| `/students` | Alunos | admin, professor |
| `/teachers` | Professores | admin |
| `/classes` | Turmas | admin, professor |
| `/enrollments` | Matrículas | admin, professor |
| `/grades` | Notas | admin, professor |
| `/attendance` | Frequência | admin, professor |
| `/my-enrollments` | Minhas Turmas | aluno |
| `/my-grades` | Minhas Notas | aluno |

---

## 👥 Equipe

| Nome | Função |
|------|--------|
| Gustavo | Backend |
| Erick | Backend |
| Ana | Frontend |
| Gabriel | Frontend |