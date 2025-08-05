# Dúvidas registradas 
Decidi registrar minhas dúvidas, e possíveis respostas que obti, para futura revisão

## Fase 1
### 1. A diferença entre agregado e entidade. 
Meu conceito: A entidade é uma estrutura que tem por identificação um id, ou seja,
caso seja modificado algum valor dessa entidade, ela permanece a mesma. Exemplo:
Um "User" pode mudar de username, em um sistema que permita isso, mas ele continua
sendo o mesmo usuário, identificado por um id. No caso do agregado, é um conjunto de 
entidades que interagem entre si para resolver um problema do domínio. Este agregado
é representado por uma entidade principal (AggregateRoot), sendo ela a definidora do 
problema a ser resolvido. Exemplo: em um ecommerce, o setor de vendas poderia ter como
AggregateRoot a entidade de Order, a qual detém as informações e regras de negócio 
para vendas.

### 2. Sobre sale
Em relação a sale, indicada no agregado Operation em registerSale, esta  deveria ser 
uma entidade ou um agregado separado? Como essa interação deve acontecer? Pensando em 
um sistema real, essas vendas poderiam ser utilizadas no setor financeiro para análise, 
então este registro deve estar mesmo dentro de Operation? Ou este domínio deveria 
comunicar com outro para a criação da sale em outro lugar?
 
## Fase 2
