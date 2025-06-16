import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditCompany() {
  const { id } = useParams();
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

        const { name, service, capital } = res.data.company;
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
    data.append('name', formData.name);
    data.append('service', formData.service);
    data.append('capital', formData.capital);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }

    try {
      await axios.put(`http://localhost:5050/api/companies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Компанію оновлено');
    } catch (error) {
      console.error('Помилка при оновленні компанії:', error);
      alert('Не вдалося оновити компанію');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="service" value={formData.service} onChange={handleChange} />
      <input name="capital" value={formData.capital} onChange={handleChange} />
      <input type="file" name="logo" onChange={handleChange} />
      <button type="submit">Оновити компанію</button>
    </form>
  );
}
