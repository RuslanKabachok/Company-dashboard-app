import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import css from './CreateCompany.module.css';

export default function CreateCompany() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    capital: '',
    logo: null,
  });

  const API = import.meta.env.VITE_API_BASE;

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

    data.append('name', formData.name);
    data.append('service', formData.service);
    data.append('capital', formData.capital);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }

    try {
      await axios.post(`${API}api/companies`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Компанію створено');
      navigate('/companies');
    } catch (error) {
      console.error('Помилка при створенні компанії:', error);
      alert('Не вдалося створити компанію');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <h2>Додати компанію</h2>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="service"
        placeholder="Сфера"
        value={formData.service}
        onChange={handleChange}
      />
      <input
        type="number"
        name="capital"
        placeholder="Капітал"
        value={formData.capital}
        onChange={handleChange}
      />
      <input type="file" name="logo" onChange={handleChange} />
      <button type="submit">Створити</button>
    </form>
  );
}
