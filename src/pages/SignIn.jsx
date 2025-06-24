import { NavLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import css from './SignUp.module.css';

export default function SignIn() {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Невірний формат email')
      .required('Email обовʼязковий'),
    password: Yup.string()
      .min(6, 'Пароль має містити мінімум 6 символів')
      .required('Пароль обовʼязковий'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem('token', res.data.token);

      navigate('/companies');
    } catch (error) {
      console.error('Помилка при логіні', error);
      setErrors({ password: 'Невірна пошта або пароль' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.container}>
      <h2>Sign In Page</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <label className={css.label}>
              E-mail:
              <Field type="email" name="email" />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </label>

            <label className={css.label}>
              Password:
              <Field type="password" name="password" />
              <ErrorMessage
                name="password"
                component="div"
                className={css.error}
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>

      <NavLink to="/reset-password">Forgot password?</NavLink>
    </div>
  );
}
