import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
// import axios from "axios";
import css from './SignUp.module.css';

export default function SignUp() {
    useEffect(() => { }, []);
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    

    const handleSubmit = (values) => {
        console.log('Submitted values:', values);

    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Невірний формат email').required('Email обовʼязковий'),
        password: Yup.string().min(6, 'Пароль має містити мінімум 6 символів').required('Пароль обовʼязковий'),
    });

    return (
        <div className={css.container}>
            <h2>Sign Up Page</h2>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} validate={(values) => {
    const errors = {};
                if (values.password !== values.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
    }
                return errors;
            }}>
                <Form className={css.form}>
                    <label >Name: <Field type="text" name="name" required /></label>
                    <label >E-mail: <Field type="email" name="email" required /></label>
                    <label >Password: <Field type="password" name="password" required minLength='6' /></label>
                    <label > Confirm password: <Field type="password" name="confirmPassword" required minLength='6' />
                        <ErrorMessage name="confirmPassword" component="div" className={css.error} />
                    </label>
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </div>
    );
}
