import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  const fetchCompanies = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Запит з параметрами:', { filter, sort });

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
  }, [fetchCompanies]);

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

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Пошук..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Сортування</option>
          <option value="name">Назва</option>
          <option value="capital">Капітал</option>
          <button onClick={fetchCompanies}>Застосувати</button>
        </select>
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
              {company.capital}$
              <button onClick={() => handleDelete(company.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/companies/create">+ Додати компанію</Link>
    </div>
  );
}
