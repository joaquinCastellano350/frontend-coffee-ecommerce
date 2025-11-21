export interface UserResponseDTO {
  _id: string;
  email: string;
  role: 'admin' | 'user';
}
