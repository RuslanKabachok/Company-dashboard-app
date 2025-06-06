import { useEffect } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
// import axios from "axios";
import css from './SignIn.module.css';

export default function SignIn() {

    useEffect(() => {
        // Тут будемо виконувати HTTP-запит
    }, []);

    const initialValues = {
    email: "",
    password: ""
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Невірний формат email')
    .required('Email обовʼязковий'),

  password: Yup.string()
    .min(6, 'Пароль має містити мінімум 6 символів')
    .required('Пароль обовʼязковий'),
});

    

    return (
        <div className={css.container}>
            <h2>Sign In Page</h2>
            <Formik initialValues={initialValues} onSubmit={(values) => {console.log(values) }} validationSchema={validationSchema}>
                <Form className={css.form}>
                <label >E-mail: <Field type="email" name="email" required /></label>
                <label >Password: <Field type="password" name="password" required minLength='6' /></label>

                <button type="submit">Login</button>
                </Form>
            </Formik>
            
        </div>
    );
}
