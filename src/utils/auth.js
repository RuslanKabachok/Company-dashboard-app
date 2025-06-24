import { jwtDecode } from 'jwt-decode';

export function getUserRole() {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
    } catch (e) {
        console.error('❌ Не вдалося декодувати токен', e);
        return null;
    }
}


export function getUserInfo() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        return jwtDecode(token);
    } catch (err) {
        console.log(err)
        return null;
    }
}
