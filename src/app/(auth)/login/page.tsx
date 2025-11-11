import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h2 className=" mb-8 text-4xl font-bold text-[#064E3B] ">Wellcome to SmartEye.</h2>
                <LoginForm />
            </div>
        </div>
    );
}