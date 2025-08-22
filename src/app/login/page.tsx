'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { useAppDispatch } from '@/hooks/useRedux';
import { login, setUserProfile } from '@/store/slices/authSlice';
import { getUserProfile, loginUser } from '@/services/auth';

import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import InputGroup from '@/components/ui/InputGroup';

import { loginSchema, LoginFormData } from '@/schemas/loginSchema';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const logoutSuccess = localStorage.getItem('logoutSuccess');
    const logoutError = localStorage.getItem('logoutError');
    // console.log(logoutSuccess,'logoutSuccess');
    if (logoutSuccess) {
      toast.success(logoutSuccess);
      setTimeout(() => {
        localStorage.removeItem('logoutSuccess');
      }, 100);
    }
    if (logoutError) {
      toast.error(logoutError);
      setTimeout(() => {
        localStorage.removeItem('logoutError');
      }, 100);
    }

    const remembered = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('username') || '';

    if (remembered && savedUsername) {
      setRememberMe(true);
      setValue('username', savedUsername);
    }
  }, [setValue]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      // console.log();
      dispatch(login({token: data.accessToken}));

      // fetch profile and store in Redux
      const user = await getUserProfile();
      dispatch(setUserProfile(user));
      Promise.resolve().then(() => router.push('/'));
      // router.push('/');
    },
    onError: (error: AxiosError<{ message?: string; error?: string }>) => {
      // console.log('login error', error)
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Login failed';
      toast.error(message);
    }
  });

  const onSubmit = (data: LoginFormData) => {
    // console.log('login form data', data);
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', data.username);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
    }

    mutation.mutate(data);
  };

  return (
    <div className="login-box">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-logo text-center">
        <Image
          src="/logo-icon.png"
          alt="Arcgate"
          className="brand-image img-circle elevation-1"
          width={60}
          height={60}
        />
        <Heading level={4} className="mt-4 mb-4 text-muted">
          COMPLIANCE MONITORING
        </Heading>
      </div>

      <Card>
        <CardBody className="login-card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputGroup
                type="text"
                placeholder="Email/Username"
                {...register('username')}
                iconClass="fas fa-envelope"
                groupClassName="mb-3"
                error={errors.username && errors.username.message}
            />

            <InputGroup
                type="password"
                placeholder="Password"
                iconClass="fas fa-lock"
                groupClassName="mb-3"
                error={errors.password && errors.password.message}
                {...register('password')}
            />

            <div className="row">
              <div className="col-8">
                <div className="icheck-primary">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">&nbsp;Remember Me</label>
                </div>
              </div>
              <div className="col-4">
                <Button type="submit" className="btn btn-primary btn-block d-flex align-items-center justify-content-center gap-2" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <i className="fas fa-spinner fa-spin text-primary mr-2" />
                  )}
                  {mutation.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          </form>

          {/* <p className="mb-1">
            <a href="#">I forgot my password</a>
          </p> */}
        </CardBody>
      </Card>
    </div>
  );
}