import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from './login.module.css';
import logo from './asset/logo.svg';
import showPasswordIcon from './asset/showPassword.svg';
import hidePasswordIcon from './asset/hidePassword.svg';
import googleIcon from './asset/google.svg';
import close from './asset/close.svg';
import emailWrong from './asset/emailWrong.svg';
import emailCorrect from './asset/emailCorrect.svg';

interface LoginProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
    onSwitchToPassword: () => void;
}

const Login: Component<LoginProps> = ({ onClose, onSwitchToRegister, onSwitchToPassword }) => {
    const [showPassword, setShowPassword] = createSignal(false);
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [passwordError, setPasswordError] = createSignal('');
    const [emailError, setEmailError] = createSignal('');
    const [isEmailValid, setIsEmailValid] = createSignal(false);
    const [isPasswordValid, setIsPasswordValid] = createSignal(false);
    const [showPopup, setShowPopup] = createSignal(false);
    const [popupMessage, setPopupMessage] = createSignal("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const triggerPopup = (message) => {
      setPopupMessage(message);
      setShowPopup(true);
      setTimeout(() => {
          setShowPopup(false);
      }, 3000); // Popup muncul selama 3 detik
  };

    const validateEmail = (value: string) => {
        setEmail(value);
        if (!value.includes('@gmail.com')) {
            setEmailError('*(email tidak valid)');
            setIsEmailValid(false);
        } else {
            setEmailError('');
            setIsEmailValid(true);
        }
    };

    const validatePassword = (value: string) => {
      setPassword(value);
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (value.length < 8) {
          setPasswordError('*(panjang minimal 8 karakter)');
          setIsPasswordValid(false);
      } else if (!(hasLetter && hasNumber && hasSymbol)) {
          setPasswordError('*(harus terdiri dari campuran huruf, angka, dan simbol)');
          setIsPasswordValid(false);
      } else {
          setPasswordError('');
          setIsPasswordValid(true);
      }
  };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email() || !password()) {
            triggerPopup("Lengkapi data terlebih dahulu!");
            return;
        }
    
        if (emailError() && passwordError()) {
            triggerPopup("Email & password tidak valid!");
            return;
        }
    
        if (emailError()) {
            triggerPopup("Email tidak valid!");
            return;
        }
    
        if (passwordError()) {
            triggerPopup("Password tidak valid!");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/users/masuk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email(),
                    password: password(),
                }),
            });

            if (response.ok) {
                const token = await response.json();
                localStorage.setItem('token', token);
                navigate('/dashboard');
            } else {
              setPasswordError('*(password salah)');
              setIsPasswordValid(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div class={styles.overlay} onClick={onClose}>
            <div class={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div class={styles.header}>
                    <img src={logo} alt="Logo" class={styles.logo} />
                    <img src={close} alt="Close" class={styles.closeIcon} onClick={onClose} />
                </div>
                <h2 class={styles.judul}>Masukkan Akun Anda</h2>
                <form onSubmit={handleLogin}>
                    <div class={styles.inputGroup}>
                        <div class={styles.infoEmail}>
                          <label class={styles.labelEmail}>Email</label>
                          {emailError() && <span class={styles.errorText}>*(email tidak valid)</span>}
                        </div>
                        <div class={styles.emailContainer}>
                            <input 
                                type="email" 
                                placeholder="Masukkan email.." 
                                class={`${styles.inputEmail} ${emailError() ? styles.errorBorder : ''}`} 
                                value={email()}
                                onInput={(e) => validateEmail(e.target.value)}
                            />
                            {emailError() && (
                                <img src={emailWrong} alt="Email Salah" class={styles.emailIcon} />
                            )}
                            {isEmailValid() && !emailError() && (
                                <img src={emailCorrect} alt="Email Benar" class={styles.emailIcon} />
                            )}
                        </div>
                    </div>
                    <div class={styles.inputGroup}>
                        <div class={styles.passwordContainer}>
                        <div class={styles.infoPassword}>
                                    <label class={styles.labelPassword}>Password</label>
                                    {passwordError() && <span class={styles.errorText}>{passwordError()}</span>}
                                </div>
                        </div>
                        <div class={styles.passwordGroup}>
                            <input 
                                type={showPassword() ? "text" : "password"} 
                                placeholder="Masukkan password.." 
                                class={`${styles.inputPassword} ${passwordError() ? styles.errorBorder : ''}`}
                                value={password()}
                                onInput={(e) => validatePassword(e.target.value)}
                            />
                            <img 
                                src={showPassword() ? showPasswordIcon : hidePasswordIcon} 
                                alt="Toggle Password Visibility" 
                                onClick={togglePasswordVisibility} 
                                class={styles.passwordToggle} 
                            />
                        </div>
                    </div>
                    <div class={styles.actions}>
                        <label class={styles.checkbox}>
                            <input type="checkbox"/>
                        </label>
                        <p class={styles.rememberMe}>Remember me</p>
                        <a href="#" class={styles.lupaPassword} onClick={onSwitchToPassword}>Lupa Password?</a>
                    </div>
                    <button type="submit" class={styles.loginButton}>Masuk</button>
                    <button type="button" class={styles.googleButton}>
                        <img src={googleIcon} alt="Google" />
                        Lanjutkan dengan Google
                    </button>
                    {showPopup() && (
                        <div class={styles.popupNotification}>
                            {popupMessage()}
                        </div>
                    )}
                </form>
                <p class={styles.privacyText}>
                    Dengan melanjutkan, anda menyetujui <a href="#">Kebijakan Privasi</a> dan <br /><a href="#">Syarat & Ketentuan</a> yang berlaku di layanan ini.
                </p>
                <p class={styles.belumpunyaAkun}>
                    Belum punya akun?{' '}
                    <label class={styles.daftarKlik}>
                    <a onClick={onSwitchToRegister}>Daftar</a>
                    </label>
                </p>
            </div>
        </div>
    );
};

export default Login;
