import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import css from './ResetPassword.module.css';

const validationSchema = Yup.object({
  password: Yup.string().min(6, 'Мінімум 6 символів').required('Обовʼязково'),
});

const API = import.meta.env.VITE_API_BASE;

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${API}api/auth/reset-password/${token}`, {
        password: values.password,
      });

      alert('Пароль успішно змінено');
      navigate('/signin');
    } catch (err) {
      console.error(err);
      alert('Недійсний або прострочений токен');
    }
  };

  return (
    <div className={css.container}>
      <h2>Новий пароль</h2>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <label htmlFor="password">Новий пароль:</label>
          <Field type="password" name="password" id="password" />
          <ErrorMessage name="password" component="div" className={css.error} />
          <button type="submit">Змінити пароль</button>
        </Form>
      </Formik>
    </div>
  );
}
