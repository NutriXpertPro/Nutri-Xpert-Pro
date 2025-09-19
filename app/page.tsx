"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('nxp-theme', 'dark');
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid #06b6d4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Container principal */}
      <div style={{
        textAlign: 'center',
        maxWidth: '90vw',
        width: '100%',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Logo com efeito 3D */}
        <div style={{
          marginBottom: '40px',
          perspective: '1000px'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(30px)',
            borderRadius: '36px',
            padding: '50px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            transform: 'rotateX(5deg) rotateY(2deg)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            e.currentTarget.style.transform = `rotateX(${5 - y * 10}deg) rotateY(${2 + x * 10}deg)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotateX(5deg) rotateY(2deg)';
          }}>
            <img
              src="/assets/nutri.png"
              alt="Nutri Xpert Pro"
              style={{
                width: '80%',
                maxWidth: '300px',
                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Título com efeito holográfico */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 48px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            lineHeight: '1.2',
            textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
          }}>
            Nutri Xpert Pro
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: '#d1d5db',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5'
          }}>
            Sistema Profissional de Gestão Nutricional com Inteligência Artificial
          </p>
        </div>

        {/* Botões com efeito de levitação */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          marginTop: '30px'
        }}>
          <button
            onClick={() => router.push("/login/nutritionist")}
            style={{
              padding: '18px 40px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #7c3aed)',
              color: 'white',
              fontWeight: '700',
              fontSize: 'clamp(16px, 3vw, 18px)',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: '0 15px 35px rgba(59, 130, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '360px',
              transform: 'translateY(0)',
              animation: 'float 3s ease-in-out infinite'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.3)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Sou Nutricionista</span>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.5s ease'
            }}></div>
          </button>

          <button
            onClick={() => router.push("/login/patient")}
            style={{
              padding: '18px 40px',
              background: 'linear-gradient(135deg, #10b981, #059669, #84cc16)',
              color: 'white',
              fontWeight: '700',
              fontSize: 'clamp(16px, 3vw, 18px)',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '360px',
              transform: 'translateY(0)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(16, 185, 129, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Sou Paciente</span>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.5s ease'
            }}></div>
          </button>
        </div>

        {/* Status com efeito de pulsação */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            Sistema Ativo
          </div>
          <span>•</span>
          <span>IA Nutricional</span>
          <span>•</span>
          <span>Seguro & Privado</span>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
