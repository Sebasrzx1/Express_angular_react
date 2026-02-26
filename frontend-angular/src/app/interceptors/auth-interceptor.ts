import { HttpInterceptorFn } from '@angular/common/http';
/**
 * Interceptor de Autenticación
 * Agrega automaticamente el token JWT a todas las peticiones HTTP
 * (Excepto login y resgiter)
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {
//Obtener el token del localStorage
const token = localStorage.getItem('token');

//Debug: Verificar si hay token y la URL
console.log('[Auth Interceptor] URL:', req.url);
console.log('[Auth Interceptor] Token existe:', !!token)

//Si la peticion es a login/register, no modificar
if(req.url.includes('/login')|| req.url.includes('/register')){
  console.log('[Auth Interceptor] No hay token en localStorage');
  return next(req)
}

//Si no hay token, continuar sin él (puede ser ruta pública)
if(!token){
  console.log('[Auth Interceptor] No hay token en localStorage')
  return next(req)
}

//clonar la peticion y agregar el header Authorization
const clonedRequest = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`
  }
});

console.log('[Auth Interceptor] Token agregado al header')

return next(clonedRequest);
};
