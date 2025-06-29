import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './ResetPassword.module.css';
import axios from 'axios';
import { useState } from 'react';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Невірний формат email')
    .required('Email обовʼязковий'),
});

const API = import.meta.env.VITE_API_BASE;

export default function ResetPassword() {
  const initialValues = { email: '' };
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setSuccess('');
    setError('');
    try {
      const res = await axios.post(`${API}api/auth/reset-password`, {
        email: values.email,
      });

      setSuccess(res.data.message);
    } catch (err) {
      console.error('❌ Помилка:', err);
      setError(
        err.response?.data?.message ||
          'Не вдалося надіслати лист для скидання паролю',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.container}>
      <h2>🔐 Скидання паролю</h2>
      <p>Введіть email, і ми надішлемо вам лист для скидання паролю</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <label htmlFor="email">Email:</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" component="div" className={css.error} />

            <button type="submit" disabled={isSubmitting}>
              Надіслати лист
            </button>
            {success && <p className={css.success}>{success}</p>}
            {error && <p className={css.error}>{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
