import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    // Додаємо тільки якщо значення існує
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
    <form onSubmit={handleSubmit}>
      <label>
        Назва компанії:
        <input name="name" value={formData.name} onChange={handleChange} />
      </label>

      <label>
        Сфера діяльності:
        <input
          name="service"
          value={formData.service}
          onChange={handleChange}
        />
      </label>

      <label>
        Капітал:
        <input
          name="capital"
          value={formData.capital}
          onChange={handleChange}
        />
      </label>

      <label>
        Логотип:
        <input type="file" name="logo" onChange={handleChange} />
      </label>

      <button type="submit">Оновити компанію</button>
    </form>
  );
}
