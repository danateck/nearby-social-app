import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-slate-500">Start using Nearby Social</p>
        </div>
        <AuthForm
          mode="register"
          onSubmit={async ({ email, password, displayName }) => {
            await registerUser(email, password, displayName ?? 'User');
            navigate('/');
          }}
        />
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
