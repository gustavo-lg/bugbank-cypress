# language: pt
Funcionalidade: Pagamento
  Como um usuário logado
  Quero acessar o módulo de Pagamento
  Para verificar que a funcionalidade está em desenvolvimento

  Contexto:
    Dado que o usuário está logado e na home

  Cenário: Pagamento exibe modal de funcionalidade em desenvolvimento (CT-025)
    Quando clico no botão de Pagamentos
    Então vejo o modal com texto "Funcionalidade em desenvolvimento"
    E o botão "Fechar" está visível no modal
