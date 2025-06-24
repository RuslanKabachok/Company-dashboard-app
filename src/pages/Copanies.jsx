import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserRole } from '../utils/auth';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchCompanies = useCallback(async () => {
    console.log('Запит з параметрами:', { filter, sort });

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter,
          sort,
        },
      });

      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Помилка при завантаженні компаній:', err);
      setError('Не вдалося завантажити компанії');
    }
  }, [filter, sort]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies, filter, sort]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Ти впевнений, що хочеш видалити компанію?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (error) {
      console.error('Помилка при видаленні компанії:', error);
      alert('Не вдалося видалити компанію');
    }
  };

  console.log('👤 Роль користувача:', getUserRole());

  return (
    <div>
      {(getUserRole() === 'admin' || getUserRole() === 'superadmin') && (
        <Link to="/admin">Перейти до адмінки</Link>
      )}

      <div>
        <input
          type="text"
          placeholder="Пошук..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            console.log('🟡 Обране сортування:', e.target.value);
          }}
        >
          <option value="">Сортування</option>
          <option value="name">Назва</option>
          <option value="capital">Капітал</option>
        </select>
        <button onClick={fetchCompanies}>Застосувати</button>
      </div>

      <h2>Список компаній</h2>
      {error && <p>{error}</p>}
      {companies.length === 0 ? (
        <p>Немає жодної компанії</p>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <strong>{company.name}</strong> — {company.service} —{' '}
              {company.capital?.toLocaleString('uk-UA')} ₴
              {company.logo && (
                <div>
                  <img
                    src={`http://localhost:5050/${company.logo}`}
                    alt="Логотип компанії"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      marginRight: '10px',
                    }}
                  />
                </div>
              )}
              <Link to={`/companies/${company.id}/edit`}>
                <button style={{ marginLeft: '10px' }}>Редагувати</button>
              </Link>
              <button onClick={() => handleDelete(company.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/companies/create">+ Додати компанію</Link>
    </div>
  );
}
