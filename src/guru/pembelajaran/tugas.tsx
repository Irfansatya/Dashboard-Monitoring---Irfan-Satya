import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import './tugas.css';
import editPengampu from '../assetGuru/editPengampu.svg';
import backgroundIcon from '../assetGuru/backgroundIcon.svg';
import tambahKelas from '../assetGuru/tambahKelas.svg';
import editKelas from '../assetGuru/editKelas.svg';
import editMapel from '../assetGuru/editMapel.svg';
import tambahMapel from '../assetGuru/tambahMapel.svg';
import kosong from '../assetGuru/kosong.svg';
import tambahMateri from '../assetGuru/tambahMateri.svg';
import uploadIcon from '../assetGuru/uploadIcon.svg';
import iconTambahMateri from '../assetGuru/iconTambahMateri.svg';
import hapusIcon from '../assetGuru/hapusIcon.svg';
import tambahIcon from '../assetGuru/tambahIcon.svg';
import hapusBackgroundIcon from '../assetGuru/hapusBackgroundIcon.svg';
import pdfIcon from '../assetGuru/pdfIcon.svg'; // Import icons for lampiran types
import docIcon from '../assetGuru/docIcon.svg';
import xlsIcon from '../assetGuru/xlsIcon.svg';
import pptIcon from '../assetGuru/pptIcon.svg';
import editMateri from '../assetGuru/editMateri.svg';
import hapusMateri from '../assetGuru/hapusMateri.svg';

const Tugas: Component = () => {
  const [isEditPopupVisible, setIsEditPopupVisible] = createSignal(false);
  const [isEditingUserPopupVisible, setIsEditingUserPopupVisible] = createSignal(false);
  const [isAddUserPopupVisible, setIsAddUserPopupVisible] = createSignal(false);
  const [isTambahMateriPopupVisible, setIsTambahMateriPopupVisible] = createSignal(false);
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [selectedFiles, setSelectedFiles] = createSignal<File[]>([]);
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
  const [judulMapel, setJudulMapel] = createSignal('Tidak Ada Judul');
  const [inputJudulMapel, setInputJudulMapel] = createSignal('');
  const [daftarJudulMapel, setDaftarJudulMapel] = createSignal<string[]>([]);
  const [inputJudulMapelBaru, setInputJudulMapelBaru] = createSignal('');
  const [inputJudulBab, setInputJudulBab] = createSignal('');
  const [inputValue, setInputValue] = createSignal("");
  const [notification, setNotification] = createSignal<string | null>(null);
  const [hoveredFileIndex, setHoveredFileIndex] = createSignal<number | null>(null);
  const [activeHeader, setActiveHeader] = createSignal(localStorage.getItem("activeHeader") || "header1");
  const [isContentKosong, setIsContentKosong] = createSignal(true);
  const [isHapusPopupVisible, setIsHapusPopupVisible] = createSignal(false);
  
  // State untuk menyimpan file yang aktif dipilih di comboBox
  const [activeFileIndex, setActiveFileIndex] = createSignal<number | null>(null);

  // Tambahan untuk bungkusInput2
  const [selectedLampiranFiles, setSelectedLampiranFiles] = createSignal<File[]>([]);
  const [lampiranDescriptions, setLampiranDescriptions] = createSignal<string[]>([]);
  const [hoveredLampiranFileIndex, setHoveredLampiranFileIndex] = createSignal<number | null>(null);
  const [activeLampiranFileIndex, setActiveLampiranFileIndex] = createSignal<number | null>(null);
  const [deadline, setDeadline] = createSignal('');

  const [addedMateri, setAddedMateri] = createSignal({
    judul: '',
    penjelasan: '',
    deadline: '',
    lampiran: [] as File[],
    lampiranDescriptions: [] as string[]
  });

  // State untuk mengatur apakah sedang dalam mode edit pengampu
  const [isEditingPengampu, setIsEditingPengampu] = createSignal(false);
  const [pengampuNama, setPengampuNama] = createSignal('Irfan Satya'); // Nama pengampu

  // Ref untuk input pengampu agar bisa difokuskan
  let pengampuInputRef: HTMLInputElement | undefined;

  const allowedDocumentFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

  const handleHeaderClick = () => {
    setIsEditPopupVisible(true);
  };

  const handleTambahKelasClick = () => {
    setIsAddUserPopupVisible(true); // Tampilkan popup baru saat tambahKelas diklik
  };

  const handleEditUserClick = () => {
    setIsEditingUserPopupVisible(true); // Tampilkan popup editingUser
    setIsEditPopupVisible(false);
  };

  // Fungsi untuk menangani klik pada ikon edit pengampu
  const handleEditPengampuClick = () => {
    setIsEditingPengampu(true); // Aktifkan mode edit
    // Fokus otomatis ke input setelah mode edit aktif
    setTimeout(() => {
      if (pengampuInputRef) {
        pengampuInputRef.focus();
        pengampuInputRef.select(); // Menyeleksi seluruh teks agar mudah diganti
      }
    }, 0);
  };

  // Fungsi untuk menyimpan perubahan nama pengampu saat "Enter" ditekan
  const handlePengampuNamaKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      setIsEditingPengampu(false); // Keluar dari mode edit
    }
  };

  // Handler untuk menangani perubahan input nama pengampu
  const handlePengampuNamaChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setPengampuNama(target.value); // Update nama pengampu
  };

  // Handler untuk menangani perubahan combobox
  const handleFileSelect = (index: number) => {
    setActiveFileIndex(index);
  };

  const handleTambahMateriClick = () => {
    setIsTambahMateriPopupVisible(true); // Tampilkan popup baru saat tambahMateri diklik
  };

  const handleClickOutside = (event) => {
    const editPopup = document.getElementById("edit-popup");
    const editingUserPopup = document.getElementById("editing-user-popup");
    const addUserPopup = document.getElementById("add-user-popup");
    const tambahMateriPopup = document.getElementById("tambah-materi-popup");
    const headerMateri = document.querySelector('.headerMateri');

    if (
      (isEditPopupVisible() && editPopup && !editPopup.contains(event.target) && !headerMateri.contains(event.target)) &&
      (isEditingUserPopupVisible() && editingUserPopup && !editingUserPopup.contains(event.target)) &&
      (isAddUserPopupVisible() && addUserPopup && !addUserPopup.contains(event.target)) &&
      (isTambahMateriPopupVisible() && tambahMateriPopup && !tambahMateriPopup.contains(event.target))
    ) {
      setIsEditPopupVisible(false);
      setIsEditingUserPopupVisible(false); // Tutup popup editingUser saat klik di luar
      setIsAddUserPopupVisible(false);
      setIsTambahMateriPopupVisible(false);
    }
  };

  const closePopup = () => {
    setIsEditingUserPopupVisible(false); // Tutup popup saat tombol "Batalkan" diklik
    setIsEditPopupVisible(false);
    setIsAddUserPopupVisible(false);
    setIsTambahMateriPopupVisible(false);
  };

  // Fungsi untuk mengubah active header dan menyimpan ke localStorage
  const handleHeaderToggle = (header: string) => {
    setActiveHeader(header);
    localStorage.setItem("activeHeader", header); // Simpan pilihan aktif ke localStorage
  };

  // Handler untuk menangani klik pada tombol "Tambah" di popup "add-user-popup"
  const handleTambahJudulMapel = () => {
    if (inputJudulMapelBaru()) {
      setDaftarJudulMapel([...daftarJudulMapel(), inputJudulMapelBaru()]);
      setInputJudulMapelBaru('');
      closePopup();
    }
  };

  // Handler untuk klik pada "telusuri"
  const handleTelusuriClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click(); // Trigger klik pada elemen input file yang tersembunyi
    }
  };

  const handleTelusuriMateriClick = () => {
    const fileInput = document.getElementById("fileInput1");
    if (fileInput) {
      fileInput.click();
    }
  };

  const closeHapusPopup = () => {
    setIsHapusPopupVisible(false);
  };

  const handleHapusMateri = () => {
    setIsHapusPopupVisible(true);  // Tampilkan popup konfirmasi hapus
  };

  const confirmHapusMateri = () => {
    setAddedMateri({
      judul: '',
      penjelasan: '',
      deadline: '',
      lampiran: [],
      lampiranDescriptions: []
    });
    setIsContentKosong(true);  // Kembalikan tampilan ke contentKosong
    closeHapusPopup();
  };

  // Handler untuk menangani perubahan pada input file
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      setSelectedFile(file); // Simpan file yang dipilih
      const preview = URL.createObjectURL(file); // Buat URL untuk preview gambar
      setPreviewUrl(preview); // Set URL preview ke state
    }
  };

  const handleFileLampiranChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      if (allowedDocumentFormats.includes(file.type)) {
        if (selectedLampiranFiles().length < 3) {
          setSelectedLampiranFiles([...selectedLampiranFiles(), file]);
          setLampiranDescriptions([...lampiranDescriptions(), '']);
          setNotification(null);
        }
      } else {
        setNotification('Format file lampiran tidak didukung');
      }
    }
  };

  const handleHapusLampiranFile = (index: number) => {
    const updatedFiles = selectedLampiranFiles().filter((_, i) => i !== index);
    const updatedDescriptions = lampiranDescriptions().filter((_, i) => i !== index);
    setSelectedLampiranFiles(updatedFiles);
    setLampiranDescriptions(updatedDescriptions);
    setActiveLampiranFileIndex(null);
  };

  const getFileLabel = (file: File, index: number) => {
    if (file.type === 'application/pdf') {
      return `PDF${index + 1}`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return `DOC${index + 1}`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return `XLS${index + 1}`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return `PPT${index + 1}`;
    }
    return `File${index + 1}`;
  };

  const getFileLabelMateri = (file: File) => {
    switch (file.type) {
      case 'application/pdf':
        return <img src={pdfIcon} alt="PDF Icon" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <img src={docIcon} alt="DOC Icon" />;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <img src={xlsIcon} alt="XLS Icon" />;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return <img src={pptIcon} alt="PPT Icon" />;
      default:
        return null;
    }
  };

  const handleTambahButton = () => {
    setAddedMateri({
      judul: inputJudulBab(),
      penjelasan: inputValue(),
      deadline: deadline(),
      lampiran: selectedLampiranFiles(),
      lampiranDescriptions: lampiranDescriptions()
    });
    setIsContentKosong(false);  // Sembunyikan contentKosong dan tampilkan contentIsi
    closePopup();
  };

  // Handler untuk menghapus background
  const handleHapusBackground = () => {
    setSelectedFile(null);
    setPreviewUrl(null); // Reset preview dan file yang dipilih
  };

  // Fungsi untuk menyimpan judul mapel yang diinput
  const handleSaveJudulMapel = () => {
    setJudulMapel(inputJudulMapel()); // Update judulMapel dengan nilai dari input
    closePopup(); // Tutup popup setelah menyimpan
  };

  // Function to handle input change with a max character limit of 1000
  const handleInputChange = (e: InputEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;

    // Set the value only if it's within the limit
    if (value.length <= 1000) {
      setInputValue(value);
    }
  };

  // Listener untuk klik di luar popup
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  
  return (
    <div class="contentMateri">
      <div class="contentMateri1">
        <div>
          <h1 class="judul">Tugas Harian - Ilmu Pengetahuan Alam</h1>
          <div class="pengampu">
            <h2 class="pengampuText">Pengampu :</h2>
            {isEditingPengampu() ? (
              <input
                type="text"
                class="pengampuNamaInput"
                value={pengampuNama()}
                ref={pengampuInputRef}
                onInput={handlePengampuNamaChange}
                onKeyDown={handlePengampuNamaKeyDown}
              />
            ) : (
              <h2 class="pengampuNama">{pengampuNama()}</h2>
            )}

            {/* Hanya tampilkan ikon edit jika tidak sedang mengedit */}
            {!isEditingPengampu() && (
              <img
                src={editPengampu}
                alt="Edit Pengampu"
                class="editPengampu"
                onClick={handleEditPengampuClick}
              />
            )}
          </div>
        </div>

        <div class="backgroundContainer">
        <div class={`uploadBackgroundTugas ${previewUrl() ? 'no-border' : ''}`} style={{ "background-image": previewUrl() ? `url(${previewUrl()})` : 'none' }}>
        {!previewUrl() && (
            <>
          <img src={backgroundIcon} alt="Background Icon" class="backgroundIcon" />
          <div class="textBackground">
            <h2 class="pilih">Pilih background, atau </h2>
            <h2 class="telusuri" onClick={handleTelusuriClick}>telusuri</h2>
          </div>
          <p class="ukuran">800 x 600 px</p>
          </>
          )}
          {/* Elemen input file yang disembunyikan */}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }} // Disembunyikan dari tampilan
            onChange={handleFileChange}
          />
        </div>

        {/* Tombol hapus background jika ada preview gambar */}
        {previewUrl() && (
          <div class="hapusBackground" onClick={handleHapusBackground}>
            <img src={hapusBackgroundIcon} alt="Hapus Background Icon" class="hapusBackgroundIcon" />
            <h2 class="hapusBackgroundText">Background</h2>
          </div>
        )}
        </div>
      </div>
      
      <div class="contentMateri2">
        <div class="headerMateri">
        <div
          class={`header1 ${activeHeader() === 'header1' ? 'active' : ''}`}
          onClick={() => handleHeaderToggle('header1')} // Klik kiri
          onContextMenu={(event) => { // Klik kanan
            event.preventDefault(); // Cegah menu konteks default
            handleHeaderClick(); // Fungsi yang dipanggil untuk klik kanan
          }}
        >
            <h2 class="tidakAdaJudul">{judulMapel()}</h2>
            <h2 class="jumlah">(0)</h2>
          </div>

          {/* Menampilkan judul mapel baru yang ditambahkan */}
          {daftarJudulMapel().map((judul, index) => (
            <div
            class={`headerTambah ${activeHeader() === `headerTambah${index}` ? 'active' : ''}`} // Gaya aktif berdasarkan state
            onClick={() => handleHeaderToggle(`headerTambah${index}`)}
          >
              <h2 class="tidakAdaJudulTambah">{judul}</h2>
              <h2 class="jumlahTambah">(0)</h2>
            </div>
          ))}

          <button class="tambahKelas" onClick={handleTambahKelasClick}>
            <img src={tambahKelas} alt="Tambah Kelas" class="tambahKelasIcon" />
          </button>
        </div>
        <div class="garisPembatas"></div>
      </div>
      <div class="contentMateri3">
      {isContentKosong() ? (
          <div class="contentKosong">
            <img src={kosong} alt="Kosong" class="kosongIcon" />
            <h2 class="tidakAdaMateri">Tidak Ada Tugas</h2>
            <button class="tambahMateri" onClick={handleTambahMateriClick}>
              <img src={tambahMateri} alt="Tambah Materi" class="tambahIcon" />
              <h2 class="tambahText">Tambah Tugas</h2>
            </button>
          </div>
        ) : (
          <div class="bungkusContentIsi">
            <div class="contentIsi">
              <div class="headerContentIsi">
                <h2 class="judulMateri">{addedMateri().judul}</h2>
                <button class="editMateri" onClick={handleTambahMateriClick}>
                  <img src={editMateri} alt="Edit Materi" class="editMateriIcon" />
                </button>
                <button class="hapusMateri">
                  <img src={hapusMateri} alt="Hapus Materi" class="hapusMateriIcon" onClick={handleHapusMateri} />
                </button>
              </div>
              <p class="penjelasanMateri">{addedMateri().penjelasan}</p>
              <p class="deadlineTugas">Deadline: {addedMateri().deadline}</p>
              <div class="lampiranList">
                {addedMateri().lampiran.map((file, index) => (
                  <div class="lampiranItem">
                    {getFileLabelMateri(file)}
                    <p class="lampiranDescription">{addedMateri().lampiranDescriptions[index]}</p>
                  </div>
                ))}
              </div>
            </div>
            <button class="tambahMateri1" onClick={handleTambahMateriClick}>
              <img src={tambahMateri} alt="Tambah Materi" class="tambahIcon" />
              <h2 class="tambahText">Tambah Tugas</h2>
            </button>
          </div>
        )}
      </div>

      {/* Popup untuk tambah materi */}
      {isTambahMateriPopupVisible() && (
        <div class="popupOverlay" id="tambah-materi-popup">
          <div class="popupMateri">
          <div class="popupHeaderMateri">
              <img src={iconTambahMateri} alt="Tambah Materi" class="iconTambahMateri"/>
              <h2 class="titleHeaderMateri">Tambah Tugas</h2>
              <div class="tandaKelas">
                <h2 class="textKelas">IPA - Kelas XII</h2>
              </div>
          </div>
            <div class="popupContentMateri">
                  <div class="gabunganLabel">
                    <label class="labelInput">Judul Tugas</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan judul.."
                    class="inputJudulBab"
                    value={inputJudulBab()} // Bind nilai input ke state
                    onInput={(e) => setInputJudulBab(e.currentTarget.value)} // Update inputJudulMapel saat user mengetik
                  />
                  <div class="gabunganLabel2">
                    <label class="labelInput">Deskripsi Tugas</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <div class="inputPenjelasan">
                  <textarea
                    id="materi-input"
                    class="materi-textarea"
                    value={inputValue()}
                    onInput={handleInputChange}
                    placeholder="Masukkan penjelasan.."
                    rows={5}
                  />
                  </div>
                  <div class="gabunganLabel2">
                    <label class="labelInput">Deadline Tugas</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <input
                    type="datetime-local"
                    class="deadline-input"
                    value={deadline()}
                    onInput={(e) => setDeadline(e.currentTarget.value)}
                  />
                  {/* Tampilkan file yang terupload */}
                  <div>
                    <div class="bungkusText2">
                      <label class="textMateri1">Lampiran</label>
                      <label class="textMateri3">Keterangan</label>
                    </div>
                    <div class="bungkusInput2">
                    {selectedLampiranFiles().map((file, index) => (
                      <div
                        class="file-box"
                        onMouseEnter={() => setHoveredLampiranFileIndex(index)}
                        onMouseLeave={() => setHoveredLampiranFileIndex(null)}
                        onClick={() => handleHapusLampiranFile(index)}
                      >
                        {hoveredLampiranFileIndex() === index ? (
                          <img src={hapusIcon} alt="Hapus Icon" class="hapusIcon" />
                        ) : (
                          getFileLabel(file, index)
                        )}
                      </div>
                    ))}

                    {/* Tombol "Tambah" jika file belum mencapai 3 */}
                    {selectedLampiranFiles().length > 0 && selectedLampiranFiles().length < 3 && (
                      <button class="tambahFileButton" onClick={() => document.getElementById('fileInput2')?.click()}>
                        <img src={tambahIcon} alt="Tambah Icon" class="tambahFileIcon" />
                      </button>
                    )}

                    {/* Upload button jika belum ada file */}
                    {selectedLampiranFiles().length === 0 && (
                      <button class="uploadFile2" onClick={() => document.getElementById('fileInput2')?.click()}>
                        <img src={uploadIcon} alt="Upload Icon" class="uploadIcon" />
                        <h2 class="uploadText">Upload file</h2>
                      </button>
                    )}

                    {/* Input file hidden */}
                    <input
                      type="file"
                      id="fileInput2"
                      style={{ display: 'none' }}
                      accept=".pdf, .docx, .xlsx, .pptx"
                      onChange={handleFileLampiranChange}
                    />

                    {/* Input keterangan file */}
                    <input
                      type="text"
                      placeholder="Masukkan keterangan.."
                      class="inputKeterangan2"
                      value={activeLampiranFileIndex() !== null ? lampiranDescriptions()[activeLampiranFileIndex()] : ''}
                      onInput={(event) => {
                        const target = event.target as HTMLInputElement;
                        const value = target.value;
                        const index = activeLampiranFileIndex();
                        if (index !== null) {
                          const updatedDescriptions = [...lampiranDescriptions()];
                          updatedDescriptions[index] = value;
                          setLampiranDescriptions(updatedDescriptions);
                        }
                      }}
                    />

                    {/* ComboBox hanya muncul jika ada file yang diunggah */}
                    {selectedLampiranFiles().length > 0 && (
                      <select
                        class="comboBoxInput2"
                        onChange={(event) => {
                          const target = event.target as HTMLSelectElement;
                          const index = parseInt(target.value);
                          setActiveLampiranFileIndex(index);
                        }}
                      >
                        {selectedLampiranFiles().map((file, index) => (
                          <option value={index}>{getFileLabel(file, index)}</option>
                        ))}
                      </select>
                    )}
                    </div>
                  </div>
              </div>
            <div class="popupActionsMateri">
              <button class="cancelButton" onClick={closePopup}>
                Batalkan
              </button>
              <button class="tambahButton" onClick={handleTambahButton}>
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup konfirmasi hapus materi */}
      {isHapusPopupVisible() && (
        <div class="popupOverlay">
          <div class="popupHapusMateri">
            <p class="textKonfirmasi">Apakah Anda yakin ingin menghapus tugas ini?</p>
            <div class="buttonPopupHapus">
              <button class="cancelButton" onClick={closeHapusPopup}>
                Batalkan
              </button>
              <button class="saveButton" onClick={confirmHapusMateri}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup edit */}
      {isEditPopupVisible() && (
          <div id="edit-popup" class="editPopup" onClick={handleEditUserClick}>
            <img src={editKelas} alt="Edit Kelas" class="editKelasIcon" />
            <span class="textEdit">Edit</span>
          </div>
        )}
        {/* Popup editingUser */}
      {isEditingUserPopupVisible() && (
        <div id="editing-user-popup" class="popupOverlay">
          <div class="popup">
            <div class="popupHeader">
              <img src={editMapel} alt="Edit" class="iconHeader"/>
              <h2 class="titleHeader">Edit Mapel</h2>
              <div class="mapelIpa">
                <h2 class="textMapelIpa">IPA</h2>
              </div>
            </div>
            <div class="popupContent">
                <div class="inputGroup1">
                  <div class="gabunganLabel">
                    <label class="labelInput">Judul Mapel</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan judul.."
                    class="textInput1"
                    value={inputJudulMapel()} // Bind nilai input ke state
                    onInput={(e) => setInputJudulMapel(e.currentTarget.value)} // Update inputJudulMapel saat user mengetik
                  />
                </div>
                <div class="inputGroup2">
                  <div class="gabunganLabel">
                    <label class="labelInput">Kelas yang Diampu</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <select class="textInput2">
                    <option value="Laki laki">Kelas X</option>
                    <option value="Perempuan">Kelas XI</option>
                    <option value="Perempuan">Kelas XII</option>
                  </select>
              </div>
            </div>
            <div class="popupActions">
              <button class="cancelButton" onClick={closePopup}>
                Batalkan
              </button>
              <button class="saveButton" onClick={handleSaveJudulMapel}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup addUser (baru) */}
      {isAddUserPopupVisible() && (
        <div id="add-user-popup" class="popupOverlay">
          <div class="popup">
            <div class="popupHeader">
              <img src={tambahMapel} alt="Tambah" class="iconHeaderTambah"/>
              <h2 class="titleHeaderTambah">Tambah Mapel</h2>
              <div class="mapelIpa">
                <h2 class="textMapelIpa">IPA</h2>
              </div>
            </div>
            <div class="popupContent">
                <div class="inputGroup1">
                  <div class="gabunganLabel">
                    <label class="labelInput">Judul Mapel</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan judul.."
                    class="textInput1"
                    value={inputJudulMapelBaru()}
                    onInput={(e) => setInputJudulMapelBaru(e.currentTarget.value)}
                  />
                </div>
                <div class="inputGroup2">
                  <div class="gabunganLabel">
                    <label class="labelInput">Kelas yang Diampu</label>
                    <label class="bintangMerah">*</label>
                  </div>
                  <select class="textInput2">
                    <option value="Kelas X">Kelas X</option>
                    <option value="Kelas XI">Kelas XI</option>
                    <option value="Kelas XII">Kelas XII</option>
                  </select>
              </div>
            </div>
            <div class="popupActions">
              <button class="cancelButton" onClick={closePopup}>
                Batalkan
              </button>
              <button class="saveButton" onClick={handleTambahJudulMapel}>
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tugas;