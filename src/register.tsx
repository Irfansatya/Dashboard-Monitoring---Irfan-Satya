import { createSignal, Component, onCleanup, onMount } from 'solid-js';
import styles from './register.module.css';
import logo from './asset/logo.svg';
import showPasswordIcon from './asset/showPassword.svg';
import hidePasswordIcon from './asset/hidePassword.svg';
import close from './asset/close.svg';
import gambar1 from './asset/pelajar.svg';
import gambar1Hover from './asset/pelajarHover.svg';
import gambar2 from './asset/pekerja.svg';
import gambar2Hover from './asset/pekerjaHover.svg';
import berhasil from './asset/berhasil.svg';
import emailWrong from './asset/emailWrong.svg';
import emailCorrect from './asset/emailCorrect.svg';

const Register: Component<{ onClose: () => void; onSwitch: () => void; onRegister?: () => void; }> = (props) => {
    const [showPassword, setShowPassword] = createSignal(false);
    const [currentContent, setCurrentContent] = createSignal(1);
    const [selectedGender, setSelectedGender] = createSignal('Laki laki');
    const [bloodtype, setBloodtype] = createSignal('Tidak ingin memberi tahu');
    const [age, setAge] = createSignal('');
    const [income, setIncome] = createSignal('< 1.000.000');
    const [status, setStatus] = createSignal('Pelajar / mahasiswa');
    const [hoverImage, setHoverImage] = createSignal(1);
    const [provinsi, setProvinsi] = createSignal('Aceh');
    const [kabupaten, setKabupaten] = createSignal('Banda Aceh');
    const [kecamatan, setKecamatan] = createSignal('Kuta Alam');

    const [firstname, setFirstname] = createSignal('');
    const [lastname, setLastname] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [question, setQuestion] = createSignal('');
    const [otp, setOtp] = createSignal('');
    const [emailError, setEmailError] = createSignal(false);
    const [passwordError, setPasswordError] = createSignal('');
    const [otpError, setOtpError] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal('');

    const [showPopup, setShowPopup] = createSignal(false);
    const validateContent1 = () => !!firstname() && !!lastname() && !!email() && !!password();
    const validateContent2 = () => !!selectedGender() && !!bloodtype() && !!age();
    const validateContent3 = () => !!status();
    const validateContent4 = () => !!provinsi() && !!kabupaten() && !!kecamatan() && !!question();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const data = {
        "Aceh": {
            "Banda Aceh": ["Kuta Alam", "Baiturrahman", "Syiah Kuala", "Ulee Kareng", "Banda Raya"],
            "Aceh Barat": ["Johan Pahlawan", "Samatiga", "Kaway XVI", "Bubon", "Woyla"],
            "Aceh Besar": ["Jantho", "Kuta Baro", "Ingin Jaya", "Kota Jantho", "Montasik"],
            "Pidie Jaya": ["Meureudu", "Meurah Dua", "Ulim", "Jangka Buya", "Bandar Baru"],
            "Simeulue": ["Simeulue Timur", "Simeulue Tengah", "Alafan", "Teupah Selatan", "Salang"]
        },
        "Sumatra Utara": {
            "Medan": ["Medan Kota", "Medan Barat", "Medan Timur", "Medan Tuntungan", "Medan Selayang"],
            "Binjai": ["Binjai Kota", "Binjai Barat", "Binjai Timur", "Binjai Selatan", "Binjai Utara"],
            "Deli Serdang": ["Lubuk Pakam", "Batang Kuis", "Pagar Merbau", "Tanjung Morawa", "Percut Sei Tuan"],
            "Tapanuli Utara": ["Tarutung", "Adian Koting", "Muara", "Parmonangan", "Pahae Julu"],
            "Samosir": ["Pangururan", "Harian", "Ronggur Nihuta", "Nainggolan", "Simanindo"]
        },
        "Sumatra Barat": {
            "Padang": ["Padang Timur", "Padang Barat", "Kuranji", "Lubuk Begalung", "Pauh"],
            "Bukittinggi": ["Guguk Panjang", "Mandiangin Koto Selayan", "Aur Birugo Tigo Baleh"],
            "Payakumbuh": ["Payakumbuh Barat", "Payakumbuh Timur", "Payakumbuh Utara", "Lamposi Tigo Nagari", "Payakumbuh Selatan"],
            "Pariaman": ["Pariaman Tengah", "Pariaman Selatan", "Pariaman Timur", "Pariaman Utara"],
            "Solok": ["Lubuk Sikarah", "Tanjung Harapan", "Gunung Talang", "Lembang Jaya", "Danau Kembar"]
        },
        "Riau": {
            "Pekanbaru": ["Tampan", "Marpoyan Damai", "Payung Sekaki", "Rumbai", "Senapelan"],
            "Dumai": ["Dumai Barat", "Dumai Timur", "Bukit Kapur", "Medang Kampai", "Sungai Sembilan"],
            "Siak": ["Siak", "Tualang", "Sungai Apit", "Mempura", "Kerinci Kanan"],
            "Kampar": ["Bangkinang", "Tambang", "Tapung", "Siak Hulu", "XIII Koto Kampar"],
            "Rokan Hulu": ["Rambah", "Tambusai", "Ujung Batu", "Bangun Purba", "Kunto Darussalam"]
        },
        "Kepulauan Riau": {
            "Tanjung Pinang": ["Bukit Bestari", "Tanjungpinang Timur", "Tanjungpinang Barat", "Tanjungpinang Kota", "Kepulauan Karimun"],
            "Batam": ["Sekupang", "Batam Kota", "Lubuk Baja", "Nongsa", "Batu Aji"],
            "Bintan": ["Bintan Utara", "Bintan Timur", "Teluk Sebong", "Toapaya", "Gunung Kijang"],
            "Karimun": ["Karimun", "Moro", "Kundur", "Buru", "Tebing"],
            "Lingga": ["Singkep", "Lingga", "Lingga Utara", "Senayang", "Singkep Barat"]
        },
        "Jambi": {
            "Jambi": ["Jelutung", "Pasar Jambi", "Kota Baru", "Telanaipura", "Jambi Timur"],
            "Sungai Penuh": ["Hamparan Rawang", "Pesisir Bukit", "Koto Baru", "Sungai Penuh", "Kumun Debai"],
            "Batanghari": ["Muara Bulian", "Maro Sebo Ulu", "Bajubang", "Pemayung", "Maro Sebo Ilir"],
            "Tanjung Jabung Barat": ["Tungkal Ilir", "Tungkal Ulu", "Merlung", "Pengabuan", "Seberang Kota"],
            "Merangin": ["Bangko", "Tabir", "Renah Pembarap", "Muara Siau", "Pangkalan Jambu"]
        },
        "Sumatra Selatan": {
            "Palembang": ["Sukarame", "Seberang Ulu I", "Seberang Ulu II", "Ilir Timur I", "Ilir Timur II"],
            "Lubuk Linggau": ["Lubuklinggau Timur I", "Lubuklinggau Timur II", "Lubuklinggau Selatan I", "Lubuklinggau Selatan II", "Lubuklinggau Barat I"],
            "Musi Banyuasin": ["Sekayu", "Babat Toman", "Sungai Lilin", "Lais", "Plakat Tinggi"],
            "Ogan Komering Ulu": ["Baturaja Timur", "Baturaja Barat", "Pengandonan", "Ulu Ogan", "Lengkiti"],
            "Muara Enim": ["Tanjung Agung", "Lawang Kidul", "Gelumbang", "Rambang Dangku", "Semendo Darat Laut"]
        },
        "Bangka Belitung": {
            "Pangkal Pinang": ["Rangkui", "Taman Sari", "Gerunggang", "Pangkal Balam", "Girimaya"],
            "Bangka": ["Sungailiat", "Belinyu", "Riau Silip", "Pemali", "Puding Besar"],
            "Belitung": ["Tanjung Pandan", "Sijuk", "Badau", "Membalong", "Selat Nasik"],
            "Belitung Timur": ["Manggar", "Gantung", "Simpang Renggiang", "Dendang", "Kelapa Kampit"],
            "Bangka Barat": ["Mentok", "Kelapa", "Jebus", "Tempilang", "Simpang Teritip"]
        },
        "Bengkulu": {
            "Bengkulu": ["Muara Bangkahulu", "Selebar", "Teluk Segara", "Ratu Agung", "Sungai Serut"],
            "Rejang Lebong": ["Curup", "Selupu Rejang", "Sindang Beliti Ilir", "Bermani Ulu", "Kota Padang"],
            "Kaur": ["Bintuhan", "Kinal", "Maje", "Nasal", "Luas"],
            "Seluma": ["Tais", "Seluma", "Seluma Timur", "Seluma Utara", "Seluma Barat"],
            "Lebong": ["Lebong Utara", "Lebong Selatan", "Bingin Kuning", "Topos", "Pelabai"]
        },
        "Lampung": {
            "Bandar Lampung": ["Sukarame", "Seberang Ulu I", "Seberang Ulu II", "Ilir Timur I", "Ilir Timur II"],
            "Metro": ["Metro Pusat", "Metro Timur", "Metro Barat", "Metro Selatan", "Metro Utara"],
            "Lampung Selatan": ["Kalianda", "Natar", "Ketapang", "Jati Agung", "Tanjung Bintang"],
            "Lampung Utara": ["Kotabumi", "Abung Selatan", "Abung Timur", "Tanjung Raja", "Sungkai Selatan"],
            "Tulang Bawang": ["Menggala", "Banjar Agung", "Banjar Baru", "Penawar Tama", "Gedung Aji"]
        },
        "DKI Jakarta": {
            "Jakarta Pusat": ["Menteng", "Gambir", "Tanah Abang", "Senen", "Cempaka Putih"],
            "Jakarta Utara": ["Kelapa Gading", "Tanjung Priok", "Cilincing", "Koja", "Penjaringan"],
            "Jakarta Barat": ["Grogol Petamburan", "Taman Sari", "Palmerah", "Kebon Jeruk", "Cengkareng"],
            "Jakarta Selatan": ["Kebayoran Baru", "Pasar Minggu", "Tebet", "Setiabudi", "Mampang Prapatan"],
            "Jakarta Timur": ["Matraman", "Pulo Gadung", "Cakung", "Duren Sawit", "Jatinegara"]
        },
        "Jawa Barat": {
            "Bandung": ["Bandung Wetan", "Bandung Kulon", "Bandung Kidul", "Bandung Barat", "Cibeunying"],
            "Bogor": ["Bogor Tengah", "Bogor Selatan", "Bogor Utara", "Bogor Timur", "Bogor Barat"],
            "Bekasi": ["Bekasi Timur", "Bekasi Barat", "Bekasi Selatan", "Bekasi Utara", "Medan Satria"],
            "Depok": ["Depok I", "Depok II", "Depok III", "Depok IV", "Depok V"],
            "Cirebon": ["Cirebon Barat", "Cirebon Timur", "Cirebon Selatan", "Cirebon Utara", "Pangeran"]
        },
        "Banten": {
            "Serang": ["Serang Kota", "Kasemen", "Cipocok Jaya", "Taktakan", "Serang Barat"],
            "Tangerang": ["Tangerang Kota", "Ciledug", "Ciputat", "Tangerang Selatan", "Batu Ceper"],
            "Cilegon": ["Cilegon Timur", "Cilegon Barat", "Cilegon Selatan", "Cilegon Utara", "Krakatau"],
            "Pandeglang": ["Pandeglang Kota", "Labuan", "Cadasari", "Panimbang", "Menes"],
            "Lebak": ["Lebak Kota", "Rangkasbitung", "Cibadak", "Malingping", "Panggarangan"]
        },
        "Jawa Tengah": {
            "Semarang": ["Semarang Selatan", "Semarang Utara", "Semarang Barat", "Semarang Timur", "Semarang Tengah"],
            "Solo": ["Solo Kota", "Jebres", "Laweyan", "Banjarsari", "Pasar Kliwon"],
            "Magelang": ["Magelang Selatan", "Magelang Utara", "Magelang Barat", "Magelang Timur", "Magelang Tengah"],
            "Salatiga": ["Salatiga Kota", "Argomulyo", "Sidorejo", "Tingkir", "Kota Salatiga"],
            "Banyumas": ["Purwokerto Barat", "Purwokerto Timur", "Purwokerto Selatan", "Purwokerto Utara", "Kebasen"]
        },
        "DI Yogyakarta": {
            "Yogyakarta": ["Danurejan", "Gedongtengen", "Kraton", "Mergangsan", "Umbulharjo"],
            "Bantul": ["Bantul Kota", "Kasihan", "Piyungan", "Sanden", "Sedayu"],
            "Sleman": ["Sleman", "Ngemplak", "Mlati", "Gamping", "Caturtunggal"],
            "Gunung Kidul": ["Wonosari", "Saptosari", "Paliyan", "Panggang", "Karangmojo"],
            "Kulon Progo": ["Wates", "Kokap", "Pengasih", "Kalibawang", "Lendah"]
        },
        "Jawa Timur": {
            "Surabaya": ["Pabean Cantikan", "Gubeng", "Tegalsari", "Wonokromo", "Rungkut"],
            "Malang": ["Malang Kota", "Klojen", "Lowokwaru", "Sukun", "Blimbing"],
            "Kediri": ["Kediri Kota", "Mojo", "Grogol", "Pagu", "Kandat"],
            "Jember": ["Jember Kota", "Arjasa", "Jenggawah", "Ambulu", "Sukorambi"],
            "Banyuwangi": ["Banyuwangi Kota", "Giri", "Glagah", "Sukamade", "Kalon"]
        }
    };

    // Ketika provinsi diubah, atur kabupaten yang tersedia untuk provinsi tersebut
    const handleProvinsiChange = (e) => {
        setProvinsi(e.target.value);
        const firstKabupaten = Object.keys(data[e.target.value])[0];
        setKabupaten(firstKabupaten);
        setKecamatan(data[e.target.value][firstKabupaten][0]); // Set kecamatan pertama dari kabupaten baru
    };

    // Ketika kabupaten diubah, atur kecamatan yang tersedia untuk kabupaten tersebut
    const handleKabupatenChange = (e) => {
        setKabupaten(e.target.value);
        setKecamatan(data[provinsi()][e.target.value][0]); // Set kecamatan pertama dari kabupaten baru
    };

    const handleNext = async () => {
        let isValid = false;
        setErrorMessage(''); // Reset error message
    
        // Kondisi untuk content1 hingga content4
        if (currentContent() <= 4) {
            if (currentContent() === 1) {
                if (emailError() && passwordError()) {
                    setErrorMessage('Email & password tidak valid!');
                } else if (emailError()) {
                    setErrorMessage('Email tidak valid!');
                } else if (passwordError()) {
                    setErrorMessage('Password tidak valid!');
                } else {
                    isValid = validateContent1();
                }
            } else if (currentContent() === 2) {
                isValid = validateContent2();
            } else if (currentContent() === 3) {
                isValid = validateContent3();
            } else if (currentContent() === 4) {
                isValid = validateContent4();
            }
    
            if (errorMessage() || !isValid) {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000); // Pop-up muncul selama 3 detik
                return;
            }
        }
    
        // Jika content5 atau content6, lanjut tanpa validasi atau pop-up
        if (currentContent() === 4) {
            await registerUser();
        } else if (currentContent() === 5) {
            verifyOtp();
        } else {
            setCurrentContent((prev) => (prev < 6 ? prev + 1 : 6));
        }
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
            setPasswordError("*(terdapat campuran huruf, angka, dan simbol)");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };    

    const validateOtp = (otp: string) => {
        const isValid = /^\d{5}$/.test(otp); // Validasi 6 angka
        setOtpError(!isValid);
        return isValid;
    };

    const verifyOtp = async () => {
        if (!validateOtp(otp())) {
            return;
        }
    
        const otpRequest = {
            email: email(),
            otp: otp()
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8080/users/verifikasi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(otpRequest),
            });
    
            if (response.ok) {
                const message = await response.json();
                console.log('Verifikasi berhasil:', message);
                setCurrentContent(6); // Pindah ke content6 setelah OTP berhasil diverifikasi
            } else {
                const errorText = await response.text();
                console.error('Failed to verify OTP:', errorText);
                setOtpError(true); // Tampilkan pesan error jika OTP tidak valid
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const registerUser = async () => {
        // Validasi semua field sebelum mengirim
        if (!validateEmail(email()) || !validatePassword(password())) {
            console.log('Validation failed');
            return;
        }
    
        const newUser = {
            fullname: `${firstname()} ${lastname()}`, // Menggunakan sinyal fullname
            email: email(),
            password: password(),
            gender: selectedGender(),
            bloodtype: bloodtype(),
            age: Number(age()),
            income: income(),
            status: status(),
            provinsi: provinsi(),
            kabupaten: kabupaten(),
            kecamatan: kecamatan(),
            question: question()
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8080/users/daftar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (response.ok) {
                const message = await response.json();
                console.log('Registration successful:', message);
                setCurrentContent(5); // Pindah ke content5 setelah registrasi berhasil
            } else {
                const errorText = await response.text();
                console.error('Failed to register:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const progressWidth = () => {
        if (currentContent() === 1) return '0%';
        return `${((currentContent() - 1) / 5) * 100}%`;
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
                    {currentContent() === 5
                        ? 'Masukkan Kode OTP'
                        : currentContent() === 6
                        ? 'Pendaftaran Berhasil'
                        : 'Daftarkan Akun Anda'}
                </h2>
                <div class={styles.contentContainer}>
                    <div class={styles.content} style={{ transform: `translateX(-${(currentContent() - 1) * 100}%)` }}>
                        <form class={styles.content1}>
                            <div class={styles.inputGroup}>
                                <div class={styles.labelNama}>
                                    <label class={styles.labelFirstname}>Nama depan</label>
                                    <label class={styles.labelLastname}>Nama akhir</label>
                                </div>
                                <div class={styles.inputNama}>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="John"
                                        class={styles.inputFirstname}
                                        onInput={(e) => setFirstname(e.target.value)} // Gunakan sinyal fullname
                                    />
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="Wilson"
                                        class={styles.inputLastname}
                                        onInput={(e) => setLastname(e.target.value)} // Gunakan sinyal fullname
                                    />
                                </div>
                            </div>
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
                                    <label class={styles.labelPassword}>Password</label>
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
                        </form>
                        <form class={styles.content2}>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelGender}>Gender</label>
                                <div class={styles.genderContainer}>
                                    <button
                                        type="button"
                                        class={`${styles.genderButton1} ${selectedGender() === 'Laki laki' ? styles.selected : ''}`}
                                        onClick={() => setSelectedGender('Laki laki')}
                                    >
                                        Laki laki
                                    </button>
                                    <button
                                        type="button"
                                        class={`${styles.genderButton2} ${selectedGender() === 'Perempuan' ? styles.selected : ''}`}
                                        onClick={() => setSelectedGender('Perempuan')}
                                    >
                                        Perempuan
                                    </button>
                                </div>
                            </div>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelBloodType}>Gol. darah</label>
                                <label class={styles.labelAge}>Usia</label>
                                <select class={styles.inputBlood} value={bloodtype()} onInput={(e) => setBloodtype(e.target.value)}>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                    <option value="Tidak ingin memberi tahu">Tidak ingin memberi tahu</option>
                                </select>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="0"
                                    class={styles.inputAge}
                                    value={age()}
                                    onInput={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelIncome}>Pendapatan / bulan</label>
                                <select class={styles.selectInput} value={income()} onInput={(e) => setIncome(e.target.value)}>
                                    <option value="< 1.000.000">&lt; 1.000.000</option>
                                    <option value="1.000.000">1.000.000</option>
                                    <option value="2.000.000">2.000.000</option>
                                    <option value="3.000.000">3.000.000</option>
                                    <option value="4.000.000">4.000.000</option>
                                    <option value="5.000.000">5.000.000</option>
                                    <option value="> 5.000.000">&gt; 5.000.000</option>
                                </select>
                            </div>
                        </form>
                        <form class={styles.content3}>
                                <label class={styles.labelStatus}>Status saat ini</label>
                                <img
                                    src={hoverImage() === 1 ? gambar1Hover : gambar1}
                                    alt="Gambar 1"
                                    class={styles.image1}
                                    onClick={() => { 
                                        setHoverImage(1); 
                                        setStatus('Pelajar / mahasiswa');
                                    }}
                                />
                                <img
                                    src={hoverImage() === 2 ? gambar2Hover : gambar2}
                                    alt="Gambar 2"
                                    class={styles.image2}
                                    onClick={() => { 
                                        setHoverImage(2); 
                                        setStatus('Pekerja / wirausaha');
                                    }}
                                />
                        </form>
                        <form class={styles.content4}>
                        <div class={styles.inputgroupProvinsi}>
                                <label class={styles.labelProvinsi}>Provinsi</label>
                                <select class={styles.inputProvinsi} value={provinsi()} onInput={handleProvinsiChange}>
                                    {Object.keys(data).map((prov) => (
                                        <option value={prov}>{prov}</option>
                                    ))}
                                </select>
                            </div>
                            <div class={styles.inputGroup}>
                                <div class={styles.labelNama}>
                                    <label class={styles.labelFirstname}>Kabupaten/Kota</label>
                                    <label class={styles.labelKecamatan}>Kecamatan</label>
                                </div>
                                <select class={styles.inputKabupaten} value={kabupaten()} onInput={handleKabupatenChange}>
                                    {Object.keys(data[provinsi()]).map((kab) => (
                                        <option value={kab}>{kab}</option>
                                    ))}
                                </select>
                                <select class={styles.inputKecamatan} value={kecamatan()} onInput={(e) => setKecamatan(e.target.value)}>
                                    {data[provinsi()][kabupaten()].map((kec) => (
                                        <option value={kec}>{kec}</option>
                                    ))}
                                </select>
                            </div>
                            <div class={styles.inputGroup}>
                                <label class={styles.labelEmail}>Question (Key)</label>
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
                        <form class={styles.content5}>
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
                        <form class={styles.content6}>
                            <div class={styles.berhasil}>
                                <img src={berhasil} alt="Pendaftaran Berhasil" class={styles.ukurangambarBerhasil} />
                            </div>
                        </form>
                    </div>
                </div>
                <div class={styles.buttonContainer}>
                                {currentContent() < 6 && (
                        <button
                            class={styles.registerButton}
                            onClick={handleNext} // Panggil handleNext untuk semua content
                        >
                            {currentContent() === 5 ? 'Verifikasi OTP' : 'Berikutnya'}
                        </button>
                    )}
                    {currentContent() === 6 && (
                        <button class={styles.registerButton} onClick={() => { 
                            // Menutup pop-up dan membuka login saat berada di content6
                            props.onClose(); 
                            props.onSwitch(); 
                        }}>
                            Masuk
                        </button>
                    )}
                    {showPopup() && (
                        <div class={styles.popupNotification}>
                            {errorMessage() || 'Lengkapi data terlebih dahulu!'}
                        </div>
                    )}
                    <p class={styles.sudahpunyaAkun}>
                    Sudah punya akun?{' '}
                    <label class={styles.masukKlik}>
                        <a onClick={props.onSwitch}>Masuk</a>
                    </label>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
