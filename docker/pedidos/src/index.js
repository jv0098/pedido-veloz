

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8081;
const DB_HOST = process.env.DB_HOST || 'localhost';

// Função auxiliar para carregar segredos montados no filesystem (12-Factor Security)
function getSecret(envKey, defaultVal = '') {
    const fileVar = process.env[envKey + '_FILE'];
    if (fileVar && fs.existsSync(fileVar)) {
        try {
            return fs.readFileSync(fileVar, 'utf8').trim();
        } catch (err) {
            console.error(`Erro ao ler secret em ${fileVar}:`, err.message);
        }
    }
    return process.env[envKey] || defaultVal;
}

// Carregando segredos
const DB_PASSWORD = getSecret('DB_PASSWORD', 'fallback_pwd_123');
const JWT_SECRET = getSecret('JWT_SECRET', 'fallback_jwt_key_abc');

console.log(`[Pedidos] Inicializando serviço. Banco de Dados: ${DB_HOST}.`);
console.log(`[Pedidos] Status do Segredo DB_PASSWORD: ${DB_PASSWORD !== 'fallback_pwd_123' ? 'CARREGADO VIA SECRET' : 'EM FALTA'}`);

// Servidor HTTP Nativo (Zero dependências externas para build ultra-rápido)
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // 1. ENDPOINT DE LIVENESS PROBE (Para detecção de travas do processo)
    if (req.url === '/healthz' || req.url === '/api/pedidos/healthz') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            status: "UP",
            checks: { database: "connected" }
        }));
    } 
    // 2. ENDPOINT DE READINESS PROBE (Garante que está pronto para receber tráfego)
    else if (req.url === '/ready' || req.url === '/api/pedidos/ready') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            status: "READY",
            uptime: process.uptime()
        }));
    }
    // 3. ROTA DE NEGÓCIO: RETORNO DE PEDIDOS (GET /api/pedidos)
    else if (req.url === '/api/pedidos' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify([
            { id: 1, uuid: "ped-9821-xda", produto: "Notebook Gamer", qtd: 1, total: 6500.00, status: "PAGO" },
            { id: 2, uuid: "ped-4312-kls", produto: "Teclado Mecânico", qtd: 2, total: 900.00, status: "CRIADO" }
        ]));
    }
    // ROTA DEFAULT (404)
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: "Not Found",
            message: "Rota não reconhecida pelo microsserviço de Pedidos"
        }));
    }
});

server.listen(PORT, () => {
    console.log(`[Pedidos-Service] Ativo e escutando na porta ${PORT}`);
});
