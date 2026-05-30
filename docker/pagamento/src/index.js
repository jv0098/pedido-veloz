
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8082;
const PEDIDOS_SERVICE_URL = process.env.PEDIDOS_SERVICE_URL || 'http://pedidos-service:8081';

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

const JWT_SECRET = getSecret('JWT_SECRET', 'fallback_jwt_key_abc');

console.log(`[Pagamento] Inicializando serviço. Endpoint de Pedidos: ${PEDIDOS_SERVICE_URL}`);
console.log(`[Pagamento] Segredo JWT carregado: ${JWT_SECRET !== 'fallback_jwt_key_abc' ? 'SIM' : 'NÃO (USANDO FALLBACK)'}`);

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // 1. ENDPOINTS DE RESILIÊNCIA
    if (req.url === '/healthz' || req.url === '/api/pagamento/healthz') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "UP", gateway: "online" }));
    } 
    else if (req.url === '/ready' || req.url === '/api/pagamento/ready') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "READY", api: "available" }));
    }
    // 2. ROTA DE NEGÓCIO: RETORNO DE PAGAMENTOS (GET /api/pagamento)
    else if (req.url === '/api/pagamento' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            gateway: "PagarMe/Stripe Mock",
            transacoes: [
                { id: "trx-0091", pedido_uuid: "ped-9821-xda", valor: 6500.00, status: "APROVADO", data: new Date() }
            ]
        }));
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not Found", message: "Rota não reconhecida pelo microsserviço de Pagamento" }));
    }
});

server.listen(PORT, () => {
    console.log(`[Pagamento-Service] Ativo e escutando na porta ${PORT}`);
});
