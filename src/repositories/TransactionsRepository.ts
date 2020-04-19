import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface AllTransactions {
  transactions: Transaction[];
  balance: Balance;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): AllTransactions {
    const balance = this.getBalance();
    const allTransactions: AllTransactions = {
      transactions: this.transactions,
      balance,
    };
    return allTransactions;
  }

  public getBalance(): Balance {
    // se não tem transactions retorna balance zerado
    let totalIncome = 0;
    let totalOutcome = 0;
    let totalTotal = 0;
    let balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalTotal,
    };

    if (this.transactions.length === 0) return balance;

    // se tem mais transations
    const incomeArray: number[] = [0, 0, 0];
    const outcomeArray: number[] = [0, 0, 0];
    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeArray.push(transaction.value);
      } else {
        outcomeArray.push(transaction.value);
      }
    });

    const reducer = (accumulator: number, currentValue: number): number => {
      return accumulator + currentValue;
    };

    // if (this.transactions.length > 0) {
    totalIncome = incomeArray.reduce(reducer);
    totalOutcome = outcomeArray.reduce(reducer);
    totalTotal = totalIncome - totalOutcome;
    // } else {
    //   const onlyIncome = incomeArray[0];
    //   totalIncome = onlyIncome;
    //   const onlyOutcome = outcomeArray[0];
    //   totalOutcome = onlyOutcome;
    //   totalTotal = totalIncome - totalOutcome;
    // }
    balance = { income: totalIncome, outcome: totalOutcome, total: totalTotal };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const { total } = this.getBalance();
    if (type === 'outcome' && total < value) {
      throw Error('Insuficent Income');
    }
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
