import { useEffect, useState } from 'react';
import { getUserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(null);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const r = getUserRole();
    setRole(r);

    console.log('🔍 Перевірка ролі у AdminPage:', r);

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

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:5050/api/user/role/${userId}`,
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
      await axios.delete(`http://localhost:5050/api/user/${userId}`, {
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
      await axios.delete(`http://localhost:5050/api/companies/${companyId}`, {
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
    <div>
      <h2>🔐 Admin Panel</h2>

      <h3>👥 Користувачі:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email} — <strong>{u.role}</strong>
            {role === 'superadmin' && (
              <>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  style={{ marginLeft: '10px' }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  style={{ marginLeft: '10px' }}
                >
                  🗑 Видалити
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>🏢 Компанії:</h3>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} — {c.service} — {c.capital?.toLocaleString('uk-UA')} ₴
            {role === 'superadmin' && (
              <button
                onClick={() => handleDeleteCompany(c.id)}
                style={{ marginLeft: '10px' }}
              >
                🗑 Видалити
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
