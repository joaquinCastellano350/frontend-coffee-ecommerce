import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export abstract class BaseHttpService {
  protected http = inject(HttpClient);
  protected baseUrl = '/api';
}
