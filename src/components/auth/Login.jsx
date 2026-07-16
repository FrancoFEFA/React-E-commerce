/*
 * Componente Login: formulario de inicio de sesión y registro
 * Alterna entre modo login y modo registro
 * Consume UserContext para ejecutar login o register
 * Tras éxito redirige al inicio
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/useUser';

const Login = () => {
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useUser();
  const navigate = useNavigate();

  /*
   * Maneja el submit del formulario
   * Ejecuta login o register según el modo activo
   * Redirige al inicio en caso de éxito, muestra error si falla
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setErrorMsg(
        isRegister
          ? 'No se pudo registrar. Verificá los datos.'
          : 'Email o contraseña incorrectos.'
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Título según modo */}
        <h2 className="login-title">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>

        {/* Mensaje de error si lo hay */}
        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo nombre: solo en modo registro */}
          {isRegister && (
            <div className="login-field">
              <label className="login-label">Nombre</label>
              <input
                type="text"
                className="login-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Tu nombre"
              />
            </div>
          )}

          {/* Campo email */}
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@email.com"
            />
          </div>

          {/* Campo password */}
          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {/* Botón de submit */}
          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting
              ? 'Procesando...'
              : isRegister
                ? 'Registrarme'
                : 'Ingresar'}
          </button>
        </form>

        {/* Toggle entre login y registro */}
        <p className="login-toggle">
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button
            type="button"
            className="login-toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg(null);
            }}
          >
            {isRegister ? 'Iniciar sesión' : 'Registrarme'}
          </button>
        </p>

        {/* Link para volver al inicio */}
        <Link to="/" className="login-back-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Login;