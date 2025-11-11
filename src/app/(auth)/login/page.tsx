import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="mb-10 text-5xl font-bold text-[#064E3B]">
                    Welcome to SmartEye.
                </h1>
                <LoginForm />
            </div>
        </div>
    );
}