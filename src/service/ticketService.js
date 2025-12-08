
const { sales, tickets, users } = require('../model/database');

class TicketService {
    sellTicket(quantity, age, totalValue, userId) {

        // Regra: não vender para menores de 18 anos
        if (age < 18) {
            throw new Error('A venda de ingressos não é permitida para menores de 18 anos.');
        }

        // Regra: validar valor total
        if (totalValue < 100) {
            throw new Error('O valor total da venda não pode ser menor que 100.');
        }

        const sale = {
            id: sales.length + 1,
            quantity,
            totalValue,
            userId: userId
        };

        sales.push(sale);
        return sale;
    }

    getSales() {
        return sales;
    }

   getSaleById(id) {
    return sales.find(sale => sale.id === Number(id));
    }
}


module.exports = new TicketService();