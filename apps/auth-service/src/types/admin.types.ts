export interface CreateDoctorDTO {
  email: string;
  password: string;
  full_name: string;
  phone?: string;

  specialization: string;
  licence_no: string;
  consultation_fee: number;
}
