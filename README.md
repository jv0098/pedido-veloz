# Entrega Contínua de uma Plataforma de Pedidos em Microsserviços: Do Docker Compose ao Kubernetes com Observabilidade e CI/CD

Este repositório contém a arquitetura de modernização DevOps completa para a plataforma **Loja Veloz**. O objetivo do projeto é migrar uma aplicação distribuída de microsserviços do cenário atual legado para um ecossistema de produção elástico, resiliente, seguro e altamente rastreável.


## 📽️ Vídeo Pitch (Até 4 minutos)

O vídeo pitch consolidado resume a arquitetura, demonstra o MVP funcionando e detalha as decisões técnicas tomadas para conteinerização, Kubernetes, pipeline CI/CD, deploy e observabilidade.

*   **Link de Acesso ao Vídeo no YouTube:** `[]`


## 📁 Estrutura de Diretórios Organizacional

Seguindo as melhores práticas de governança de TI para repositórios Git monorepo, a hierarquia do projeto está estruturada da seguinte forma:

```text
devops-aula/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Pipeline completa de CI/CD (GitHub Actions)
├── .secrets/                     # Segredos locais mockados (Docker Secrets)
│   ├── db_password.txt
│   ├── jwt_secret.txt
│   └── postgres_root_password.txt
├── docker/
│   ├── api-gateway/
│   │   └── nginx.conf            # Configuração do API Gateway (Nginx Reverse Proxy)
│   ├── database/
│   │   └── init.sql              # Scripts SQL de DDL, dados sementes (seed) e privilégios
│   ├── estoque/
│   │   ├── Dockerfile            # Dockerfile multi-stage e seguro (USER non-root)
│   │   ├── package.json
│   │   └── src/index.js          # Microsserviço de Estoque Node.js nativo (probes + secrets)
│   ├── pagamento/
│   │   ├── Dockerfile            # Dockerfile multi-stage e seguro (USER non-root)
│   │   ├── package.json
│   │   └── src/index.js
│   └── pedidos/
│       ├── Dockerfile            # Dockerfile multi-stage e seguro (USER non-root)
│       ├── package.json
│       └── src/index.js          # Microsserviço de Pedidos Node.js nativo (probes + secrets)
├── k8s/
│   └── base/
│       ├── configmap.yaml        # Configurações globais não confidenciais
│       ├── hpa.yaml              # Escalabilidade horizontal automática (CPU/Memória)
│       ├── pedidos-deployment.yaml # deployment com probes, limites de recursos e non-root
│       ├── pedidos-service.yaml  # ClusterIP Service interno
│       └── secrets.yaml          # Segredos Base64 injetados por variáveis de ambiente
├── terraform/                    # Esqueleto de Infraestrutura como Código (IaC)
│   ├── main.tf                   # Declaração elástica da AWS (VPC, EKS Cluster, Node Group)
│   ├── outputs.tf                # Outputs públicos para conexão kubeconfig
│   ├── providers.tf              # Parametrizações de provedores do Terraform
│   └── variables.tf              # Variáveis de entrada parametrizadas
├── docker-compose.yml            # Orquestração local segura para o ambiente de desenvolvimento
├── RELATORIO_PRATICO.md          # Documentação prática detalhada + Script do Pitch
├── RELATORIO_TEORICO.md          # Fundamentação acadêmica de engenharia DevOps
└── README.md                     # Manual de Onboarding e Execução do Repositório (Este arquivo)
```

---

## 🛠️ Executando o Ambiente Local (Docker Compose)

Garantindo a **Paridade de Ambientes (Factor X do 12-Factor App)**, o ambiente completo de desenvolvimento local sobe com **um único comando**, utilizando redes bridge isoladas, volumes persistentes para dados e injeção física de arquivos confidenciais.

### Pré-requisitos
Certifique-se de ter instalado no seu computador:
*   [Docker](https://www.docker.com/products/docker-desktop/) (v20.10 ou superior)
*   [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 ou superior)

### Passo 1: Clonar e Acessar o Diretório
Abra o seu terminal na pasta do projeto:
```bash
cd c:\Users\JoãoPereira\Downloads\devops-aula
```

### Passo 2: Inicializar os Microsserviços
Execute o comando abaixo. Ele construirá as imagens Docker locais a partir dos Dockerfiles multi-stage de forma otimizada e levantará a infraestrutura em segundo plano (*detached mode*):
```bash
docker compose up -d --build
```

### Passo 3: Verificar o Status dos Contêineres
Garanta que todos os contêineres estão rodando corretamente e que o banco de dados PostgreSQL passou no teste de integridade (*healthy*):
```bash
docker compose ps
```

### Passo 4: Validar os Endpoints de Saúde e de Negócio
A API Gateway (porta `80` padrão do host) gerencia as chamadas e encaminha para os respectivos microsserviços. Você pode testar abrindo no seu navegador:

*   **API Gateway Health:** [http://localhost/healthz](http://localhost/healthz)
*   **Liveness Probe (Pedidos):** [http://localhost/api/pedidos/healthz](http://localhost/api/pedidos/healthz)
*   **Readiness Probe (Estoque):** [http://localhost/api/estoque/ready](http://localhost/api/estoque/ready)
*   **Listar Pedidos:** [http://localhost/api/pedidos](http://localhost/api/pedidos)
*   **Listar Estoque (Integrado ao Banco de Dados):** [http://localhost/api/estoque](http://localhost/api/estoque)
*   **Processar Pagamento:** [http://localhost/api/pagamento](http://localhost/api/pagamento)

### Passo 5: Parar e Limpar o Ambiente
Para suspender os serviços mantendo a integridade dos volumes e do banco de dados local:
```bash
docker compose down
```
Se desejar fazer um *reset* total limpando os dados persistidos:
```bash
docker compose down -v
```

---

## 🔍 Fonte de Pesquisa (Case de Referência)

A modernização arquitetural implementada no projeto da Loja Veloz baseou-se em práticas adotadas mundialmente por gigantes do varejo digital e tecnologia, com destaque para a **Adidas**:

*   **Case Adidas (CNCF):** A equipe de engenharia da Adidas migrou toda a infraestrutura baseada em VMs fragmentadas e deploys isolados manuais para clusters Kubernetes escalados de forma elástica, utilizando liveness/readiness probes para garantir deploys sem downtime e Prometheus com OpenTelemetry para telemetria de microsserviços distribuídos.
*   **Referência:** [CNCF Case Study - Adidas](https://www.cncf.io/case-studies/adidas/)
