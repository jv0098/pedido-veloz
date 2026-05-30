

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8083;
const DB_HOST = process.env.DB_HOST || 'localhost';

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

const DB_PASSWORD = getSecret('DB_PASSWORD', 'fallback_pwd_123');

console.log(`[Estoque] Inicializando serviço. Banco de Dados: ${DB_HOST}`);
console.log(`[Estoque] Segredo DB_PASSWORD carregado: ${DB_PASSWORD !== 'fallback_pwd_123' ? 'SIM' : 'NÃO (USANDO FALLBACK)'}`);

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // 1. ENDPOINTS DE RESILIÊNCIA
    if (req.url === '/healthz' || req.url === '/api/estoque/healthz') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "UP", database: "connected" }));
    } 
    else if (req.url === '/ready' || req.url === '/api/estoque/ready') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "READY", cache: "synced" }));
    }
    // 2. ROTA DE NEGÓCIO: RETORNO DE ITENS DE ESTOQUE (GET /api/estoque)
    else if (req.url === '/api/estoque' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify([
            { id: 1, produto_uuid: "prod-uuid-111-aaa", nome: "Notebook Gamer Premium", quantidade: 15, preco: 6500.00 },
            { id: 2, produto_uuid: "prod-uuid-222-bbb", nome: "Mouse Sem Fio Ergonômico", quantidade: 100, preco: 250.00 },
            { id: 3, produto_uuid: "prod-uuid-332-ccc", nome: "Teclado Mecânico RGB", quantidade: 45, preco: 450.00 }
        ]));
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not Found", message: "Rota não reconhecida pelo microsserviço de Estoque" }));
    }
});

server.listen(PORT, () => {
    console.log(`[Estoque-Service] Ativo e escutando na porta ${PORT}`);
});
