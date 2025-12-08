import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { login } from './helpers/login.js';
import { Faker } from "k6/x/faker"
import { SharedArray } from 'k6/data';

export let options = {
    thresholds: {
        'http_req_duration': ['p(95)<5000'], // 95% das requests devem ser < 5s
        'checks{group:::Comprando ticket}': ['rate>0.99'], // Mais de 99% dos checks devem passar
        'checks{group:::Validando ticket}': ['rate>0.99'], // Mais de 99% dos checks devem passar
    },
    stages: [
        { duration: '3s', target: 10 }, // Ramp up
        { duration: '15s', target: 10 }, // Average
        { duration: '2s', target: 100 }, // Spike
        { duration: '3s', target: 100 }, // Spike
        { duration: '5s', target: 10 }, // Average
        { duration: '5s', target: 0 }, // Ramp down
    ],
};

const ticketsTrend = new Trend('tickets_duration');

const tickets = new SharedArray('tickets', function () {
    return JSON.parse(open('./data/ticket.test.data.json'));
})

export function setup() {
    const token = login();
    console.log(token)
    return { token: token };
    
}

export default function (data) {
  let res,headers,payload;
  const faker = new Faker(11)

    group('Comprando ticket', () => {
        const ticketData = tickets[(__VU - 1) % tickets.length];
        const age = 
        console.log('Testando o faker', faker.numbers.intRange(18, 99))
        payload = {
            quantity: ticketData.quantity,
            age: ticketData.age,
            totalValue: ticketData.totalValue
        }

        headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            }
        };

        res = http.post(
            `${getBaseUrl()}/sales`,
            JSON.stringify(payload),
            headers
        );

        check(res, { 'Compra de ticket: status deve ser igual a 201': (r) => r.status === 201 });
        ticketsTrend.add(res.timings.duration); // Adicionando a duração à métrica de tendência

        sleep(1);
    });
  
      group('Validando ticket', () => {
        if (res) {
            const createdTicket = res.json();
            if (createdTicket && createdTicket.id) {
                const ticketId = createdTicket.id;
                const getRes = http.get(`${getBaseUrl()}/sales/${ticketId}`, headers);

                check(getRes, { 'Busca de ticket: status deve ser 200': (r) => r.status === 200 });
                ticketsTrend.add(getRes.timings.duration);
            }
        }

        sleep(1);
    });
}