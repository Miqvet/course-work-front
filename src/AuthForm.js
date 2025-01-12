import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import AuthService from './services/AuthService';
import './AuthForm.css';

const AuthForm = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                await AuthService.login(formData.email, formData.password);
                navigate('/');
            } else {
                await AuthService.register(
                    formData.firstname,
                    formData.lastname,
                    formData.email,
                    formData.password
                );
                setIsLogin(true);
            }
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ firstname: '', lastname: '', password: '', email: '' });
        setError('');
    };

    return (
        <div className="auth-container">
            <Card style={{ width: '400px', borderRadius: '12px', textAlign: 'center' }}>
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                {error && <div className="error-message">{error}</div>}
                {!isLogin && (
                    <>
                        <div className="p-field">
                            <span className="p-float-label">
                                <InputText
                                    id="firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="firstname">Имя</label>
                            </span>
                        </div>
                        <div className="p-field">
                            <span className="p-float-label">
                                <InputText
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                                <label htmlFor="lastname">Фамилия</label>
                            </span>
                        </div>
                    </>
                )}
                <div className="p-field">
                    <span className="p-float-label">
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{ width: '100%' }}
                        />
                        <label htmlFor="email">Email</label>
                    </span>
                </div>
                <div className="p-field">
                    <span className="p-float-label">
                        <Password
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            toggleMask
                            feedback={false}
                            style={{ width: '100%' }}
                        />
                        <label htmlFor="password">Пароль</label>
                    </span>
                </div>
                <Button
                    label={isLogin ? 'Войти' : 'Зарегистрироваться'}
                    className="p-button-rounded p-button-primary"
                    onClick={handleSubmit}
                    style={{ width: '100%', marginTop: '1rem' }}
                />
                <Button
                    label={isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
                    className="p-button-text p-button-secondary"
                    onClick={toggleForm}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                />
            </Card>
        </div>
    );
};

export default AuthForm;

