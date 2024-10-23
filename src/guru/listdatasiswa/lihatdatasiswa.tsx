import { createSignal } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import './lihatdatasiswa.css';

// Sample data for students in each class
const KelasSiswaData = {
  "X MIPA 1": [
    { nis: "12345", nisn: "67890", nama: "John Doe", jenisKelamin: "Laki-laki", alamat: "Jl. Contoh", tempatTanggalLahir: "Jakarta, 1 Jan 2000", noHp: "08123456789" },
    { nis: "54321", nisn: "09876", nama: "Jane Doe", jenisKelamin: "Perempuan", alamat: "Jl. Lain", tempatTanggalLahir: "Jakarta, 2 Feb 2000", noHp: "08234567890" },
  ],
  "X MIPA 2": [
    { nis: "12345", nisn: "67890", nama: "NINA Doe", jenisKelamin: "Laki-laki", alamat: "Jl. Contoh", tempatTanggalLahir: "Jakarta, 1 Jan 2000", noHp: "08123456789" },
    { nis: "54321", nisn: "09876", nama: "Naira Doe", jenisKelamin: "Perempuan", alamat: "Jl. Lain", tempatTanggalLahir: "Jakarta, 2 Feb 2000", noHp: "08234567890" },
  ],
};

const ListSiswa = (props) => {
  const storedAbsensiData = localStorage.getItem("KelasSiswaData");
  let absensiDataPerKelas = {};

  try {
    absensiDataPerKelas = storedAbsensiData ? JSON.parse(storedAbsensiData) : KelasSiswaData;
  } catch (error) {
    console.error("Error parsing localStorage data: ", error);
  }

  // Set data absensi sesuai dengan kelas yang dipilih
  const [rowData, setRowData] = createSignal(absensiDataPerKelas[props.kelasName] || []);
  const [columnDefs] = createSignal([
    { field: "nis", headerName: "NIS", sortable: true, filter: true },
    { field: "nisn", headerName: "NISN", sortable: true, filter: true },
    { field: "nama", headerName: "Nama", sortable: true, filter: true },
    { field: "jenisKelamin", headerName: "Jenis Kelamin", sortable: true, filter: true },
    { field: "alamat", headerName: "Alamat", sortable: true, filter: true },
    { field: "tempatTanggalLahir", headerName: "Tempat Tanggal Lahir", sortable: true, filter: true },
    { field: "noHp", headerName: "No HP", sortable: true, filter: true },
  ]);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredData = absensiDataPerKelas[props.kelasName]?.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(query))
    );
    setRowData(filteredData || []);
  };

  return (
    <div class="list-siswa">
      <div class="list-konten">
        <h1 class="list-title">{props.kelasName}</h1>

        <div class="list-wrapper">
          <h2 class="list-section-title">Absensi Siswa</h2>
          <div class="list-controls">
            <div class="search-containerr">
              <i class="bx bx-search"></i>
              <input type="text" class="search-inputt" placeholder="Cari.." onInput={handleSearch} />
            </div>
          </div>
          <div class="ag-theme-alpine grid-wrapper" style={{ height: "325px", width: "960px", "margin-left": "-18px", "margin-bottom": "-25px" }}>
            <AgGridSolid
              columnDefs={columnDefs()}
              rowData={rowData()}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              rowSelection="single"
              animateRows={true}
            />
          </div>
        </div>
        <div class="list-button">
          <button class="canceldataButton" onClick={props.onBack}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListSiswa;
