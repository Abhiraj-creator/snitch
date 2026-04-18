import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hook/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useNavigate } from 'react-router';

const Register = () => {
    const navigate= useNavigate();
  const { HandleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    contact:'',
    isSeller:false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    HandleRegister(formData);
    navigate("/");
  };

  return (
    <AuthLayout
      title="Initialize."
      subtitle="Create your premium account profile."
      bottomText="ALREADY A MEMBER?"
      bottomLinkText="LOGIN"
      bottomLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="w-full">
        {error && (
          <div className="mb-6 border border-[#111]/20 p-3 text-[10px] tracking-widest text-[#111] bg-[#111]/5 flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <AuthInput
            label="Full Name"
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="JOHN DOE"
            required
          />
          
          <AuthInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="USER@SNITCH.COM"
            required
          />
          
          <AuthInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <AuthInput
            label="Contact Number"
            type="tel"
            name="contact"
            value={formData.contact || ''}
            onChange={handleChange}
            placeholder="+1 (000) 000-0000"
            required
          />
        </div>

        <div className="flex items-center mb-6 mt-2 font-mono">
          <input
            type="checkbox"
            id="isSeller"
            name="isSeller"
            checked={formData.isSeller || false}
            onChange={(e) => setFormData({ ...formData, isSeller: e.target.checked })}
            className="w-[14px] h-[14px] text-[#111] border-[#111]/20 focus:ring-[#111] appearance-none border checked:bg-[#111] checked:border-transparent mr-3 relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[4px] after:top-[1px] after:w-1 after:h-2 after:border-r-[1.5px] after:border-b-[1.5px] after:border-white after:rotate-45 transition-colors cursor-pointer"
          />
          <label htmlFor="isSeller" className="uppercase text-[10px] tracking-[0.1em] text-[#111]/70 cursor-pointer hover:text-[#111] transition-colors">
            Register as a Seller
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <AuthButton type="submit" disabled={loading} variant="primary">
            {loading ? 'Processing...' : 'Register'}
          </AuthButton>
          <AuthButton type='button' disabled={loading} onClick={() => window.location.href = '/api/auth/google'} variant="secondary">
            <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;