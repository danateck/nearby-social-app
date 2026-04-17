import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-500">Login to Nearby Social</p>
        </div>
        <AuthForm
          mode="login"
          onSubmit={async ({ email, password }) => {
            await loginUser(email, password);
            navigate('/');
          }}
        />
        <p className="text-center text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-brand-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
