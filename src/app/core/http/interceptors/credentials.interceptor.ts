import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const isApi = req.url.startsWith(environment.apiUrl);
  return next(isApi ? req.clone({ withCredentials: true }) : req);
};
