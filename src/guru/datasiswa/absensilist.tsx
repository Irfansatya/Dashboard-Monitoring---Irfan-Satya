// src/pages/AbsensiList.tsx
import { createSignal } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./absensilist.css";
import "boxicons/css/boxicons.min.css";

// Sample data for absensi, should be fetched or managed via API/localStorage
const absensiDataPerKelas = {
  "X MIPA 1": [
    { nis: "541221001", nama: "Adhara Faliya", jenisKelamin: "Perempuan", hadir: true, alfa: false, sakit: false, izin: false },
    { nis: "541221002", nama: "Auranisa Valent", jenisKelamin: "Perempuan", hadir: false, alfa: true, sakit: false, izin: false },
  ],
  "X MIPA 2": [
    { nis: "541221003", nama: "Bagus Kurniawan", jenisKelamin: "Laki-laki", hadir: false, alfa: false, sakit: true, izin: false },
    { nis: "541221004", nama: "Citra Dewi", jenisKelamin: "Perempuan", hadir: false, alfa: false, sakit: false, izin: true },
  ],
};

const AbsensiList = (props) => {
  const kelasName = props.kelasName;

  const storedAbsensiData = localStorage.getItem("absensiData");
  const absensiDataPerKelasParsed = storedAbsensiData ? JSON.parse(storedAbsensiData) : absensiDataPerKelas;

  const [rowData, setRowData] = createSignal(absensiDataPerKelasParsed[kelasName] || []);
  const [filteredData, setFilteredData] = createSignal(rowData());
  const [searchTerm, setSearchTerm] = createSignal("");

  console.log("Row Data to AG Grid:", filteredData());

  // Function to update cell value in the table
  const updateCellValue = (params) => {
    const updatedData = rowData().map((row) => {
      if (row.nis === params.data.nis) {
        return { ...row, [params.colDef.field]: !row[params.colDef.field] };
      }
      return row;
    });
    setRowData(updatedData);
    setFilteredData(updatedData);
    saveToLocalStorage(updatedData); // Save changes to local storage
  };

  // Save updated data to localStorage
  const saveToLocalStorage = (data) => {
    absensiDataPerKelasParsed[kelasName] = data;
    localStorage.setItem("absensiData", JSON.stringify(absensiDataPerKelasParsed));
  };

  // Function to handle save button click
  const handleSaveChanges = () => {
    saveToLocalStorage(rowData());
    if (props.onBack) {
      props.onBack();
    }
  };

  const handleCancel = () => {
    if (props.onBack) {
      props.onBack();
    }
  };

  // Custom radio button renderer for grid cells
  const RadioButtonRenderer = (props) => {
    const isChecked = props.data[props.column.colId];
    return <input type="radio" checked={isChecked} onChange={() => updateCellValue(props)} />;
  };

  // Column definitions for AG Grid
  const [columnDefs] = createSignal([
    { field: "nis", headerName: "NIS", sortable: true, filter: true },
    { field: "nama", headerName: "NAMA", sortable: true, filter: true },
    { field: "jenisKelamin", headerName: "JENIS KELAMIN", sortable: true, filter: true },
    { field: "hadir", headerName: "HADIR", cellRenderer: RadioButtonRenderer, width: 105 },
    { field: "alfa", headerName: "ALFA", cellRenderer: RadioButtonRenderer, width: 105 },
    { field: "izin", headerName: "IZIN", cellRenderer: RadioButtonRenderer, width: 105 },
    { field: "sakit", headerName: "SAKIT", cellRenderer: RadioButtonRenderer, width: 105 },
  ]);

  // Function to handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = rowData().filter((row) => 
      row.nis.toLowerCase().includes(term) || 
      row.nama.toLowerCase().includes(term) || 
      row.jenisKelamin.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  return (
    <div class="absen-list">
      <div class="absen-konten">
        <h1 class="absensi-title">{kelasName}</h1>
        <div class="absensi-wrapper">
          <h2 class="absensi-section-title">Absensi Siswa</h2>
          <div class="absensi-controls">
            <div class="search-containerr">
              <i class="bx bx-search"></i>
              <input
                type="text"
                class="search-input"
                placeholder="Cari.."
                value={searchTerm()}
                onInput={handleSearch}
              />
            </div>
            <input type="date" class="absensi-date-picker" value="2024-09-18" />
          </div>
          <div class="ag-theme-alpine" style={{ height: "325px", width: "960px", "margin-left": "-18px", "margin-bottom": "-25px" }}>
            <AgGridSolid
              rowData={filteredData()}
              columnDefs={columnDefs()}
              pagination={true}
              paginationPageSize={10}
              onCellClicked={updateCellValue}
              domLayout="autoHeight"
            />
          </div>
        </div>
        <div class="absensi-button">
          <div>
            <button class="absensi-cancel-button" onClick={handleCancel}>
              Batal
            </button>
            <button class="absensi-save-button" onClick={handleSaveChanges}>
              Simpan perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsensiList;
