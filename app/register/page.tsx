"use client";

import { useState } from "react";
import { RegisterForm } from "../../components/auth/register-form";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, role: 'NUTRITIONIST' }),
      });

      if (response.ok) {
        // Registration successful, redirect to login or dashboard
        router.push('/login/nutritionist'); // Or appropriate success page
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData.error);
        // Display error message to user
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Display generic error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-5 relative overflow-hidden"
      style={{ backgroundImage: 'url(/assets/Background 2.png)' }}>
      {/* Floating particles - can be moved to a separate component if reused */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-float"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
