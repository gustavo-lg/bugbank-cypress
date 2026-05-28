# language: pt
Funcionalidade: Cadastro
  Como um novo usuário
  Quero me cadastrar no BugBank
  Para ter acesso à plataforma

  Contexto:
    Dado que estou na página de Cadastro do BugBank

  Cenário: Cadastro com saldo inicial ativo (CT-007)
    Quando preencho todos os campos corretamente
    E ativo o toggle "Criar conta com saldo"
    E clico em "Cadastrar"
    Então vejo o número da conta criada
    E ao fazer login o saldo exibido é "R$ 1.000,00"

  Cenário: Cadastro sem saldo inicial (CT-008)
    Quando preencho todos os campos corretamente
    E mantenho o toggle "Criar conta com saldo" inativo
    E clico em "Cadastrar"
    Então vejo o número da conta criada
    E ao fazer login o saldo exibido é "R$ 0,00"

  Cenário: Cadastro sem preencher Nome (CT-009)
    Quando deixo o campo "Nome" em branco
    E preencho os demais campos corretamente
    E clico em "Cadastrar"
    Então vejo a mensagem "Nome não pode ser vazio"

  Cenário: Cadastro sem preencher E-mail (CT-010)
    Quando deixo o campo "E-mail" em branco
    E preencho os demais campos corretamente
    E clico em "Cadastrar"
    Então vejo aviso de campo obrigatório

  Cenário: Cadastro sem preencher Senha (CT-011)
    Quando deixo o campo "Senha" em branco
    E preencho os demais campos corretamente
    E clico em "Cadastrar"
    Então vejo aviso de campo obrigatório

  Cenário: Cadastro sem preencher Confirmação de Senha (CT-012)
    Quando deixo o campo "Confirmar senha" em branco
    E preencho os demais campos corretamente
    E clico em "Cadastrar"
    Então vejo aviso de campo obrigatório

  Cenário: Cadastro com senhas divergentes (CT-013)
    Quando preencho "Senha" com "Senha@111"
    E preencho "Confirmar senha" com "Senha@222"
    E clico em "Cadastrar"
    Então vejo mensagem de senhas divergentes
