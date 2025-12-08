

import http from 'k6/http';
import { sleep, group, check } from 'k6';

export const options = {
  vus: 10,
  iterations: 10,
  //duration: '10s',
   thresholds: {
      'http_req_duration': ['p(90)<=2000'],
      'http_req_failed': ['rate<0.01']
    }
};

export default function () {
 let responseLogin = '';

  group('Fazendo o login', () => {
    responseLogin = http.post(
      'http://localhost:3000/login',
      JSON.stringify({
            username: "admin",
            password: "password123"
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    check(responseLogin, {
      "Login: status deve ser igual a 200": (r) => r.status === 200
    });
  });

   group('Comprando ticket', () => {
    let responseTicket = http.post(
      'http://localhost:3000/sales',
      JSON.stringify({
        quantity: 1,
        age: 25,
        totalValue: 150
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseLogin.json('token')}`
        }
      }
    );

       check(responseTicket, {
      "Comprando Ticket: status deve ser igual a 201": (r) => r.status === 201
     }); 
    });

 group('Buscando os tickets vendidos', () => {
    let responseGetTicket = http.get(
      'http://localhost:3000/sales',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseLogin.json('token')}`
        }
      }
    );

       check(responseGetTicket, {
      "Buscando Tickets: status deve ser igual a 200 para buscar os tickets vendidos": (r) => r.status === 200
     }); 
    });    

  group('Simulando o Think Time', () => {
    sleep(1); // User Think Time
  });
}


