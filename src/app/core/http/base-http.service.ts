import {inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export abstract class BaseHttpService {
    protected http = inject(HttpClient);
    protected baseUrl: string = environment.apiUrl;
}