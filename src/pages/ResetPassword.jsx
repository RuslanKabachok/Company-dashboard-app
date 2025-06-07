import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './ResetPassword.module.css';


const validationSchema = Yup.object({
email: Yup.string()
    .email('Невірний формат email')
    .required('Email обовʼязковий'),
});

export default function ResetPassword() {
    const initialValues = { email: '' };

    const handleSubmit = (values) => {
        console.log('Submitting email:', values.email);
      // Тут буде запит на сервер, коли він зʼявиться
    };
    

    return (
        <div className={css.container}>
            <h2>Reset Password</h2>
            <p>Enter your email and we’ll send you a link to reset your password</p>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className={css.form}>
                    <label htmlFor="email">Email:</label>
                    <Field type="email" name="email" id="email" />
                    <ErrorMessage name="email" component="div" className={css.error} />

                    <button type="submit">Send</button>
            </Form>
            </Formik>
        </div>
    )
}