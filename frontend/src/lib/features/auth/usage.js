import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>{/* form inputs and submit button */}</form>
  );
};

export default LoginForm;
