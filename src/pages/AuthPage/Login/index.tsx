import { useRequest } from 'ahooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginFormValues, loginSchema } from '@/lib/validators/auth';

import { Text } from '@/components/ui/text';
import { Form } from '@/components/ui/form';
import { InputPassword, InputText } from '@/components/Common/FormFields';
import { Button } from '@/components/ui/button';

import { loginService } from '@/services/auth';
import { toast } from 'sonner';
import { useAuth } from '@/stores/auth/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LoginPage = () => {
  const { onLogin } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  const { handleSubmit, watch, control } = form;

  const { run: handleLogin, loading } = useRequest(loginService, {
    manual: true,
    onSuccess: (data) => {
      onLogin(data);
    },
    onError: () => {
      toast.error('Đăng nhập thất bại');
    },
  });

  function onSubmit(values: LoginFormValues) {
    handleLogin(values);
  }

  return (
    <Card className='w-full max-w-[400px] rounded-md space-y-6'>
      <CardHeader>
        <Text type='heading3-bold' className='text-primary text-center'>
          Đăng nhập
        </Text>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
            <InputText<LoginFormValues>
              control={control}
              name='emailOrPhone'
              label='Email SĐT'
              placeholder='Nhập email hoặc số điện thoại'
            />
            <InputPassword<LoginFormValues>
              control={control}
              name='password'
              label='Mật khẩu'
              placeholder='Nhập mật khẩu'
              disablePasswordEye={watch('password').length === 0}
            />

            <Button type='submit' className='w-full mt-6' disabled={loading} loading={loading}>
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
