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
### 1. Sobre a relação entre Seller e Operation
Em relação a adição de sellers, catálogos, items a catálogos, adição de operators a 
pool de algum seller e criação de assingments tenho uma dúvida. Quando eu quero relacionar 
um seller a uma operation, relação esta que é criada quando eu crio um operationSeller 
dentro da operation, as relações desse seller já existem ou devem ser criadas após ele já 
estar relacionado a uma operation? Por exemplo, tenho um operator A que está relacionado 
a um seller B. Este seller B ainda não está relacionado a operation C. Caso eu queira 
criar a relação entre operation C e seller B, devo passar o operator A para OperationSeller 
que foi criada com id do seller B? Ou então, essa relação entre seller B e operator A só é 
criada dentro da operation, isto é, um seller pode estar em diferentes operations e ter 
pools de operators diferentes para cada operation?