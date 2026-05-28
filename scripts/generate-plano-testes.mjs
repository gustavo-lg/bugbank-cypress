import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
  UnderlineType,
} from "docx";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "../docs/Plano_de_Testes_BugBank_v3.docx");

// ── Cores ────────────────────────────────────────────────────────────────────
const AZUL_TITULO = "1A3A5C";
const AZUL_HEADER = "2D6CA2";
const VERDE_POS = "1B6B3A";
const VERMELHO_NEG = "8B1A1A";
const CINZA_FUNDO = "F2F4F7";
const BRANCO = "FFFFFF";
const AMARELO_BUG = "FFF3CD";
const LARANJA_BUG = "D97706";

// ── Helpers ───────────────────────────────────────────────────────────────────
function bold(text, color = "000000", size = 20) {
  return new TextRun({ text, bold: true, color, size });
}

function normal(text, color = "000000", size = 20) {
  return new TextRun({ text, color, size });
}

function mono(text, color = "1A1A6E", size = 18) {
  return new TextRun({ text, font: "Courier New", color, size });
}

function heading1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: BRANCO, size: 28 })],
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    shading: { type: ShadingType.CLEAR, fill: AZUL_TITULO },
    spacing: { before: 200, after: 200 },
  });
}

function heading2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: BRANCO, size: 22 })],
    heading: HeadingLevel.HEADING_2,
    shading: { type: ShadingType.CLEAR, fill: AZUL_HEADER },
    spacing: { before: 280, after: 120 },
    indent: { left: 0 },
  });
}

function sectionLabel(label, value, isCode = false) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: "2D6CA2", size: 20 }),
      isCode
        ? new TextRun({ text: value, font: "Courier New", color: "1A1A6E", size: 18 })
        : new TextRun({ text: value, size: 20 }),
    ],
    spacing: { before: 60, after: 40 },
    indent: { left: 360 },
  });
}

function bullet(text, isCode = false) {
  return new Paragraph({
    children: [
      isCode
        ? new TextRun({ text, font: "Courier New", color: "1A1A6E", size: 18 })
        : new TextRun({ text, size: 20 }),
    ],
    bullet: { level: 0 },
    spacing: { before: 30, after: 30 },
    indent: { left: 720 },
  });
}

function numberedStep(num, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${num}. `, bold: true, size: 20 }),
      new TextRun({ text, size: 20 }),
    ],
    spacing: { before: 30, after: 30 },
    indent: { left: 720 },
  });
}

function gherkinLine(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Courier New", color: "1A3A5C", size: 18 })],
    spacing: { before: 20, after: 20 },
    indent: { left: 720 },
    shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
  });
}

function bugWarning(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: "⚠️  Bug documentado: ", bold: true, color: LARANJA_BUG, size: 20 }),
      new TextRun({ text, color: "7C2D12", size: 20 }),
    ],
    spacing: { before: 80, after: 80 },
    indent: { left: 360 },
    shading: { type: ShadingType.CLEAR, fill: AMARELO_BUG },
    border: {
      left: { color: LARANJA_BUG, size: 12, style: BorderStyle.SINGLE },
    },
  });
}

function divider() {
  return new Paragraph({
    children: [],
    border: { bottom: { color: "D1D5DB", size: 6, style: BorderStyle.SINGLE } },
    spacing: { before: 200, after: 200 },
  });
}

function typeBadge(tipo) {
  const isPos = tipo === "Positivo";
  return new Paragraph({
    children: [
      new TextRun({
        text: `  ${tipo}  `,
        bold: true,
        color: BRANCO,
        size: 18,
        highlight: isPos ? "green" : "red",
      }),
      new TextRun({ text: "   Automação Cypress: ", bold: true, color: "374151", size: 18 }),
      new TextRun({ text: "Alto", bold: true, color: "1B6B3A", size: 18 }),
    ],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });
}

function emptyLine() {
  return new Paragraph({ children: [], spacing: { before: 40, after: 40 } });
}

// ── Capa ──────────────────────────────────────────────────────────────────────
function capaSection() {
  return [
    new Paragraph({ children: [], spacing: { before: 600, after: 0 } }),
    new Paragraph({
      children: [new TextRun({ text: "PLANO DE TESTES", bold: true, color: BRANCO, size: 52 })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: AZUL_TITULO },
      spacing: { before: 200, after: 0 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "BugBank — Automação E2E", bold: true, color: BRANCO, size: 32 })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: AZUL_TITULO },
      spacing: { before: 0, after: 0 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Cypress + TypeScript + BDD (Gherkin PT-BR)", color: "A8C8E8", size: 22 })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: AZUL_TITULO },
      spacing: { before: 0, after: 200 },
    }),
    new Paragraph({ children: [], spacing: { before: 400, after: 0 } }),
    new Paragraph({
      children: [new TextRun({ text: "Versão: 3.0", bold: true, size: 22, color: "374151" })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Data: ${new Date().toLocaleDateString("pt-BR")}`, size: 20, color: "6B7280" })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: "Aplicação: https://bugbank.netlify.app/", size: 20, color: "2563EB" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ── Resumo geral ──────────────────────────────────────────────────────────────
function resumoSection() {
  const rows = [
    ["ID", "Módulo / Funcionalidade", "Tipo", "Prioridade"],
    ["CT-001", "Login com credenciais válidas", "Positivo", "Alta"],
    ["CT-002", "Login sem e-mail e senha", "Negativo", "Alta"],
    ["CT-003", "Login sem e-mail", "Negativo", "Alta"],
    ["CT-004", "Login sem senha", "Negativo", "Alta"],
    ["CT-005", "Login com usuário não cadastrado", "Negativo", "Alta"],
    ["CT-006", "Login com senha incorreta", "Negativo", "Alta"],
    ["CT-007", "Cadastro com saldo inicial ativo", "Positivo", "Alta"],
    ["CT-008", "Cadastro sem saldo inicial", "Positivo", "Alta"],
    ["CT-009", "Cadastro sem preencher Nome", "Negativo", "Alta"],
    ["CT-010", "Cadastro sem preencher E-mail", "Negativo", "Alta"],
    ["CT-011", "Cadastro sem preencher Senha", "Negativo", "Alta"],
    ["CT-012", "Cadastro sem Confirmação de Senha", "Negativo", "Alta"],
    ["CT-013", "Cadastro com senhas divergentes", "Negativo", "Alta"],
    ["CT-014", "Transferência com sucesso", "Positivo", "Alta"],
    ["CT-015", "Transferência para conta inválida", "Negativo", "Alta"],
    ["CT-016 ⚠️", "Transferência com saldo insuficiente (bug documentado)", "Negativo", "Alta"],
    ["CT-017", "Transferência — valor igual ao saldo (borda)", "Positivo", "Alta"],
    ["CT-018", "Transferência com valor zero", "Negativo", "Alta"],
    ["CT-018b", "Transferência sem preencher Valor", "Negativo", "Alta"],
    ["CT-019", "Descrição em branco é permitida", "Positivo", "Alta"],
    ["CT-020", "Campos de conta aceitam apenas números", "Negativo", "Alta"],
    ["CT-021", "Extrato exibe saldo atualizado", "Positivo", "Alta"],
    ["CT-022", "Extrato exibe data, tipo e valor das transações", "Positivo", "Alta"],
    ["CT-023", "Valores de saída em vermelho com sinal negativo", "Positivo", "Alta"],
    ["CT-024", "Valores de entrada em verde", "Positivo", "Alta"],
    ["CT-025", "Transação sem comentário exibe traço", "Positivo", "Alta"],
    ["CT-026", "Pagamento — modal de funcionalidade em desenvolvimento", "Positivo", "Alta"],
    ["CT-026b", "Modal de Pagamento pode ser fechado", "Positivo", "Alta"],
    ["CT-027", "Saque — modal de funcionalidade em desenvolvimento", "Positivo", "Alta"],
    ["CT-027b", "Modal de Saque pode ser fechado", "Positivo", "Alta"],
    ["CT-028", "Data da transação corresponde à data de hoje", "Positivo", "Alta"],
    ["CT-029", "Valor da abertura de conta exibido corretamente", "Positivo", "Alta"],
  ];

  const tableRows = rows.map((row, idx) => {
    const isHeader = idx === 0;
    const isNeg = row[2] === "Negativo";
    const isBug = row[0].includes("⚠️");
    const fill = isHeader ? AZUL_HEADER : isBug ? AMARELO_BUG : idx % 2 === 0 ? CINZA_FUNDO : BRANCO;

    return new TableRow({
      children: row.map((cell, ci) => {
        const color = isHeader
          ? BRANCO
          : ci === 2
          ? isNeg
            ? VERMELHO_NEG
            : VERDE_POS
          : "111827";
        return new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: cell, bold: isHeader || ci === 0, color, size: 18 })],
              alignment: AlignmentType.LEFT,
            }),
          ],
          shading: { type: ShadingType.CLEAR, fill },
          width: ci === 0 ? { size: 10, type: WidthType.PERCENTAGE } : { size: 30, type: WidthType.PERCENTAGE },
        });
      }),
    });
  });

  return [
    heading1("Resumo dos Casos de Teste"),
    new Paragraph({
      children: [
        bold("Total de Casos: "),
        normal("31 (CT-001 a CT-029, incluindo CT-018b, CT-026b e CT-027b)   "),
        bold("Positivos: "),
        normal("17   "),
        bold("Negativos: "),
        normal("14"),
      ],
      spacing: { before: 120, after: 120 },
    }),
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ── Caso de Teste ─────────────────────────────────────────────────────────────
function casoTeste({
  id,
  titulo,
  tipo,
  descricao,
  preCondicoes,
  dadosTeste,
  passos,
  gherkin,
  resultadoEsperado,
  criterios,
  bugNote,
}) {
  const items = [];

  items.push(heading2(`${id} — ${titulo}`));
  items.push(typeBadge(tipo));

  items.push(
    new Paragraph({
      children: [bold("📋 Descrição: "), normal(descricao)],
      spacing: { before: 80, after: 40 },
      indent: { left: 360 },
    })
  );

  items.push(
    new Paragraph({
      children: [bold("🔧 Pré-condições: "), normal(preCondicoes)],
      spacing: { before: 40, after: 40 },
      indent: { left: 360 },
    })
  );

  if (dadosTeste && dadosTeste.length > 0) {
    items.push(
      new Paragraph({
        children: [bold("📊 Dados de Teste:")],
        spacing: { before: 60, after: 20 },
        indent: { left: 360 },
      })
    );
    dadosTeste.forEach((d) => items.push(bullet(d)));
  }

  items.push(
    new Paragraph({
      children: [bold("🚶 Passos:")],
      spacing: { before: 60, after: 20 },
      indent: { left: 360 },
    })
  );
  passos.forEach((p, i) => items.push(numberedStep(i + 1, p)));

  if (bugNote) {
    items.push(emptyLine());
    items.push(bugWarning(bugNote));
  }

  items.push(
    new Paragraph({
      children: [bold("🥒 Gherkin (BDD):")],
      spacing: { before: 80, after: 30 },
      indent: { left: 360 },
    })
  );
  gherkin.forEach((line) => items.push(gherkinLine(line)));

  items.push(
    new Paragraph({
      children: [bold("✅ Resultado Esperado: "), normal(resultadoEsperado)],
      spacing: { before: 80, after: 40 },
      indent: { left: 360 },
    })
  );

  items.push(
    new Paragraph({
      children: [bold("🎯 Critérios de Aceitação:")],
      spacing: { before: 60, after: 20 },
      indent: { left: 360 },
    })
  );
  criterios.forEach((c) => {
    const isCode = c.includes("`") || c.includes("#") || c.includes(".");
    const text = c.replace(/`/g, "");
    items.push(bullet(text, isCode));
  });

  items.push(divider());

  return items;
}

// ── Dados de todos os 31 CTs ──────────────────────────────────────────────────
const casos = [
  {
    id: "CT-001",
    titulo: "Login com credenciais válidas",
    tipo: "Positivo",
    descricao:
      "Verificar que o login com e-mail e senha válidos redireciona para a home, exibe o saldo e o nome do usuário.",
    preCondicoes: "Usuário previamente cadastrado com e-mail usuario@teste.com e senha Senha@123.",
    dadosTeste: ["E-mail: usuario@teste.com", "Senha: Senha@123"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Preencher o campo E-mail com usuario@teste.com",
      'Preencher o campo Senha com Senha@123',
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      'Quando preencho o e-mail "usuario@teste.com" e a senha "Senha@123"',
      'E clico em "Acessar"',
      "Então sou redirecionado para a home",
      "E o saldo da conta é exibido",
      "E o nome do usuário é exibido na home",
    ],
    resultadoEsperado:
      "Usuário redirecionado para /home, saldo visível em #textBalance, nome do usuário exibido em #textName.",
    criterios: [
      "URL contém /home",
      "Elemento #textBalance está visível",
      "Elemento #textName contém o nome do usuário logado",
    ],
  },
  {
    id: "CT-002",
    titulo: "Login sem preencher e-mail e senha",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário de login com ambos os campos em branco exibe mensagem de erro.",
    preCondicoes: "Página de login aberta.",
    dadosTeste: ["E-mail: (vazio)", "Senha: (vazio)"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Deixar os campos E-mail e Senha em branco",
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      "Quando deixo os campos E-mail e Senha em branco",
      'E clico em "Acessar"',
      'Então vejo a mensagem "Usuário e senha precisam ser preenchidos"',
    ],
    resultadoEsperado: 'Modal exibido com texto "Usuário e senha precisam ser preenchidos". Login não realizado.',
    criterios: [
      '#modalText exibe exatamente "Usuário e senha precisam ser preenchidos"',
      "Usuário permanece na página de login",
    ],
  },
  {
    id: "CT-003",
    titulo: "Login sem preencher apenas o e-mail",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário com o campo E-mail em branco exibe mensagem de erro.",
    preCondicoes: "Página de login aberta.",
    dadosTeste: ["E-mail: (vazio)", "Senha: Senha@123"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Deixar o campo E-mail em branco",
      "Preencher a senha com Senha@123",
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      "Quando deixo o campo E-mail em branco",
      'E preencho a senha "Senha@123"',
      'E clico em "Acessar"',
      'Então vejo a mensagem "Usuário e senha precisam ser preenchidos"',
    ],
    resultadoEsperado: 'Modal exibido com texto "Usuário e senha precisam ser preenchidos". Login não realizado.',
    criterios: [
      '#modalText exibe exatamente "Usuário e senha precisam ser preenchidos"',
      "Usuário permanece na página de login",
    ],
  },
  {
    id: "CT-004",
    titulo: "Login sem preencher apenas a senha",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário com o campo Senha em branco exibe mensagem de erro.",
    preCondicoes: "Página de login aberta.",
    dadosTeste: ["E-mail: usuario@teste.com", "Senha: (vazio)"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Preencher o e-mail com usuario@teste.com",
      "Deixar o campo Senha em branco",
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      'Quando preencho o e-mail "usuario@teste.com"',
      "E deixo o campo Senha em branco",
      'E clico em "Acessar"',
      'Então vejo a mensagem "Usuário e senha precisam ser preenchidos"',
    ],
    resultadoEsperado: 'Modal exibido com texto "Usuário e senha precisam ser preenchidos". Login não realizado.',
    criterios: [
      '#modalText exibe exatamente "Usuário e senha precisam ser preenchidos"',
      "Usuário permanece na página de login",
    ],
  },
  {
    id: "CT-005",
    titulo: "Login com usuário não cadastrado",
    tipo: "Negativo",
    descricao: "Verificar que tentar fazer login com um e-mail inexistente exibe mensagem de erro.",
    preCondicoes: "Página de login aberta. E-mail naoexiste@bugbank.com não cadastrado.",
    dadosTeste: ["E-mail: naoexiste@bugbank.com", "Senha: qualquer"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Preencher o e-mail com naoexiste@bugbank.com",
      "Preencher a senha com qualquer",
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      'Quando preencho o e-mail "naoexiste@bugbank.com" e a senha "qualquer"',
      'E clico em "Acessar"',
      "Então vejo mensagem de erro de usuário inválido",
    ],
    resultadoEsperado:
      'Modal exibido com texto "Usuário ou senha inválido. Tente novamente ou verifique suas informações!". Login não realizado.',
    criterios: ['#modalText contém "Usuário ou senha inválido"', "Usuário permanece na página de login"],
  },
  {
    id: "CT-006",
    titulo: "Login com senha incorreta",
    tipo: "Negativo",
    descricao: "Verificar que tentar fazer login com senha errada exibe mensagem de erro, mesmo com e-mail válido.",
    preCondicoes: "Usuário usuario@teste.com cadastrado. Página de login aberta.",
    dadosTeste: ["E-mail: usuario@teste.com", "Senha: SenhaErrada999"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      "Preencher o e-mail com usuario@teste.com",
      "Preencher a senha com SenhaErrada999",
      'Clicar em "Acessar"',
    ],
    gherkin: [
      "Dado que estou na página de Login do BugBank",
      'Quando preencho o e-mail "usuario@teste.com" e a senha "SenhaErrada999"',
      'E clico em "Acessar"',
      "Então vejo mensagem de erro de credenciais inválidas",
    ],
    resultadoEsperado:
      'Modal exibido com texto "Usuário ou senha inválido. Tente novamente ou verifique suas informações!". Login não realizado.',
    criterios: ['#modalText contém "Usuário ou senha inválido"', "Usuário permanece na página de login"],
  },
  {
    id: "CT-007",
    titulo: 'Cadastro com saldo inicial ativo',
    tipo: "Positivo",
    descricao:
      'Verificar que cadastrar uma nova conta com o toggle "Criar conta com saldo" ativo cria a conta com R$ 1.000,00 de saldo inicial.',
    preCondicoes: 'Página de cadastro aberta (após clicar em "Registrar").',
    dadosTeste: [
      "Nome: gerado dinamicamente (Gustavo Teste)",
      "E-mail: gerado dinamicamente (único por execução)",
      "Senha: Senha@456",
      "Confirmação de Senha: Senha@456",
      "Toggle saldo: ativo",
    ],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher todos os campos corretamente",
      'Ativar o toggle "Criar conta com saldo"',
      'Clicar em "Cadastrar"',
      "Verificar modal de sucesso",
      "Fechar modal e fazer login com a nova conta",
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      "Quando preencho todos os campos corretamente",
      'E ativo o toggle "Criar conta com saldo"',
      'E clico em "Cadastrar"',
      "Então vejo o número da conta criada",
      'E ao fazer login o saldo exibido é "R$ 1.000,00"',
    ],
    resultadoEsperado:
      'Modal de sucesso exibe "A conta NNNN-N foi criada com sucesso". Ao fazer login, #textBalance exibe R$ 1.000,00.',
    criterios: [
      "#modalText corresponde ao padrão: A conta \\d{4}-\\d foi criada com sucesso",
      'Após login, #textBalance contém "R$ 1.000,00"',
    ],
  },
  {
    id: "CT-008",
    titulo: "Cadastro sem saldo inicial",
    tipo: "Positivo",
    descricao:
      'Verificar que cadastrar uma conta sem ativar o toggle "Criar conta com saldo" cria a conta com saldo R$ 0,00.',
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: [
      "Nome: gerado dinamicamente",
      "E-mail: gerado dinamicamente",
      "Senha: Senha@456",
      "Confirmação de Senha: Senha@456",
      "Toggle saldo: inativo",
    ],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher todos os campos",
      "Manter o toggle desativado",
      'Clicar em "Cadastrar"',
      "Fechar modal e fazer login",
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      "Quando preencho todos os campos corretamente",
      'E mantenho o toggle "Criar conta com saldo" inativo',
      'E clico em "Cadastrar"',
      "Então vejo o número da conta criada",
      'E ao fazer login o saldo exibido é "R$ 0,00"',
    ],
    resultadoEsperado: "Conta criada com sucesso. Ao fazer login, #textBalance exibe R$ 0,00.",
    criterios: [
      "#modalText corresponde ao padrão: A conta \\d{4}-\\d foi criada com sucesso",
      'Após login, #textBalance contém "R$ 0,00"',
    ],
  },
  {
    id: "CT-009",
    titulo: "Cadastro sem preencher Nome",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário sem preencher o campo Nome exibe mensagem de validação.",
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: ["Nome: (vazio)", "E-mail: gerado dinamicamente", "Senha: Senha@456", "Confirmação de Senha: Senha@456"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Deixar o campo Nome em branco",
      "Preencher os demais campos",
      'Clicar em "Cadastrar"',
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      'Quando deixo o campo "Nome" em branco',
      "E preencho os demais campos corretamente",
      'E clico em "Cadastrar"',
      'Então vejo a mensagem "Nome não pode ser vazio"',
    ],
    resultadoEsperado: '"Nome não pode ser vazio" exibida. Conta não criada.',
    criterios: ['Mensagem exata: "Nome não pode ser vazio"', "Conta não criada"],
  },
  {
    id: "CT-010",
    titulo: "Cadastro sem preencher E-mail",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário sem preencher o campo E-mail exibe mensagem de validação.",
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: ["Nome: Gustavo Teste", "E-mail: (vazio)", "Senha: Senha@456", "Confirmação de Senha: Senha@456"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher Nome e Senha",
      "Deixar o campo E-mail em branco",
      'Clicar em "Cadastrar"',
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      'Quando deixo o campo "E-mail" em branco',
      "E preencho os demais campos corretamente",
      'E clico em "Cadastrar"',
      'Então vejo a mensagem "Email não pode ser vazio"',
    ],
    resultadoEsperado: '"Email não pode ser vazio" exibida. Conta não criada.',
    criterios: ['Mensagem exata: "Email não pode ser vazio"', "Conta não criada"],
  },
  {
    id: "CT-011",
    titulo: "Cadastro sem preencher Senha",
    tipo: "Negativo",
    descricao: "Verificar que submeter o formulário sem preencher o campo Senha exibe mensagem de validação.",
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: ["Nome: Gustavo Teste", "E-mail: gerado dinamicamente", "Senha: (vazio)", "Confirmação de Senha: Senha@456"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher Nome e E-mail",
      "Deixar o campo Senha em branco",
      'Clicar em "Cadastrar"',
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      'Quando deixo o campo "Senha" em branco',
      "E preencho os demais campos corretamente",
      'E clico em "Cadastrar"',
      'Então vejo a mensagem "Senha não pode ser vazio"',
    ],
    resultadoEsperado: '"Senha não pode ser vazio" exibida. Conta não criada.',
    criterios: ['Mensagem exata: "Senha não pode ser vazio"', "Conta não criada"],
  },
  {
    id: "CT-012",
    titulo: "Cadastro sem preencher Confirmação de Senha",
    tipo: "Negativo",
    descricao:
      "Verificar que submeter o formulário sem preencher o campo Confirmação de Senha exibe mensagem de validação.",
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: ["Nome: Gustavo Teste", "E-mail: gerado dinamicamente", "Senha: Senha@456", "Confirmação de Senha: (vazio)"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher Nome, E-mail e Senha",
      "Deixar o campo Confirmação de Senha em branco",
      'Clicar em "Cadastrar"',
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      'Quando deixo o campo "Confirmar senha" em branco',
      "E preencho os demais campos corretamente",
      'E clico em "Cadastrar"',
      'Então vejo a mensagem "Confirmar senha não pode ser vazio"',
    ],
    resultadoEsperado: '"Confirmar senha não pode ser vazio" exibida. Conta não criada.',
    criterios: ['Mensagem exata: "Confirmar senha não pode ser vazio"', "Conta não criada"],
  },
  {
    id: "CT-013",
    titulo: "Cadastro com senhas divergentes",
    tipo: "Negativo",
    descricao:
      "Verificar que preencher Senha e Confirmação de Senha com valores diferentes impede o cadastro e exibe mensagem de erro.",
    preCondicoes: "Página de cadastro aberta.",
    dadosTeste: ["Senha: Senha@111", "Confirmação de Senha: Senha@222"],
    passos: [
      "Acessar https://bugbank.netlify.app/",
      'Clicar em "Registrar"',
      "Preencher o campo Senha com Senha@111",
      "Preencher o campo Confirmação de Senha com Senha@222",
      'Clicar em "Cadastrar"',
    ],
    gherkin: [
      "Dado que estou na página de Cadastro do BugBank",
      'Quando preencho "Senha" com "Senha@111"',
      'E preencho "Confirmar senha" com "Senha@222"',
      'E clico em "Cadastrar"',
      "Então vejo mensagem de senhas divergentes",
    ],
    resultadoEsperado: "Mensagem de erro indicando que as senhas não conferem. Conta não criada.",
    criterios: ["Mensagem contém referência a senha divergente/inválida", "Conta não criada"],
  },
  {
    id: "CT-014",
    titulo: "Transferência com sucesso",
    tipo: "Positivo",
    descricao:
      "Verificar que uma transferência com todos os dados válidos é processada com sucesso e redireciona para o extrato.",
    preCondicoes: "Usuário logado com saldo de R$ 1.500,00. Conta destino 2222-1 existente no sistema.",
    dadosTeste: ["Conta destino: 2222-1", "Valor: definido em transferencia.json", "Descrição: definida em transferencia.json"],
    passos: [
      "Fazer login e navegar para a tela de Transferência",
      "Ajustar saldo para R$ 1.500,00",
      "Preencher conta destino, valor e descrição",
      'Clicar em "Transferir agora"',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'E o saldo da conta é "R$ 1.500,00"',
      "Quando preencho todos os campos corretamente",
      'E clico em "Transferir agora"',
      'Então vejo a mensagem "Transferência realizada com sucesso"',
      "E sou redirecionado para a tela de Extrato",
      "E o saldo é debitado corretamente",
    ],
    resultadoEsperado:
      "Modal de sucesso exibido, usuário redirecionado para /bank-statement, transação visível no extrato.",
    criterios: [
      '#modalText exibe "Transferência realizada com sucesso"',
      "URL contém /bank-statement",
      "Ao menos uma transação visível no extrato",
    ],
  },
  {
    id: "CT-015",
    titulo: "Transferência para conta inválida",
    tipo: "Negativo",
    descricao: "Verificar que tentar transferir para uma conta inexistente exibe mensagem de erro.",
    preCondicoes: "Usuário logado. Conta 9999-9 não cadastrada.",
    dadosTeste: ["Conta destino: 9999-9", "Valor e Descrição: válidos (do fixture)"],
    passos: [
      "Fazer login e navegar para Transferência",
      "Inserir conta destino 9999-9",
      "Preencher valor e descrição",
      'Clicar em "Transferir agora"',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'Quando insiro a conta destino "9999-9"',
      "E preencho os demais campos corretamente",
      'E clico em "Transferir agora"',
      'Então vejo a mensagem "Conta inválida ou inexistente"',
    ],
    resultadoEsperado: 'Modal exibido com texto "Conta inválida ou inexistente". Transferência não realizada.',
    criterios: ['#modalText exibe exatamente "Conta inválida ou inexistente"', "Transferência não realizada"],
  },
  {
    id: "CT-016",
    titulo: "Transferência com saldo insuficiente",
    tipo: "Negativo",
    descricao: "Verificar o comportamento ao tentar transferir um valor maior que o saldo disponível.",
    bugNote:
      'O BugBank exibe "Conta inválida ou inexistente" em vez de uma mensagem de saldo insuficiente. Este teste documenta o comportamento real (com bug) da aplicação.',
    preCondicoes: "Usuário logado com saldo de R$ 50,00.",
    dadosTeste: ["Saldo da conta: R$ 50,00", "Valor a transferir: 200", "Conta destino: 2222-1"],
    passos: [
      "Fazer login e navegar para Transferência",
      "Ajustar saldo para R$ 50,00",
      "Inserir valor 200 com conta válida",
      'Clicar em "Transferir agora"',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'E o saldo da conta é "R$ 50,00"',
      'Quando insiro o valor "200"',
      'E clico em "Transferir agora"',
      'Então vejo a mensagem "Conta inválida ou inexistente"',
    ],
    resultadoEsperado: 'Modal exibe "Conta inválida ou inexistente" — mensagem incorreta para saldo insuficiente (bug documentado).',
    criterios: [
      '#modalText exibe "Conta inválida ou inexistente" (comportamento real com bug)',
      "Transferência não realizada",
    ],
  },
  {
    id: "CT-017",
    titulo: "Transferência com valor igual ao saldo (borda)",
    tipo: "Positivo",
    descricao:
      "Verificar que uma transferência com valor exatamente igual ao saldo disponível é processada com sucesso e zera o saldo.",
    preCondicoes: "Usuário logado com saldo de R$ 300,00.",
    dadosTeste: ["Saldo da conta: R$ 300,00", "Valor a transferir: 300", "Conta destino: 2222-1"],
    passos: [
      "Fazer login e navegar para Transferência",
      "Ajustar saldo para R$ 300,00",
      "Inserir valor igual ao saldo (300)",
      'Clicar em "Transferir agora"',
      "Fechar modal e verificar saldo",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'E o saldo da conta é "R$ 300,00"',
      'Quando insiro o valor "300"',
      'E clico em "Transferir agora"',
      "Então a transferência é realizada com sucesso",
      'E o saldo resultante é "R$ 0,00"',
    ],
    resultadoEsperado: "Transferência processada com sucesso. Saldo zerado em #textBalance.",
    criterios: ["#modalText indica transferência realizada", '#textBalance exibe "R$ 0,00" após fechar o modal'],
  },
  {
    id: "CT-018",
    titulo: "Transferência com valor zero",
    tipo: "Negativo",
    descricao: "Verificar que tentar transferir o valor zero exibe mensagem de erro.",
    preCondicoes: "Usuário logado. Conta destino existente.",
    dadosTeste: ["Valor: 0", "Conta destino: 2222-1"],
    passos: ["Fazer login e navegar para Transferência", "Inserir valor 0", 'Clicar em "Transferir agora"'],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'Quando insiro o valor "0"',
      'E clico em "Transferir agora"',
      "Então vejo mensagem de valor inválido",
    ],
    resultadoEsperado: 'Modal exibido com texto "Valor da transferência não pode ser 0 ou negativo".',
    criterios: ['#modalText exibe exatamente "Valor da transferência não pode ser 0 ou negativo"', "Transferência não realizada"],
  },
  {
    id: "CT-018b",
    titulo: "Transferência sem preencher Valor",
    tipo: "Negativo",
    descricao: "Verificar que tentar transferir sem preencher o campo Valor exibe erro de validação inline (não modal).",
    preCondicoes: "Usuário logado. Conta destino existente.",
    dadosTeste: ["Conta destino: 2222-1", "Valor: (vazio)"],
    passos: [
      "Fazer login e navegar para Transferência",
      "Preencher apenas a conta destino",
      "Deixar o campo Valor em branco",
      'Clicar em "Transferir agora"',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      "Quando preencho conta e valor corretamente mas deixo o valor em branco",
      'E clico em "Transferir agora"',
      "Então vejo erro de validação no campo Valor",
    ],
    resultadoEsperado:
      "Erro inline exibido abaixo do campo Valor: transferValue must be a number type, but the final value was: NaN",
    criterios: ["Elemento p.input__warging visível", 'Texto contém "NaN"', "Nenhum modal aberto"],
  },
  {
    id: "CT-019",
    titulo: "Descrição em branco é permitida",
    tipo: "Positivo",
    descricao: "Verificar que o campo Descrição é opcional — deixá-lo em branco não impede a transferência.",
    preCondicoes: "Usuário logado com saldo suficiente. Conta destino existente.",
    dadosTeste: ["Conta destino: 2222-1", "Valor: 100", "Descrição: (vazio)"],
    passos: [
      "Fazer login e navegar para Transferência",
      "Preencher conta destino e valor",
      "Deixar o campo Descrição em branco",
      'Clicar em "Transferir agora"',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      "Quando preencho conta e valor corretamente",
      'E deixo o campo "Descrição" em branco',
      'E clico em "Transferir agora"',
      "Então a transferência é realizada com sucesso",
    ],
    resultadoEsperado: "Transferência processada normalmente. Modal de sucesso exibido.",
    criterios: ["#modalText indica transferência realizada com sucesso", "Nenhuma mensagem de campo obrigatório para Descrição"],
  },
  {
    id: "CT-020",
    titulo: "Campos de conta aceitam apenas números",
    tipo: "Negativo",
    descricao: "Verificar que o campo Número da Conta rejeita caracteres não numéricos.",
    preCondicoes: "Usuário logado na tela de Transferência.",
    dadosTeste: ["Texto a inserir: ABC"],
    passos: [
      "Fazer login e navegar para Transferência",
      'Tentar inserir "ABC" no campo Número da Conta',
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Transferência",
      'Quando tento inserir "ABC" no campo número da conta',
      "Então os caracteres não são aceitos",
    ],
    resultadoEsperado: "Campo Número da Conta permanece vazio ou sem os caracteres alfabéticos.",
    criterios: ["input[name=\"accountNumber\"] não contém letras após a tentativa de digitação"],
  },
  {
    id: "CT-021",
    titulo: "Extrato exibe saldo atualizado",
    tipo: "Positivo",
    descricao: "Verificar que a tela de Extrato exibe o saldo disponível da conta no elemento correto.",
    preCondicoes: "Usuário logado com conta criada e transferência realizada. Na tela /bank-statement.",
    dadosTeste: [],
    passos: [
      "Registrar dois usuários (destinatário e remetente)",
      "Fazer login como remetente",
      "Realizar transferência de R$ 200,00",
      "Navegar para o Extrato",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      "Então o saldo exibido corresponde ao saldo real da conta",
    ],
    resultadoEsperado: "Elemento #textBalanceAvailable visível com valor no formato R$ X.XXX,XX.",
    criterios: ["#textBalanceAvailable está visível", "Texto corresponde ao padrão R$\\s*[\\d.,]+"],
  },
  {
    id: "CT-022",
    titulo: "Extrato exibe data, tipo e valor das transações",
    tipo: "Positivo",
    descricao: "Verificar que cada item do extrato exibe os três campos obrigatórios: data, tipo da transação e valor.",
    preCondicoes: "Usuário logado com ao menos uma transação no extrato.",
    dadosTeste: [],
    passos: [
      "Realizar o setup completo (cadastro + transferência)",
      "Navegar para o Extrato",
      "Verificar cada transação listada",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      "Então cada transação exibe data, tipo e valor",
    ],
    resultadoEsperado:
      "Cada container .bank-statement__Transaction contém #textDateTransaction, #textTypeTransaction e #textTransferValue não vazios.",
    criterios: ["Ao menos 1 transação listada", "Todos os campos visíveis e não vazios em cada transação"],
  },
  {
    id: "CT-023",
    titulo: "Valores de saída em vermelho com sinal negativo",
    tipo: "Positivo",
    descricao:
      'Verificar que transações de débito ("Transferencia enviada") são exibidas com o sinal negativo e cor vermelha.',
    preCondicoes: 'Usuário logado com ao menos uma transação de "Transferencia enviada" no extrato.',
    dadosTeste: [],
    passos: [
      "Realizar setup com transferência enviada",
      "Navegar para o Extrato",
      'Localizar transação do tipo "Transferencia enviada"',
      "Verificar sinal e cor do valor",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      'Então transações de débito são exibidas em vermelho com sinal "-"',
    ],
    resultadoEsperado:
      '#textTransferValue da transação "Transferencia enviada" contém "-" e tem cor vermelha (R > 150, G < 100, B < 100).',
    criterios: ['Texto do valor contém o sinal "-"', "CSS color com canal R dominante (vermelho)"],
  },
  {
    id: "CT-024",
    titulo: "Valores de entrada em verde",
    tipo: "Positivo",
    descricao:
      'Verificar que transações de crédito ("Abertura de conta") são exibidas com cor verde.',
    preCondicoes: 'Usuário logado com ao menos uma transação de "Abertura de conta" no extrato.',
    dadosTeste: [],
    passos: [
      "Realizar setup",
      "Navegar para o Extrato",
      'Localizar transação "Abertura de conta"',
      "Verificar cor do valor",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      "Então transações de crédito são exibidas em verde",
    ],
    resultadoEsperado: '#textTransferValue da transação "Abertura de conta" tem cor verde (G > R e G > B).',
    criterios: ["CSS color com canal G dominante (verde)"],
  },
  {
    id: "CT-025",
    titulo: 'Transação sem comentário exibe traço',
    tipo: "Positivo",
    descricao:
      'Verificar que quando uma transferência é realizada com a descrição preenchida como "-", o campo #textDescription exibe exatamente "-".',
    preCondicoes: 'Usuário logado. Transferência realizada com descrição "-".',
    dadosTeste: [],
    passos: [
      'Realizar setup com transferência usando descrição "-"',
      "Navegar para o Extrato",
      'Localizar transação "Transferencia enviada"',
      "Verificar campo de descrição",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      'Então transações sem comentário exibem "-" no campo de descrição',
    ],
    resultadoEsperado: '#textDescription da transação "Transferencia enviada" exibe exatamente "-".',
    criterios: ['#textDescription tem texto exato "-"'],
  },
  {
    id: "CT-026",
    titulo: "Pagamento exibe modal de funcionalidade em desenvolvimento",
    tipo: "Positivo",
    descricao:
      "Verificar que ao clicar no botão PAGAMENTOS na home, é exibido um modal informando que a funcionalidade está em desenvolvimento.",
    preCondicoes: "Usuário logado na home.",
    dadosTeste: [],
    passos: ["Fazer login e acessar a home", 'Clicar no botão PAGAMENTOS (#btn-PAGAMENTOS)'],
    gherkin: [
      "Dado que o usuário está logado e na home",
      "Quando clico no botão de Pagamentos",
      'Então vejo o modal com texto "Funcionalidade em desenvolvimento"',
      'E o botão "Fechar" está visível no modal',
    ],
    resultadoEsperado: 'Modal exibido com texto "Funcionalidade em desenvolvimento" e botão #btnCloseModal visível.',
    criterios: ['#modalText exibe "Funcionalidade em desenvolvimento"', "#btnCloseModal está visível"],
  },
  {
    id: "CT-026b",
    titulo: "Modal de Pagamento pode ser fechado",
    tipo: "Positivo",
    descricao: 'Verificar que o botão "Fechar" do modal de Pagamento remove o modal da tela.',
    preCondicoes: "Usuário logado na home. Modal de Pagamento aberto.",
    dadosTeste: [],
    passos: [
      "Fazer login e acessar a home",
      "Clicar no botão PAGAMENTOS",
      'Clicar em "Fechar" no modal',
    ],
    gherkin: [
      "Dado que o usuário está logado e na home",
      "Quando clico no botão de Pagamentos",
      'E clico em "Fechar" no modal',
      "Então o modal não está mais visível",
    ],
    resultadoEsperado: "#modalText não existe mais no DOM após fechar.",
    criterios: ["#modalText não existe no DOM (not.exist)"],
  },
  {
    id: "CT-027",
    titulo: "Saque exibe modal de funcionalidade em desenvolvimento",
    tipo: "Positivo",
    descricao:
      "Verificar que ao clicar no botão SAQUE na home, é exibido um modal informando que a funcionalidade está em desenvolvimento.",
    preCondicoes: "Usuário logado na home.",
    dadosTeste: [],
    passos: ["Fazer login e acessar a home", 'Clicar no botão SAQUE (#btn-SAQUE)'],
    gherkin: [
      "Dado que o usuário está logado e na home",
      "Quando clico no botão de Saque",
      'Então vejo o modal com texto "Funcionalidade em desenvolvimento"',
      'E o botão "Fechar" está visível no modal',
    ],
    resultadoEsperado: 'Modal exibido com texto "Funcionalidade em desenvolvimento" e botão #btnCloseModal visível.',
    criterios: ['#modalText exibe "Funcionalidade em desenvolvimento"', "#btnCloseModal está visível"],
  },
  {
    id: "CT-027b",
    titulo: "Modal de Saque pode ser fechado",
    tipo: "Positivo",
    descricao: 'Verificar que o botão "Fechar" do modal de Saque remove o modal da tela.',
    preCondicoes: "Usuário logado na home. Modal de Saque aberto.",
    dadosTeste: [],
    passos: [
      "Fazer login e acessar a home",
      "Clicar no botão SAQUE",
      'Clicar em "Fechar" no modal',
    ],
    gherkin: [
      "Dado que o usuário está logado e na home",
      "Quando clico no botão de Saque",
      'E clico em "Fechar" no modal',
      "Então o modal não está mais visível",
    ],
    resultadoEsperado: "#modalText não existe mais no DOM após fechar.",
    criterios: ["#modalText não existe no DOM (not.exist)"],
  },
  {
    id: "CT-028",
    titulo: "Data da transação corresponde à data de hoje",
    tipo: "Positivo",
    descricao:
      'Verificar que a data exibida na transação "Abertura de conta" no extrato corresponde à data atual (dia do teste).',
    preCondicoes: "Usuário logado com conta criada no dia do teste. Na tela de Extrato.",
    dadosTeste: [],
    passos: [
      "Realizar setup completo (cadastro + transferência no dia atual)",
      "Navegar para o Extrato",
      'Localizar transação "Abertura de conta"',
      "Verificar o valor de #textDateTransaction",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      "Então a data da transação de abertura de conta corresponde à data de hoje",
    ],
    resultadoEsperado: "#textDateTransaction exibe a data de hoje no formato DD/MM/AAAA.",
    criterios: ["#textDateTransaction tem texto igual a new Date().toLocaleDateString('pt-BR')"],
  },
  {
    id: "CT-029",
    titulo: "Valor da abertura de conta é exibido corretamente",
    tipo: "Positivo",
    descricao:
      'Verificar que o valor exibido na transação "Abertura de conta" no extrato corresponde ao saldo inicial de R$ 1.000,00.',
    preCondicoes: "Usuário logado com conta criada com saldo inicial ativo. Na tela de Extrato.",
    dadosTeste: [],
    passos: [
      "Realizar setup com conta criada com saldo inicial",
      "Navegar para o Extrato",
      'Localizar transação "Abertura de conta"',
      "Verificar o valor de #textTransferValue",
    ],
    gherkin: [
      "Dado que o usuário está logado e na tela de Extrato",
      'Então o valor da transação de abertura de conta exibe "1.000"',
    ],
    resultadoEsperado: '#textTransferValue da transação "Abertura de conta" contém "1.000".',
    criterios: ['#textTransferValue contém o texto "1.000"'],
  },
];

// ── Montar documento ──────────────────────────────────────────────────────────
const allParagraphs = [
  ...capaSection(),
  ...resumoSection(),
  heading1("Casos de Teste Detalhados"),
  emptyLine(),
];

casos.forEach((ct) => {
  allParagraphs.push(...casoTeste(ct));
});

// Rodapé informativo
allParagraphs.push(
  emptyLine(),
  new Paragraph({
    children: [
      new TextRun({ text: "Documentação gerada com base nos cenários BDD implementados e no HTML real inspecionado de ", size: 18, color: "6B7280", italics: true }),
      new TextRun({ text: "https://bugbank.netlify.app/", size: 18, color: "2563EB", italics: true }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
  })
);

const doc = new Document({
  creator: "BugBank Cypress Automation",
  title: "Plano de Testes BugBank v3",
  description: "Plano de Testes completo com 31 casos de teste — Cypress + TypeScript + BDD",
  sections: [
    {
      children: allParagraphs,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  writeFileSync(OUTPUT, buffer);
  console.log(`✅  Documento gerado em: ${OUTPUT}`);
});
