const novaTransacao = document.querySelector('.modal-overlay')

//criar uma nova transacao
const Modal = {
    open(){
        novaTransacao.classList.toggle("active");
    },
    close(){
        novaTransacao.classList.toggle("active");
    }
}


//criando elemento DOM na pagina com as Transações
const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    //inserindo uma nova transacao na parte de Transações
    addTransaction(Transaction, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(Transaction, index);
        tr.dataset.index = index;

        DOM.transactionContainer.appendChild(tr);
    },

    //criando uma nova transacao na parte de Transações
    innerHTMLTransaction(Transaction,index){
        const CSSclass =  Transaction.amount > 0 ? "income" : "expense";

        const formatAmount = Utils.formatCurrency(Transaction.amount);

        const html =  `
                <td class="description">${Transaction.description}</td>
                <td class="${CSSclass}">${formatAmount}</td>
                <td class="date">${Transaction.date}</td>
                <td>
                <form>
                    <button class="delete" onclick="DOM.delete(${Transaction.id})">
                        <img src="../public/assets/minus.svg" alt="remover transacao">
                    </button>
                </form>
                </td>
            `
        return html;
    },

    delete(id){
        
        fetch(`http://localhost:8080/index/${id}`,{method:'DELETE'})
                    .then(response => { return response.json()})

    },

    //atualizar o balanco
    updateBalance(Transaction){
        //Entradas
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes);
        
        //Saidas
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses);

        //Total
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total);
    },

    //limpando transacoes
    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }

}

//fomatando as moedas
const Utils = {

    formatAmount(value){
        value = Number(value) * 100

        return value
    },
    
    formatDate(date){
        const splittedDate =  date.split("-"," ")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` 
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g , "");

        value = Number(value) / 1;

        value = value.toLocaleString("pt-br",{
            style:"currency",
            currency:"BRL"
        });

        return signal + value;
    }
} 

const App = {
    init(){
        
            //inserindo elementos criados na DOM
            const consulta =  () =>{
                const options = {
                    method:'GET',
                    mode:"cors",
                    cache: 'default'
                    
                }
                
                fetch('http://localhost:8080/api-transaction',options)
                    .then(response => { return response.json()})
                    .then( data => {
                        data.forEach((trasaction)=>{
                            DOM.addTransaction(trasaction)  
                        }) 
                })

                fetch("http://localhost:8080/api-balance",options)
                    .then(response => { return response.json()})
                    .then( data => {
                        data.forEach((balance)=>{ 
                            DOM.updateBalance(balance) 
                        }) 
                })

                
            }

            consulta()

            DOM.updateBalance()
     
    },
    reload(){
        //server para nao inserir duas vezes
        DOM.clearTransactions()

        App.init()
    }
}

App.init()

