# Trabalho Final da Disciplina Automação de Testes de Performance
# Aluna: Cristine Candeloro

## Descrição

Esta é uma API para um sistema de venda de ingressos para a exposição de Sebastião Salgado.

### Funcionalidades

*   **Autenticação**: Acesso seguro com tokens JWT.
*   **Venda de Ingressos**: Endpoint para registrar a venda de ingressos.
*   **Listagem de Vendas**: Endpoint para visualizar todas as vendas registradas ou uma venda específica.

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
Se precisar rodar os testes gerando o relatório, utilize o seguinte comando:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reports/ticket-test-dashboard.html k6 run test/k6/ticket.test.js

```

### Entendendo o Script de Teste do k6

  O script de teste em `test/k6/ticket.test.js` utiliza conceitos importantes do k6 para simular o comportamento do usuário e validar a performance da API.

#### **Thresholds**

  Thresholds são os critérios de aprovação do teste. Eles definem as metas que as métricas de performance (como duração da requisição ou taxa de falha) devem atingir.

```javascript
// Exemplo de Thresholds no script
export const options = {
  //...
  thresholds: {
        'http_req_duration': ['p(95)<5000'], // 95% das requests devem ser < 5s
        'checks{group:::Comprando ticket}': ['rate>0.99'], // Mais de 99% dos checks devem passar
        'checks{group:::Validando ticket}': ['rate>0.99'], // Mais de 99% dos checks devem passar
    },
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

#### **Helpers**

  Helpers são para reutlização de códigos e melhor organização do projeto. No arquivo de ticket.test.js usamos para a base url e login. 

```javascript
// Exemplo de Helpers no script
  import { getBaseUrl } from './helpers/getBaseUrl.js';
  import { login } from './helpers/login.js';
```

#### **Trends**

  Trends são métricas customizadas de tempo usada para medir a duração de eventos específicas do negócio.
  Abaixo mostra as métricas customizadas: compra do ticket e a validação do ticket.


```javascript
  const ticketsTrend = new Trend('tickets_duration');
  ticketsTrend.add(res.timings.duration); //compra do ticket
  ticketsTrend.add(getRes.timings.duration); //validação do ticket
```

#### **Faker**

  Faker é uma biblioteca usada para geração de dados fictícios (dados falsos) de forma dinâmica durante a realização dos testes.
  Abaixo mostra a utlização da biblioteca no script de teste:


```javascript
  import { Faker } from "k6/x/faker";

  const faker = new Faker(11);
  const age = faker.numbers.intRange(18, 99);
```


#### **Variável de Ambiente**

  Variável de Ambiente é um valor configurável fora do código fonte , utilizado para alterar o comportamento da aplicação sem precisar modificar o código.
  A URL base da API é definida através de uma variável de ambiente, acessada via helper:


```javascript
  return __ENV.BASE_URL || 'http://localhost:3000'; //arquivo getBaseUrl.js

```

No script de testes é importada e usada esta variável de ambiente:

```javascript
import { getBaseUrl } from './helpers/getBaseUrl.js';

`${getBaseUrl()}/sales`

```

#### **Stages**

  Stages são as etapas de carga do teste, quantos usuários e por quanto tempo. Exemplo: começa com poucos usuários, aumenta aos poucos, depois diminui.
  No script de teste, foram montados os seguintes stages:

```javascript
  stages: [
        { duration: '3s', target: 10 }, // Ramp up
        { duration: '15s', target: 10 }, // Average
        { duration: '2s', target: 100 }, // Spike
        { duration: '3s', target: 100 }, // Spike
        { duration: '5s', target: 10 }, // Average
        { duration: '5s', target: 0 }, // Ramp down
    ],
```    

#### **Reaproveitamento de Resposta**

Reaproveitamento de Resposta significa usar uma resposta de uma requisição em outra
No script de teste, a validação do ticket depende do ticket retornado no momento da compra, sendo reutilizado na etapa de verificação.

```javascript
const createdTicket = res.json();
const ticketId = createdTicket.id;
``` 


#### **Uso de token de Autenticação**

  É quando usa um código de segurança (token) para provar que o usuário está logado. Exemplo: O usuário
  faz o login, o sistema devolve o token e este token é enviado para as próximas requisições para liberar
  o acesso. Se o token não for retornado o acesso é bloqueado.
  No script de teste, para efetuar a compra do ticket e validação do ticket é necessário o token.

 ```javascript 
  export function setup() {
    const token = login();
    return { token: token };
  }
```

#### **Data-Driven Testing**

É quando o teste roda com vários dados diferentes, automaticamente. O mesmo teste é rodado várias vezes,
mudando somente os dados. Exemplo: Vários usuários, várias compras de tickets com quantidades diferentes.
No script de teste, foi usado para a compra dos tickets, usando a biblioteca ShareArray do K6.

```javascript 
const tickets = new SharedArray('tickets', function () {
    return JSON.parse(open('./data/ticket.test.data.json'));
```
E consome os dados no script:
```javascript 
const ticketData = tickets[(__VU - 1) % tickets.length];
```

#### **Groups**

Grupos são usados para organizar o script de teste em seções lógicas, representando diferentes ações do usuário.

*   **`Comprando ticket`**: Simula a compra de um ingresso.
*   **`Buscando tickets`**: Simula a busca por ingressos vendidos.

```javascript
// Exemplo de Groups no script

group('Comprando ticket', () => {
    // ... lógica da compra
});

group('Validando o ticket', () => {
    // ... lógica da busca
});
```

