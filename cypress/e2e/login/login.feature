# language: pt
Funcionalidade: Login
  Como um usuário cadastrado
  Quero fazer login no BugBank
  Para acessar minha conta

  Contexto:
    Dado que estou na página de Login do BugBank

  Cenário: Login com credenciais válidas (CT-001)
    Quando preencho o e-mail "usuario@teste.com" e a senha "Senha@123"
    E clico em "Acessar"
    Então sou redirecionado para a home
    E o saldo da conta é exibido
    E o nome do usuário é exibido na home

  Cenário: Login sem preencher e-mail e senha (CT-002)
    Quando deixo os campos E-mail e Senha em branco
    E clico em "Acessar"
    Então vejo aviso de campo obrigatório

  Cenário: Login sem preencher apenas o e-mail (CT-003)
    Quando deixo o campo E-mail em branco
    E preencho a senha "Senha@123"
    E clico em "Acessar"
    Então vejo aviso de campo obrigatório

  Cenário: Login sem preencher apenas a senha (CT-004)
    Quando preencho o e-mail "usuario@teste.com"
    E deixo o campo Senha em branco
    E clico em "Acessar"
    Então vejo aviso de campo obrigatório

  Cenário: Login com usuário não cadastrado (CT-005)
    Quando preencho o e-mail "naoexiste@bugbank.com" e a senha "qualquer"
    E clico em "Acessar"
    Então vejo mensagem de erro de usuário inválido

  Cenário: Login com senha incorreta (CT-006)
    Quando preencho o e-mail "usuario@teste.com" e a senha "SenhaErrada999"
    E clico em "Acessar"
    Então vejo mensagem de erro de credenciais inválidas
