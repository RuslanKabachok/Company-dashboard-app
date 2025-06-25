import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import css from './EditCompany.module.css';

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    service: '',
    capital: '',
    logo: null,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5050/api/companies/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const { name, service, capital } = res.data;
        setFormData((prev) => ({
          ...prev,
          name,
          service,
          capital,
        }));
      } catch (error) {
        console.error('Помилка при отриманні компанії:', error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const data = new FormData();

    if (formData.name) data.append('name', formData.name);
    if (formData.service) data.append('service', formData.service);
    if (formData.capital) data.append('capital', formData.capital);
    if (formData.logo) data.append('logo', formData.logo);

    try {
      await axios.put(`http://localhost:5050/api/companies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Компанію оновлено');
      navigate('/companies');
    } catch (error) {
      console.error('Помилка при оновленні компанії:', error);
      alert('Не вдалося оновити компанію');
    }
  };

  return (
    <div className={css.container}>
      <h2>Редагувати компанію</h2>
      <form className={css.form} onSubmit={handleSubmit}>
        <label>
          Назва компанії:
          <input
            className={css.input}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Сфера діяльності:
          <input
            className={css.input}
            name="service"
            value={formData.service}
            onChange={handleChange}
          />
        </label>

        <label>
          Капітал:
          <input
            className={css.input}
            type="number"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
          />
        </label>

        <label>
          Логотип:
          <input
            className={css.input}
            type="file"
            name="logo"
            onChange={handleChange}
          />
        </label>

        <button className={css.button} type="submit">
          Оновити компанію
        </button>
      </form>
    </div>
  );
}
