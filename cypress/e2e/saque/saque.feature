# language: pt
Funcionalidade: Saque
  Como um usuário logado
  Quero acessar o módulo de Saque
  Para verificar que a funcionalidade está em desenvolvimento

  Contexto:
    Dado que o usuário está logado e na home

  Cenário: Saque exibe modal de funcionalidade em desenvolvimento (CT-026)
    Quando clico no botão de Saque
    Então vejo o modal com texto "Funcionalidade em desenvolvimento"
    E o botão "Fechar" está visível no modal
