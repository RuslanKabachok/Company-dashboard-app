import { jwtDecode } from 'jwt-decode';

export function getUserRole() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded.role;
    } catch {
        return null;
    }
};