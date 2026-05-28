# language: pt
Funcionalidade: Transferência
  Como um usuário logado com saldo disponível
  Quero realizar transferências para outras contas
  Para movimentar meu dinheiro no BugBank

  Contexto:
    Dado que o usuário está logado e na tela de Transferência

  Cenário: Transferência com sucesso (CT-014)
    E o saldo da conta é "R$ 1.000,00"
    Quando preencho todos os campos corretamente
    E clico em "Transferir agora"
    Então vejo a mensagem "Transferencia realizada com sucesso"
    E o saldo resultante é "R$ 800,00"

  Cenário: Transferência para conta inválida (CT-015)
    Quando insiro a conta destino "9999-9"
    E preencho os demais campos corretamente
    E clico em "Transferir agora"
    Então vejo a mensagem "Conta inválida ou inexistente"

  Cenário: Transferência com saldo insuficiente (CT-016)
    E o saldo da conta é "R$ 50,00"
    Quando insiro o valor "200"
    E clico em "Transferir agora"
    Então vejo a mensagem "Você não tem saldo suficiente para essa transação"

  Cenário: Transferência com valor maior que o saldo (CT-017)
    E o saldo da conta é "R$ 300,00"
    Quando insiro o valor "500"
    E clico em "Transferir agora"
    Então vejo a mensagem "Você não tem saldo suficiente para essa transação"

  Cenário: Transferência com valor zero (CT-018)
    Quando insiro o valor "0"
    E clico em "Transferir agora"
    Então vejo mensagem de valor inválido

  Cenário: Transferência sem preencher Valor (CT-019)
    Quando preencho conta e valor corretamente mas deixo o valor em branco
    E clico em "Transferir agora"
    Então vejo erro de validação no campo Valor

  Cenário: Descrição em branco é permitida (CT-020)
    Quando preencho conta e valor corretamente
    E deixo o campo "Descrição" em branco
    E clico em "Transferir agora"
    Então a transferência é realizada com sucesso

  Cenário: Campos de conta aceitam apenas números (CT-021)
    Quando tento inserir "ABC" no campo número da conta
    Então os caracteres não são aceitos
