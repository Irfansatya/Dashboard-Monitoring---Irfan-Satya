import { createSignal, Component, onCleanup, onMount } from 'solid-js';
import styles from './lupapassword.module.css';
import logo from './asset/logo.svg';
import showPasswordIcon from './asset/showPassword.svg';
import hidePasswordIcon from './asset/hidePassword.svg';
import close from './asset/close.svg';
import emailWrong from './asset/emailWrong.svg';
import emailCorrect from './asset/emailCorrect.svg';

type LupaPasswordProps = {
    onClose: () => void;
    onSwitch: () => void;
};

const LupaPassword: Component<LupaPasswordProps> = ({ onClose, onSwitch }) => {
    const [showPassword, setShowPassword] = createSignal(false);
    const [currentContent, setCurrentContent] = createSignal(1);

    const [email, setEmail] = createSignal('');
    const [question, setQuestion] = createSignal('');
    const [newPassword, setNewPassword] = createSignal('');
    const [emailError, setEmailError] = createSignal(false);
    const [questionError, setQuestionError] = createSignal(false);
    const [passwordError, setPasswordError] = createSignal('');
    const [showPopupEmail, setShowPopupEmail] = createSignal(false);
    const [showPopupQuestion, setShowPopupQuestion] = createSignal(false);
    const [showPopupData, setShowPopupData] = createSignal(false);
    const [showPopupPassword, setShowPopupPassword] = createSignal(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const handleNext = async () => {
        if (currentContent() === 2) {
            if (newPassword().trim() === '') {
                setShowPopupData(true);
                setTimeout(() => setShowPopupData(false), 3000);
                return;
            }
            await resetPassword();
        } else {
            if (emailError() || questionError() || !validateEmail(email()) || !validateQuestion(question())) {
                if (emailError()) {
                    setShowPopupEmail(true);
                    setTimeout(() => setShowPopupEmail(false), 3000);
                } else if (questionError()) {
                    setShowPopupQuestion(true);
                    setTimeout(() => setShowPopupQuestion(false), 3000);
                } else {
                    setShowPopupData(true);
                    setTimeout(() => setShowPopupData(false), 3000);
                }
                return;
            }
            setCurrentContent((prev) => (prev < 2 ? prev + 1 : 2));
        }
    };

    const resetPassword = async () => {
        if (!validateEmail(email()) || !validateQuestion(question()) || !validatePassword(newPassword())) {
            return;
        }

        const resetRequest = {
            email: email(),
            question: question(),
            password: newPassword()
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/users/lupaPassword', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetRequest),
            });

            if (response.ok) {
                const message = await response.json();
                alert('Password berhasil direset!');
                onSwitch();  // Panggil onReset() di sini untuk mengarahkan ke popup login
            } else {
                const errorText = await response.text();
                alert('Gagal mereset password: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest(`.${styles.popup}`) && !(e.target as HTMLElement).closest(`.${styles.resetButton}`)) {
            onClose();
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
        if (password.length < 8) {
            setPasswordError('*(panjang minimal 8 karakter)');
            return false;
        } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+{}\[\]:;"'<>,.?~`]/.test(password)) {
            setPasswordError('*(terdapat campuran huruf, angka, dan simbol)');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const validateQuestion = (question: string) => {
        const isValid = question.trim().length > 0;
        setQuestionError(!isValid);
        return isValid;
    };

    const progressWidth = () => {
        return `${((currentContent() - 1) / 1) * 100}%`;
    };

    return (
        <div class={styles.overlay}>
            <div class={styles.popup}>
                <div class={styles.progressBarContainer}>
                    <div class={styles.progressBar} style={{ width: progressWidth() }}></div>
                </div>
                <div class={styles.header}>
                    <img src={logo} alt="Logo" class={styles.logo} />
                    <img src={close} alt="Close" class={styles.closeIcon} onClick={onClose} />
                </div>
                <h2 class={styles.judul}>
                    {currentContent() === 2 ? 'Reset Password Anda' : 'Reset Password Anda'}
                </h2>
                <div class={styles.contentContainer}>
                    <div class={styles.content} style={{ transform: `translateX(-${(currentContent() - 1) * 100}%)` }}>
                        <form class={styles.content1}>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelEmail}>Email</label>
                                {emailError() && <span class={styles.errorText}>*(email tidak valid)</span>}
                                <div class={styles.emailContainer}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Masukkan email.."
                                        class={`${styles.inputEmail} ${emailError() ? styles.errorBorder : ''}`}
                                        onInput={(e) => {
                                            setEmail(e.target.value);
                                            validateEmail(e.target.value);
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
                                <label class={styles.labelQuestion}>Question (Key)</label>
                                {questionError() && <span class={styles.errorText}>*(wajib diisi)</span>}
                                <input
                                    type="text"
                                    name="question"
                                    placeholder="Masukkan kata/kode.."
                                    class={`${styles.inputQuestion} ${questionError() ? styles.errorBorder : ''}`}
                                    onInput={(e) => {
                                        setQuestion(e.target.value);
                                        validateQuestion(e.target.value);
                                    }}
                                />
                                <p class={styles.informasi}>*Masukkan question sesuai yang diisi saat mendaftar akun.</p>
                            </div>
                        </form>
                        <form class={styles.content2}>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelPassword}>Password baru</label>
                                {passwordError() && <span class={styles.errorText}>{passwordError()}</span>}
                                <div class={styles.passwordGroup}>
                                    <input
                                        type={showPassword() ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="Masukkan password baru.."
                                        class={`${styles.inputPassword} ${passwordError() ? styles.errorBorder : ''}`}
                                        onInput={(e) => {
                                            setNewPassword(e.target.value);
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
                        </form>
                    </div>
                </div>
                <div class={styles.buttonContainer}>
                    {currentContent() < 2 && (
                        <button
                            class={styles.resetButton}
                            onClick={handleNext}
                        >
                            {currentContent() === 1 ? 'Berikutnya' : 'Reset Password'}
                        </button>
                    )}
                    {currentContent() === 2 && (
                        <button class={styles.resetButton} onClick={() => { 
                            resetPassword();  // Pastikan resetPassword dipanggil di sini jika belum selesai
                        }}>
                            Reset Password
                        </button>
                    )}
                    <p class={styles.sudahpunyaAkun}>
                        Sudah punya akun?{' '}
                        <label class={styles.masukKlik}>
                            <a onClick={onSwitch}>Masuk</a>
                        </label>
                    </p>
                </div>
            </div>
            {showPopupEmail() && (
                <div class={styles.popupNotification}>
                    Email tidak valid!
                </div>
            )}
            {showPopupQuestion() && (
                <div class={styles.popupNotification}>
                    Question wajib diisi!
                </div>
            )}
            {showPopupData() && (
                <div class={styles.popupNotification}>
                    Lengkapi data terlebih dahulu!
                </div>
            )}
            {showPopupPassword() && (
                <div class={styles.popupNotification}>
                    Password tidak valid!
                </div>
            )}
        </div>
    );
};

export default LupaPassword;