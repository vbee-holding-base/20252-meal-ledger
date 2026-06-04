export interface Participant {
  id: string;
  name: string;
  debt: number;
  initial: string;
  bg: string;
  text: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  icon: string;
  bg: string;
  text: string;
}

export interface Transaction {
  id: string;
  store: string;
  date: string;
  amount: number;
  icon: string;
}
