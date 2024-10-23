import { createSignal } from "solid-js";
import './transkripnilai.css';
import DataGrid from './datagrid'; // Mengimpor komponen DataGrid

const JurusanForm = (props) => {
  return (
    <div class="jurusan-select-container">
      <label class="jurusan-label">Jurusan</label>
      <label class="titikdua1">:</label>
      <select
        class="jurusan-select"
        name="jurusan"
        id="jurusan"
        onChange={(e) => props.setJurusan(e.target.value)}  // Mengirimkan nilai yang dipilih ke signal jurusan
      >
        <option disabled selected>Pilih Jurusan</option>
        <option value="IPA">IPA</option>
        <option value="IPS">IPS</option>
      </select>
    </div>
  );
};

const KelasForm = (props) => {
  return (
    <div class="kelas-select-container">
      <label class="kelas-label">Kelas</label>
      <label class="titikdua2">:</label>
      <select
        class="kelas-select"
        name="kelas"
        id="kelas"
        onChange={(e) => props.setKelas(e.target.value)}  // Mengirimkan nilai yang dipilih ke signal kelas
      >
        <option disabled selected>Pilih Kelas</option>
        <option value="10">Kelas 10</option>
        <option value="11">Kelas 11</option>
        <option value="12">Kelas 12</option>
      </select>
    </div>
  );
};

const Transkrip = () => {
  const [filteredData, setFilteredData] = createSignal([]); // Menyimpan data yang telah difilter
  const [jurusan, setJurusan] = createSignal("");
  const [kelas, setKelas] = createSignal("");
  const [showData, setShowData] = createSignal(false); // Untuk menyembunyikan atau menampilkan data

  const handleCariClick = () => {
    const selectedJurusan = jurusan();
    const selectedKelas = kelas();

    if (!selectedJurusan || !selectedKelas) {
      alert("Silakan pilih jurusan dan kelas!");
      return;
    }

    console.log("Jurusan:", selectedJurusan);
    console.log("Kelas:", selectedKelas);

    // Data siswa
    const data = [
      { no: 1, namaPanjang: "Adhara Faliya Utanti", jurusan: "IPA", kelas: "10", kkm: 75, nilaiPengetahuan: 98, nilaiKeterampilan: 99 },
      { no: 2, namaPanjang: "Auranisa Valent", jurusan: "IPS", kelas: "11", kkm: 75, nilaiPengetahuan: 85, nilaiKeterampilan: 90 },
      { no: 3, namaPanjang: "Eridayalma Zahra Yohar", jurusan: "IPS", kelas: "12", kkm: 75, nilaiPengetahuan: 88, nilaiKeterampilan: 92 },
      { no: 4, namaPanjang: "Pramusinta Ananta Fadzilah", jurusan: "IPA", kelas: "11", kkm: 75, nilaiPengetahuan: 95, nilaiKeterampilan: 94 }
    ];

    // Filter data berdasarkan jurusan dan kelas yang dipilih
    const filtered = data.filter(
      (student) => student.jurusan === selectedJurusan && student.kelas === selectedKelas
    );

    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
    setShowData(true); // Menampilkan data setelah klik tombol Cari
  };

  return (
    <div>
      <div class="contentTranskrip">
        <h1 class="title-content">Transkrip Nilai</h1>
      </div>
      <div class="contentTranskrip">
        <div class="group-box">
          <JurusanForm setJurusan={setJurusan} />
          <KelasForm setKelas={setKelas} />
          <div class ="button-flex">
            <button class="cari" onClick={handleCariClick}>Cari</button>
            <button class="reset" onClick={() => { setFilteredData([]); setShowData(false); }}>Reset</button>
          </div>
          {/* Hanya tampilkan DataGrid jika data sudah dicari */}
          {showData() && filteredData().length > 0 ? (
            <DataGrid />
          ) : (
            showData() && <p>Tidak ada data yang ditemukan untuk jurusan dan kelas yang dipilih.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transkrip;