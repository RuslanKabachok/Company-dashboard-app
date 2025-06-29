import { useEffect, useState } from 'react';
import { getUserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import css from './AdminPage.module.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(null);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const r = getUserRole();
    setRole(r);

    if (r !== 'admin' && r !== 'superadmin') {
      navigate('/companies');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, companiesRes] = await Promise.all([
          axios.get('http://localhost:5050/api/user/all', { headers }),
          axios.get('http://localhost:5050/api/user/companies', { headers }),
        ]);

        setUsers(usersRes.data.users || []);
        setCompanies(companiesRes.data.companies || []);
      } catch (error) {
        console.error('❌ Помилка при завантаженні:', error);
      }
    };

    fetchData();
  }, []);

  const API = import.meta.env.VITE_API_BASE;

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API}api/user/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: res.data.user?.role || newRole } : u,
        ),
      );
    } catch (error) {
      console.error('❌ Помилка при зміні ролі:', error);
      alert('Не вдалося змінити роль');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити користувача?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API}api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('❌ Помилка при видаленні користувача:', error);
      alert('Не вдалося видалити користувача');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити компанію?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API}api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } catch (error) {
      console.error('❌ Помилка при видаленні компанії:', error);
      alert('Не вдалося видалити компанію');
    }
  };

  if (!role) return <p>⏳ Завантаження...</p>;

  return (
    <div className={css.container}>
      <h2 className={css.heading}>🔐 Admin Panel</h2>

      <section className={css.section}>
        <h3>👥 Користувачі:</h3>
        <ul className={css.list}>
          {users.map((u) => (
            <li key={u.id} className={css.item}>
              <span>
                {u.email} — <strong>{u.role}</strong>
              </span>
              {role === 'superadmin' && (
                <div className={css.controls}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className={css.select}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className={css.deleteBtn}
                  >
                    🗑 Видалити
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={css.section}>
        <h3>🏢 Компанії:</h3>
        <ul className={css.list}>
          {companies.map((c) => (
            <li key={c.id} className={css.item}>
              <span>
                {c.name} — {c.service} — {c.capital?.toLocaleString('uk-UA')} ₴
              </span>
              {role === 'superadmin' && (
                <button
                  onClick={() => handleDeleteCompany(c.id)}
                  className={css.deleteBtn}
                >
                  🗑 Видалити
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
