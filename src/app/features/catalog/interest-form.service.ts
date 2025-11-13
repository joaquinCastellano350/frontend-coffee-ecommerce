import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../core/http/base-http.service';
import { InterestForm, CreateInterestFormDTO } from '../../shared/models/form.model';

@Injectable({ providedIn: 'root' })
export class InterestFormService extends BaseHttpService {
  createInterestForm(data: CreateInterestFormDTO) {
    return this.http.post<InterestForm>(`/api/forms`, data);
  }

  getAllForms() {
    return this.http.get<InterestForm[]>('/api/forms', { withCredentials: true });
  }
}
