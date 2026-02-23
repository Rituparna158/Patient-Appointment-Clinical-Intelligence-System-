interface CreateDoctorDTO {
  email: string;

  full_name: string;
  phone?: string | null;

  specialization: string;
  licence_no: string;
  consultation_fee: number;
  is_active?: boolean;
}
interface CreateAdminDTO {
  email: string;
  // password: string;
  full_name: string;
  phone?: string;
}
export { CreateDoctorDTO, CreateAdminDTO };
