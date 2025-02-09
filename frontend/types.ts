export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
  }
  
  export interface Appointment {
    id: number;
    patient: number;
    date: string;
    status: string;
  }
  