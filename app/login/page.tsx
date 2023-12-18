import { AuthForm } from '@/components/auth-form';

export default function Login() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2 space-y-8">
      <AuthForm />
    </div>
  );
}
