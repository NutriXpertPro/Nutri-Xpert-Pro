"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NutritionistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      alert("Email ou senha inválidos");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Partículas flutuantes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Card de login com efeito 3D */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '420px',
        perspective: '1000px'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(30px)',
          borderRadius: '28px',
          padding: '45px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 35px 70px rgba(0,0,0,0.4)',
          transform: 'rotateX(5deg)',
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          e.currentTarget.style.transform = `rotateX(${5 - y * 5}deg)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateX(5deg)';
        }}>
          {/* Título com gradiente holográfico */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            marginBottom: '35px',
            background: 'linear-gradient(135deg, #ffffff, #06b6d4, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
          }}>
            Área do Nutricionista
          </h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Email Profissional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #06b6d4';
                  e.target.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.2)';
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Senha Segura
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '16px',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #06b6d4';
                  e.target.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.2)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px 20px',
                background: 'linear-gradient(135deg, #06b6d4, #1e40af, #7c3aed)',
                color: 'white',
                fontWeight: '700',
                fontSize: '18px',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 15px 35px rgba(6, 182, 212, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)',
                animation: 'float 3s ease-in-out infinite'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(6, 182, 212, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(6, 182, 212, 0.3)';
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Entrando...
                </div>
              ) : 'Entrar com Email e Senha'}
            </button>
          </form>

          {/* Link esqueci senha */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <a
              href="/forgot-password"
              style={{
                color: '#06b6d4',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffffff'}
              onMouseOut={(e) => e.target.style.color = '#06b6d4'}
            >
              Esqueci minha senha
            </a>
          </div>

          {/* Divisor com efeito */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '30px 0',
            position: 'relative'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'gradientMove 2s linear infinite'
            }}></div>
            <span style={{
              padding: '0 20px',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '600',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px'
            }}>
              ou continue com
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'gradientMove 2s linear infinite',
              animationDelay: '1s'
            }}></div>
          </div>

          {/* Botão Google com efeito */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: '#ea4335',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              boxShadow: '0 10px 25px rgba(234, 67, 53, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '1s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(234, 67, 53, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(234, 67, 53, 0.3)';
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.78 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.24-.73-.38-1.5-.38-2.31 0-.81.14-1.58.38-2.31H2.18V7.07c-3.25 1.56-5.46 4.78-5.46 8.56s2.21 6.99 5.46 8.56v-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.47 2.09 14.4 1 12 1c-2.4 0-5.47 1.09-7.24 2.86l3.15 3.15c1.15-1.08 2.59-1.64 4.21-1.64z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
