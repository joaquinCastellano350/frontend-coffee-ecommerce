export interface InterestForm {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  interestedProduct?: { _id: string; name: string };
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterestFormDTO {
  name: string;
  email: string;
  phone?: string;
  interestedProduct?: string;
  message?: string;
}
