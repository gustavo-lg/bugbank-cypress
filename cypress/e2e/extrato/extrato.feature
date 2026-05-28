# language: pt
Funcionalidade: Extrato
  Como um usuário logado
  Quero visualizar meu extrato bancário
  Para acompanhar minhas movimentações

  Contexto:
    Dado que o usuário está logado e na tela de Extrato

  Cenário: Extrato exibe saldo atualizado com saldo inicial (CT-022)
    Então o saldo exibido corresponde ao saldo "R$ 1.000,00"

  Cenário: Extrato exibe saldo zerado quando criado sem saldo inicial (CT-023)
    Dado que o usuário está logado sem saldo e na tela de Extrato
    Então o saldo exibido corresponde ao saldo "R$ 0,00"

  Cenário: Data da transação de abertura corresponde à data de hoje (CT-024)
    Então a data da transação de abertura de conta corresponde à data de hoje
