const novaTransacao = document.querySelector('.modal-overlay');

//criar uma nova transacao
const Modal = {
    open(){
        novaTransacao.classList.toggle("active");
    },
    close(){
        novaTransacao.classList.toggle("active");
    }
}

//guardando dados no storage do navegador
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:Transactions")) || []
    },

    set(Transactions){
        localStorage.setItem("dev.finances:Transactions", JSON.stringify(Transactions))
    }
}

//calculo entradas, saidas e total
const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction);

        App.reload()
    },
    
    //removendo uma transacao
    remove(index){
        Transaction.all.splice(index,1)

        App.reload()
    },

    //somar as entradas
    incomes(){
        let income = 0;

        Transaction.all.forEach((transaction) =>{
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        })

        return income;
    },
    //somar as saidas
    expenses(){
        let expenses = 0;

        Transaction.all.forEach((transaction) =>{
            if(transaction.amount < 0){
                expenses += transaction.amount;
            }
        })

        return expenses;
    },
    //entradas - saidas
    total(){
        return this.incomes() + this.expenses();
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
                <td><img onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="remover transacao"></td>
            `
        return html;
    },

    //atualizar o balanco
    updateBalance(){
        //Entradas
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        
        //Saidas
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        //Total
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
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
        const splittedDate =  date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` 
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g , "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-br",{
            style:"currency",
            currency:"BRL"
        });

        return signal + value;
    }
} 

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector("input#amount"),
    date:   document.querySelector("input#date"),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    //verificando se todos os dados foram prenchidos 
    validateFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === ""|| amount.trim() === "" || date.trim() == ""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    submit(event){
        event.preventDefault()

        try{
            //verificar se todos os valores estao prencidos 
            Form.validateFields()

            const transaction = Form.formatValues()

            Transaction.add(transaction)

            Form.clearFields()

            Modal.close()

        }catch(error){
            alert(error.message)
        }
        

        Form.formatValues()
    }
}

const App = {
    init(){
        //inserindo elemetos criados na DOM na pagina
        Transaction.all.forEach((Transaction,index)=>{
            DOM.addTransaction(Transaction,index);
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload(){
        //server para nao inserir duas vezes
        DOM.clearTransactions()

        App.init()
    }
}

App.init()


