import { createSignal, Component, onCleanup, onMount } from 'solid-js';
import styles from './aktivasi.module.css';
import logo from './asset/logo.svg';
import showPasswordIcon from './asset/showPassword.svg';
import hidePasswordIcon from './asset/hidePassword.svg';
import close from './asset/close.svg';
import berhasil from './asset/berhasil.svg';
import emailWrong from './asset/emailWrong.svg';
import emailCorrect from './asset/emailCorrect.svg';

const Aktivasi: Component<{ onClose: () => void; onSwitch: () => void; }> = (props) => {
    const [showPassword, setShowPassword] = createSignal(false);
    const [currentContent, setCurrentContent] = createSignal(1);
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [question, setQuestion] = createSignal('');
    const [otp, setOtp] = createSignal('');
    const [emailError, setEmailError] = createSignal(false);
    const [passwordError, setPasswordError] = createSignal('');
    const [otpError, setOtpError] = createSignal(false);
    const [popupMessage, setPopupMessage] = createSignal('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const handleNext = async () => {
        if (currentContent() === 1) {
            if (!email() || !password() || !question()) {
                showPopupNotification("Lengkapi data terlebih dahulu!");
                return;
            }
            if (emailError() || passwordError()) {
                showPopupNotification("Email & password tidak valid!");
                return;
            }
    
            // Mengirim data aktivasi ke backend
            try {
                const response = await fetch('http://127.0.0.1:8080/users/aktivasi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email(),
                        password: password(),
                        question: question(),
                    }),
                });
    
                const result = await response.json();
                if (response.ok) {
                    showPopupNotification("Akun berhasil diaktivasi, OTP telah dikirim ke email anda.");
                    setCurrentContent(2); // Lanjutkan ke content2 untuk verifikasi OTP
                } else {
                    showPopupNotification(result || "Terjadi kesalahan saat aktivasi akun.");
                }
            } catch (error) {
                showPopupNotification("Gagal mengirim data ke server.");
            }
    
        } else if (currentContent() === 2) {
            if (!validateOtp(otp())) {
                return;
            }
    
            // Mengirim permintaan verifikasi OTP ke server
            try {
                const response = await fetch('http://127.0.0.1:8080/users/verifikasi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email(),
                        otp: otp(),
                    }),
                });
    
                const result = await response.json();
                if (response.ok) {
                    showPopupNotification("Verifikasi berhasil!");
                    setCurrentContent(3); // Lanjutkan ke content3
                } else {
                    showPopupNotification(result || "Kode OTP tidak sesuai.");
                }
            } catch (error) {
                showPopupNotification("Gagal memverifikasi OTP.");
            }
        }
    };

    const showPopupNotification = (message: string) => {
        setPopupMessage(message);
        setTimeout(() => setPopupMessage(''), 3000);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest(`.${styles.popup}`) && !(e.target as HTMLElement).closest(`.${styles.registerButton}`)) {
            props.onClose();
        }
    };

    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    const validateEmail = (email: string) => {
        const isValid = email.endsWith('@gmail.com') && !/[A-Z]/.test(email);
        setEmailError(!isValid);
        return isValid;
    };

    const validatePassword = (password: string) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < 8) {
            setPasswordError("*(panjang minimal 8 karakter)");
            return false;
        } else if (!hasLetter || !hasNumber || !hasSymbol) {
            setPasswordError("*(harus terdiri dari campuran huruf, angka, dan simbol)");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };

    const validateOtp = (otp: string) => {
        const isValid = /^\d{5}$/.test(otp); // Validasi 5 angka
        setOtpError(!isValid);
        return isValid;
    };

    const progressWidth = () => {
        return `${((currentContent() - 1) / 2) * 100}%`;
    };

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.value.length === 1) {
            const nextSibling = target.nextElementSibling as HTMLInputElement | null;
            if (nextSibling) {
                nextSibling.focus();
            }
        }
        setOtp((prevOtp) => {
            const index = Number(target.dataset.index);
            return prevOtp.substring(0, index) + target.value + prevOtp.substring(index + 1);
        });
    };

    return (
        <div class={styles.overlay}>
            <div class={styles.popup}>
                <div class={styles.progressBarContainer}>
                    <div class={styles.progressBar} style={{ width: progressWidth() }}></div>
                </div>
                <div class={styles.header}>
                    <img src={logo} alt="Logo" class={styles.logo} />
                    <img src={close} alt="Close" class={styles.closeIcon} onClick={props.onClose} />
                </div>
                <h2 class={styles.judul}>
                    {currentContent() === 1
                        ? 'Aktivasi Akun Anda'
                        : currentContent() === 2
                        ? 'Verifikasi Kode OTP'
                        : 'Aktivasi Berhasil'}
                </h2>
                <div class={styles.contentContainer}>
                    <div class={styles.content} style={{ transform: `translateX(-${(currentContent() - 1) * 100}%)` }}>
                        <form class={styles.content1}>
                            <div class={styles.inputGroup}>
                                <div class={styles.infoEmail}>
                                    <label class={styles.labelEmail}>Email</label>
                                    {emailError() && <span class={styles.errorText}>*(email tidak valid)</span>}
                                </div>
                                <div class={styles.emailContainer}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Masukkan email.."
                                        class={`${styles.inputEmail} ${emailError() ? styles.errorBorder : ''}`}
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            const lowercasedValue = target.value.toLowerCase(); // Ubah input menjadi huruf kecil
                                            setEmail(lowercasedValue); // Update state email dengan huruf kecil
                                            validateEmail(lowercasedValue); // Validasi email
                                        }}
                                    />
                                    {emailError() ? (
                                        <img src={emailWrong} alt="Email Salah" class={styles.emailIcon} />
                                    ) : email() && (
                                        <img src={emailCorrect} alt="Email Benar" class={styles.emailIcon} />
                                    )}
                                </div>
                            </div>
                            <div class={styles.inputGroup}>
                                <div class={styles.infoPassword}>
                                    <label class={styles.labelPassword}>Password baru</label>
                                    {passwordError() && <span class={styles.errorText}>{passwordError()}</span>}
                                </div>
                                <div class={styles.passwordGroup}>
                                    <input
                                        type={showPassword() ? "text" : "password"}
                                        name="password"
                                        placeholder="Masukkan password.."
                                        class={`${styles.inputPassword} ${passwordError() ? styles.errorBorder : ''}`}
                                        onInput={(e) => {
                                            setPassword(e.target.value);
                                            validatePassword(e.target.value);
                                        }}
                                    />
                                    <img
                                        src={showPassword() ? showPasswordIcon : hidePasswordIcon}
                                        alt="Toggle Password Visibility"
                                        onClick={togglePasswordVisibility}
                                        class={styles.passwordToggle}
                                    />
                                </div>
                            </div>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelQuestion}>Question (Key)</label>
                                <input
                                    type="text"
                                    name="question"
                                    placeholder="Masukkan kata/kode.."
                                    class={styles.inputQuestion}
                                    value={question()} // Gunakan nilai dari state question
                                    onInput={(e) => setQuestion(e.target.value)} // Perbarui state question
                                />
                            </div>
                        </form>
                        <form class={styles.content2}>
                            <p class={styles.infoVerifikasi}>Masukkan kode yang telah dikirimkan lewat email</p>
                            <div class={styles.otpInputContainer}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                        type="text"
                                        maxlength="1"
                                        data-index={index}
                                        class={styles.otpInput}
                                        value={otp().charAt(index)}
                                        onInput={handleInput}
                                    />
                                ))}
                            </div>
                            {otpError() && <span class={styles.errorText}>*(Kode OTP tidak valid)</span>}
                        </form>
                        <form class={styles.content3}>
                            <div class={styles.berhasil}>
                                <img src={berhasil} alt="Pendaftaran Berhasil" class={styles.ukurangambarBerhasil} />
                            </div>
                        </form>
                    </div>
                </div>
                <div class={styles.buttonContainer}>
                    {currentContent() < 3 && (
                        <button
                            class={styles.registerButton}
                            onClick={handleNext} // Panggil handleNext untuk semua content
                        >
                            {currentContent() === 1 ? 'Aktivasi Akun' : 'Verifikasi OTP'}
                        </button>
                    )}
                    {currentContent() === 3 && (
                        <button class={styles.registerButton} onClick={() => {
                            // Menutup pop-up dan membuka login saat berada di content3
                            props.onClose();
                            props.onSwitch();
                        }}>
                            Masuk
                        </button>
                    )}
                    {popupMessage() && (
                        <div class={styles.popupNotification}>
                            {popupMessage()}
                        </div>
                    )}
                </div>
                <p class={styles.sudahpunyaAkun}>
                    Sudah punya akun?{' '}
                    <label class={styles.masukKlik}>
                        <a onClick={props.onSwitch}>Masuk</a>
                    </label>
                </p>
            </div>
        </div>
    );
};

export default Aktivasi;
