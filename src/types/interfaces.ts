export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
}
