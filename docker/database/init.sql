
CREATE USER app_pedidos WITH PASSWORD 'SenhaSuperSeguraPedidosEstoque123!';
CREATE USER app_estoque WITH PASSWORD 'SenhaSuperSeguraPedidosEstoque123!';

-- 2. TABELA DE ESTOQUE (Microsserviço de Estoque)
CREATE TABLE IF NOT EXISTS estoque (
    id SERIAL PRIMARY KEY,
    produto_uuid VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade >= 0),
    preco NUMERIC(10, 2) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissões para o microsserviço de Estoque
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE estoque TO app_estoque;
GRANT USAGE, SELECT ON SEQUENCE estoque_id_seq TO app_estoque;

-- 3. TABELA DE PEDIDOS (Microsserviço de Pedidos)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    pedido_uuid VARCHAR(255) UNIQUE NOT NULL,
    produto_uuid VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CRIADO', -- CRIADO, PAGO, CANCELADO
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissões para o microsserviço de Pedidos
GRANT SELECT, INSERT, UPDATE ON TABLE pedidos TO app_pedidos;
GRANT USAGE, SELECT ON SEQUENCE pedidos_id_seq TO app_pedidos;

-- 4. DADOS INICIAIS DE TESTE (Seed)
INSERT INTO estoque (produto_uuid, nome, quantidade, preco) VALUES
('prod-uuid-111-aaa', 'Notebook Gamer Premium', 15, 6500.00),
('prod-uuid-222-bbb', 'Mouse Sem Fio Ergonômico', 100, 250.00),
('prod-uuid-332-ccc', 'Teclado Mecânico RGB', 45, 450.00)
ON CONFLICT (produto_uuid) DO NOTHING;
