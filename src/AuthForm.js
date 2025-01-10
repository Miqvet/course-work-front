import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './AuthForm.css';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true); // Переключатель между авторизацией и регистрацией
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        password: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (isLogin) {
            console.log('Logging in with:', { email: formData.email, password: formData.password });
        } else {
            console.log('Registering with:', formData);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ firstname: '', lastname: '', password: '', email: '' }); // Сбрасываем данные
    };

    return (
        <div className="auth-container">
            <Card style={{ width: '400px', borderRadius: '12px', textAlign: 'center' }}>
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
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

