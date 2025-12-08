const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ticketController = require('./controller/ticketController');
const authService = require('./service/authService');

const app = express();

// Middleware
app.use(bodyParser.json());

// Swagger Setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Venda de Ingressos - Exposição Sebastião Salgado',
            version: '1.0.0',
            description: 'API para venda de ingressos, com documentação Swagger.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/app.js', './src/controller/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da API

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação
 * /login:
 *   post:
 *     summary: Realiza o login para obter um token de autenticação
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        // --- DEBUGGING ---
        console.log('Valor retornado por authService.login:', token);
        // --- FIM DEBUGGING ---
        res.json(token);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

app.use('/', ticketController);

app.get('/', (req, res) => {
    res.send('API de Ingressos no ar! Acesse /api-docs para ver a documentação.');
});

module.exports = app;