import { useEffect, useState } from 'react';
import { getUserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();
    if (role !== 'admin') {
      navigate('/companies');
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, companiesRes] = await Promise.all([
        axios.get('http://localhost:5050/api/user', { headers }),
        axios.get('http://localhost:5050/api/companies/all', { headers }),
      ]);

      setUsers(usersRes.data.users || []);
      setCompanies(companiesRes.data.companies || []);
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h2>🔐 Admin Panel</h2>

      <h3>👥 Користувачі:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email} — {u.role}
          </li>
        ))}
      </ul>

      <h3>🏢 Компанії:</h3>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} — {c.service} — {c.capital}$
          </li>
        ))}
      </ul>
    </div>
  );
}
