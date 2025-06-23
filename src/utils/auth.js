import jwtDecode from 'jwt-decode';

export function getUserRole() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded.role || null;
    } catch (err) {
        console.error('Помилка при декодуванні токена:', err);
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
