import { tap } from 'rxjs/operators';

export const logValue = <T>() => tap<T>((val) => console.log('[LOG]:', val));
