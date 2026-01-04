# Tap Domain Driven Design

## Sobre o Projeto
O **Tap Domain Driven Design** é a implementação da modelagem de um sistema robusto para gerenciamento de eventos. Este projeto foi concebido como um estudo aprofundado sobre **Domain-Driven Design (DDD)**, focando na modelagem orientada às regras de negócio.

A arquitetura segue os princípios de **Clean Code** e **CQRS**, visando desacoplamento, escalabilidade e manutenibilidade do código. O objetivo principal é demonstrar como traduzir processos de negócios em um software bem estruturado.

## Tech Stack

- **Linguagem:** TypeScript
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **API Interface:** GraphQL

## Modelagem do Domínio

O domínio da aplicação foi estrategicamente dividido em quatro agregados principais, cada um responsável por um contexto delimitado das regras de negócio:

- **Operation:** Representa o evento em si. É a entidade central onde ocorre a operação de vendas e onde um ou mais vendedores são alocados para trabalhar durante o período do evento.
- **Seller:** Responsável pela gestão da força de venda e do inventário. Este agregado gerencia os funcionários e os catálogos de produtos que estarão disponíveis para comercialização em um evento específico.
- **Ticket:** Atua como uma "comanda" ou ficha pré-paga. Contém os dados transitórios da transação antes da concretização, incluindo itens selecionados, valores totais e o tipo de catálogo aplicado.
- **Sale:** Representa a efetivação comercial. Após o pagamento e processamento do *Ticket*, os dados são transformados em uma *Sale*, tornando-se um registro utilizado para contabilidade e análises mercadológicas futuras.

## Estrutura e Arquitetura

O sistema adota uma arquitetura em camadas para garantir a separação de responsabilidades, dividida em quatro níveis lógicos:

### 1. Domain
O núcleo da aplicação. Aqui residem os **Agregados**, **Entidades** e **Objetos de Valor**, concentrando todas as regras de negócio e a lógica comportamental do sistema.

### 2. Application
Camada de orquestração que serve como ponte entre o domínio e o mundo externo. Construída sobre o padrão **CQRS**, ela é separada em:
- **Commands:** Responsáveis por operações de escrita e mudança de estado.
- **Queries:** Responsáveis exclusivamente pela leitura e recuperação de dados, otimizadas para performance.

### 3. Infrastructure
Esta camada abriga os **Repositórios**, adaptadores de serviços externos e as configurações de persistência de dados, utilizando o **Prisma ORM** e as configurações do **NestJS**.

### 4. API 
A camada de fronteira e comunicação com o cliente. Foi implementada utilizando **GraphQL**, com resolvers, types e modules.
