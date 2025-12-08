# pgats-2-perform-k6-trabalhofinal

## Descrição

Esta é uma API para um sistema de venda de ingressos para a exposição de Sebastião Salgado.

### Funcionalidades

*   **Autenticação**: Acesso seguro com tokens JWT.
*   **Venda de Ingressos**: Endpoint para registrar a venda de ingressos.
*   **Listagem de Vendas**: Endpoint para visualizar todas as vendas registradas.

## Pré-requisitos

*   [Node.js](https://nodejs.org/)
*   [k6](https://k6.io/docs/getting-started/installation/)

## Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/criscandeloro/pgats-2-perform-k6-trabalhofinal.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd pgats-2-perform-k6-trabalhofinal
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```

## Executando a Aplicação

1.  Inicie o servidor:
    ```bash
    npm start
    ```
2.  A API estará disponível em `http://localhost:3000`.

## Documentação da API

A API é autodocumentada usando Swagger. Acesse a documentação em:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Executando os Testes de Performance com k6

Para executar os testes de performance, utilize o seguinte comando:

```bash
k6 run test/k6/ticket.test.js
```

### Entendendo o Script de Teste do k6

O script de teste em `test/k6/ticket.test.js` utiliza conceitos importantes do k6 para simular o comportamento do usuário e validar a performance da API.

#### **Groups**

Grupos são usados para organizar o script de teste em seções lógicas, representando diferentes ações do usuário.

*   **`Fazendo o login`**: Simula o processo de autenticação de um usuário.
*   **`Comprando ticket`**: Simula a compra de um ingresso.
*   **`Buscando tickets`**: Simula a busca por ingressos vendidos.

```javascript
// Exemplo de Groups no script
group('Fazendo o login', () => {
    // ... lógica do login
});

group('Comprando ticket', () => {
    // ... lógica da compra
});

group('Buscando tickets', () => {
    // ... lógica da busca
});
```

#### **Checks**

Checks são asserções usadas para verificar se a resposta de uma requisição atende a determinados critérios (ex: status code).

```javascript
// Exemplo de Checks no script
check(responseTicket, {
  "status deve ser igual a 201": (r) => r.status === 201
});

check(responseGetTicket, {
  "status deve ser igual a 200 para buscar os tickets vendidos": (r) => r.status === 200
});
```

#### **Thresholds**

Thresholds são os critérios de aprovação do teste. Eles definem as metas que as métricas de performance (como duração da requisição ou taxa de falha) devem atingir.

```javascript
// Exemplo de Thresholds no script
export const options = {
  // ...
  thresholds: {
    'http_req_duration': ['p(90)<=2000'], // 90% das requisições devem completar em até 2000ms
    'http_req_failed': ['rate<0.01']      // A taxa de falhas deve ser menor que 1%
  }
};
```