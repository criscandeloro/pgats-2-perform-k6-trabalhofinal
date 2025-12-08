# pgats-2-perform-k6-trabalhofinal
Projeto Trabalho Final da Disciplina Automação de Testes de Performance

## Descrição

Esta é uma API para um sistema de venda de ingressos para a exposição de Sebastião Salgado.

### Funcionalidades

*   **Autenticação**: Acesso seguro com tokens JWT.
*   **Venda de Ingressos**: Endpoint para registrar a venda de ingressos.
*   **Listagem de Vendas**: Endpoint para visualizar todas as vendas registradas.
*   **Documentação**: A API é autodocumentada usando Swagger.

## Como Executar

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor:**
    ```bash
    npm start
    ```

3.  **Acesse a documentação da API:**
    [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

 # Explicando os testes em K6:

 **Group:**

 É utilizada para organizar o script de teste em seções lógicas. No arquivo ticket.test.js foi utilizado três group para separar as principais ações do cenário de testes.  

 ```javascript

// Grupo 1: Simula o login do usuário
group('Fazendo o login', () => {
    // ...
});

// Grupo 2: Simula a compra de um ticket
group('Comprando ticket', () => {
    // ...
});

// Grupo 2: Simula a busca pelas vendas
group('Comprando ticket', () => {
    // ...
});
