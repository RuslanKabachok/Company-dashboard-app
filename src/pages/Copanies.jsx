import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserRole } from '../utils/auth';
import css from './Companies.module.css';

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

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchCompanies = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}api/companies`, {
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
      await axios.delete(`${API}api/companies/${id}`, {
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

  return (
    <div className={css.container}>
      {(getUserRole() === 'admin' || getUserRole() === 'superadmin') && (
        <Link to="/admin" className={css.adminLink}>
          Перейти до адмінки
        </Link>
      )}

      <div className={css.controls}>
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
              <div style={{ marginTop: '8px' }}>
                <Link
                  to={`/companies/${company.id}/edit`}
                  className={css.linkButton}
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => handleDelete(company.id)}
                  className={css.deleteBtn}
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/companies/create" className={css.linkButton}>
        + Додати компанію
      </Link>
    </div>
  );
}
