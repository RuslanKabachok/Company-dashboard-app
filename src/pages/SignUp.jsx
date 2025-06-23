import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import css from './SignUp.module.css';

export default function SignUp() {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Імʼя обовʼязкове'),
    email: Yup.string()
      .email('Невірний формат email')
      .required('Email обовʼязковий'),
    password: Yup.string()
      .min(6, 'Пароль має містити мінімум 6 символів')
      .required('Пароль обовʼязковий'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Паролі не співпадають')
      .required('Підтвердження паролю обовʼязкове'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('http://localhost:5050/api/auth/signup', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role || 'user',
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/companies');
      } else {
        alert('Реєстрація успішна!');
        navigate('/companies');
      }
    } catch (error) {
      console.error('❌ Помилка при реєстрації:', error);
      alert('Не вдалося зареєструватися. Можливо, email вже існує.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.container}>
      <h2>Реєстрація</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <label>
              Імʼя:
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className={css.error} />
            </label>

            <label>
              Email:
              <Field type="email" name="email" />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </label>

            <label>
              Пароль:
              <Field type="password" name="password" />
              <ErrorMessage
                name="password"
                component="div"
                className={css.error}
              />
            </label>

            <label>
              Підтвердження паролю:
              <Field type="password" name="confirmPassword" />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={css.error}
              />
            </label>

            <label>
              Role:
              <Field as="select" name="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>{' '}
                {/* 👈 тільки для демонстрації */}
              </Field>
            </label>

            <button type="submit" disabled={isSubmitting}>
              Зареєструватися
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
