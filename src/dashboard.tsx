import { Component, createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import styles from './dashboard.module.css';
import logoMonitor from './asset2/logoMonitor.svg';
import chartActive from './asset2/chartActive.svg';
import user from './asset2/user.svg';
import checkout from './asset2/checkout.svg';
import indicator from './asset2/Indicator.svg';
import settings from './asset2/settings.svg';
import info from './asset2/info.svg';
import chat from './asset2/chat.svg';
import logout from './asset2/logout.svg';
import bag from './asset2/bag.svg';
import arrow from './asset2/arrow.svg';
import search from './asset2/search.svg';
import bell from './asset2/bell.svg';
import avatar from './asset2/avatar.svg';
import arrowHijau from './asset2/arrowHijau.svg';
import male from './asset2/male.svg';
import female from './asset2/female.svg';
import pelajar from './asset2/pelajar.svg';
import pekerja from './asset2/pekerja.svg';
import tambah from './asset2/tambah.svg';
import edit from './asset2/edit.svg';
import close from './asset2/close.svg';
import more from './asset2/more.svg';
import editProfil from './asset2/editProfil.svg';
import temaGelap from './asset2/temaGelap.svg';
import pengaturan from './asset2/pengaturan.svg';
import keluar from './asset2/keluar.svg';
import Petalokasi from './petaLokasi'

const Dashboard: Component = () => {
  let gridApi;
  let gridColumnApi;
  const [editingUser, setEditingUser] = createSignal(null);
  const [rowData, setRowData] = createSignal([]);
  const [userToDelete, setUserToDelete] = createSignal(null);
  const [showDeletePopup, setShowDeletePopup] = createSignal(false);
  const [jumlahLakiLaki, setJumlahLakiLaki] = createSignal(0);
  const [jumlahPerempuan, setJumlahPerempuan] = createSignal(0);
  const [jumlahPelajar, setJumlahPelajar] = createSignal(0);
  const [jumlahPekerja, setJumlahPekerja] = createSignal(0);
  const [incomeData, setIncomeData] = createSignal([]);
  const [showAddUserPopup, setShowAddUserPopup] = createSignal(false);
  const [isPopupVisible, setIsPopupVisible] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [currentPopupContent, setCurrentPopupContent] = createSignal(1);
  const [progressWidth, setProgressWidth] = createSignal('0%');

  const data = {
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

  const [provinsi, setProvinsi] = createSignal(Object.keys(data)[0]);
  const [kabupaten, setKabupaten] = createSignal(Object.keys(data[Object.keys(data)[0]])[0]);
  const [kecamatan, setKecamatan] = createSignal(data[Object.keys(data)[0]][Object.keys(data[Object.keys(data)[0]])[0]][0]);

  const [newUser, setNewUser] = createSignal({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Laki laki',
    bloodType: 'Tidak ingin memberi tahu',
    age: 0,
    income: '< 1.000.000',
    status: 'Pelajar / mahasiswa',
    provinsi: Object.keys(data)[0],
    kabupaten: Object.keys(data[Object.keys(data)[0]])[0],
    kecamatan: data[Object.keys(data)[0]][Object.keys(data[Object.keys(data)[0]])[0]][0]
  });

  const navigate = useNavigate();

  const handleProvinsiChange = (e) => {
    const selectedProvinsi = e.target.value;
    setProvinsi(selectedProvinsi);
    const firstKabupaten = Object.keys(data[selectedProvinsi])[0];
    setKabupaten(firstKabupaten);
    setKecamatan(data[selectedProvinsi][firstKabupaten][0]);
  
    // Pastikan newUser diupdate dengan selectedProvinsi
    setNewUser(prev => ({
      ...prev, 
      provinsi: selectedProvinsi, // Ini kunci perbaikannya
      kabupaten: firstKabupaten,
      kecamatan: data[selectedProvinsi][firstKabupaten][0]
    }));
  };
  
  const handleKabupatenChange = (e) => {
    const selectedKabupaten = e.target.value;
    setKabupaten(selectedKabupaten);
    setKecamatan(data[provinsi()][selectedKabupaten][0]);
  
    // Pastikan newUser diupdate dengan selectedKabupaten
    setNewUser(prev => ({
      ...prev, 
      kabupaten: selectedKabupaten, // Ini kunci perbaikannya
      kecamatan: data[provinsi()][selectedKabupaten][0]
    }));
  };
  
  const handleKecamatanChange = (e) => {
    const selectedKecamatan = e.target.value;
    setKecamatan(selectedKecamatan);
  
    // Pastikan newUser diupdate dengan selectedKecamatan
    setNewUser(prev => ({
      ...prev, 
      kecamatan: selectedKecamatan // Ini kunci perbaikannya
    }));
  };

  const resetPopup = () => {
    setCurrentPopupContent(1);
    setProgressWidth('0%');
  };

  const handleNext = () => {
    if (currentPopupContent() === 1) {
      setProgressWidth('100%');
      setCurrentPopupContent(2);
    }
  };

  const handleCancel = () => {
    resetPopup();
    setShowAddUserPopup(false); // Tutup popup
  };

  const handleCancelEdit = () => {
    resetPopup();
    setEditingUser(false); // Tutup popup
  };

  const handleClose = () => {
    resetPopup(); // Reset state popup
    setShowAddUserPopup(false); // Tutup popup
  };

  const handleCloseEdit = () => {
    resetPopup();
    setEditingUser(false); // Tutup popup
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible());
  };

  const toggleDarkMode = () => {
    const newValue = !isDarkMode(); // Toggle nilai antara true/false
    setIsDarkMode(newValue);
    localStorage.setItem('isDarkMode', JSON.stringify(newValue)); // Simpan perubahan
  };

  onMount(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode)); // Gunakan nilai dari localStorage
    } else {
      setIsDarkMode(false); // Default ke light mode (false)
    }
  });

  const handleClickOutside = (event) => {
    const popup = document.getElementById("popup-menu");
    const arrow = document.querySelector(`.${styles.arrowContainer}`);
    if (popup && !popup.contains(event.target) && !arrow.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
      if (!token) throw new Error('No token found');

      const response = await fetch('http://127.0.0.1:8080/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });

      if (response.ok) {
        localStorage.removeItem('token');  // Remove token from localStorage
        navigate('/');  // Redirect to Homepage.tsx
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "Nama Lengkap", field: "fullname", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Gender", field: "gender", sortable: true, filter: true },
    { headerName: "Gol. darah", field: "bloodtype", sortable: true, filter: true },
    { headerName: "Usia", field: "age", sortable: true, filter: true },
    { headerName: "Pendapatan / bulan", field: "income", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Provinsi", field: "provinsi", sortable: true, filter: true },
    { headerName: "Kabupaten", field: "kabupaten", sortable: true, filter: true },
    { headerName: "Kecamatan", field: "kecamatan", sortable: true, filter: true },
    { headerName: "Verified", field: "is_verified", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const handleEditButtonClick = () => {
          handleEdit(params.data);
        };

        const handleDeleteButtonClick = () => {
          handleDelete(params.data);
        };

        return (
          <div class={styles.actionButtons}>
            <button onClick={handleEditButtonClick} 
            class={styles.editButton}
            >
              Edit
            </button>
            <button onClick={handleDeleteButtonClick} 
            class={styles.deleteButton}
            >
              Hapus
            </button>
          </div>
        );
      },
      width: 150, // Adjust width as needed
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 140,
    filter: true,
    sortable: true,
  };

  const onGridReady = (params) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;
  
    // Set the initial theme based on isDarkMode
    const themeClass = isDarkMode() ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
    params.api.setGridTheme(themeClass);
  
    // Ambil data dari localStorage
    const userData = localStorage.getItem('users');
    if (userData) {
      let rowData = JSON.parse(userData);
      rowData = rowData.map(user => ({
        ...user,
        fullname: `${user.fullname || ''}`,
        age: `${user.age} Tahun`,
        provinsi: user.provinsi || '', // Tambahkan ini
        kabupaten: user.kabupaten || '', // Tambahkan ini
        kecamatan: user.kecamatan || '', // Tambahkan ini
      }));
  
      setRowData(rowData);
      gridApi.setRowData(rowData);
      createDonutChart();
      updateCounts(rowData); // Update counts on initial load
    }
  
    fetchIncomeData();
  };

  createEffect(() => {
    const themeClass = isDarkMode() ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
    if (gridApi) {
      gridApi.setGridTheme(themeClass);
    }
  });

  const fetchIncomeData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/users/pendapatan');
      const data = await response.json();
      const processedData = [
        { income: '< 1.000.000', value: data.less_than_1m },
        { income: '1.000.000', value: data.one_m },
        { income: '2.000.000', value: data.two_m },
        { income: '3.000.000', value: data.three_m },
        { income: '4.000.000', value: data.four_m },
        { income: '5.000.000', value: data.five_m },
        { income: '> 5.000.000', value: data.more_than_5m }
      ];
      setIncomeData(processedData);
      createChart(processedData); // Panggil chart dengan data dari backend
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const fetchBloodTypeData = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8080/users/golonganDarah');
        const data = await response.json();

        // Transforming data to key-value pairs
        const bloodTypeData = data.reduce((acc: Record<string, number>, item: { bloodtype: string, count: number }) => {
            acc[item.bloodtype] = item.count;
            return acc;
        }, {});

        return bloodTypeData;
    } catch (error) {
        console.error("Error fetching blood type data:", error);
        return {};
    }
};

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/users/data');
      const data = await response.json();
  
      // Convert data to match the Ag Grid format
      const formattedData = data.map((user: any) => ({
        id: user.id,
        fullname: user.fullname || '',
        email: user.email || '',
        gender: user.gender || '',
        bloodtype: user.bloodtype || '',
        age: user.age ? `${user.age} Tahun` : '',
        income: user.income || '',
        status: user.status || '',
        provinsi: user.provinsi || '',
        kabupaten: user.kabupaten || '',
        kecamatan: user.kecamatan || '',
        is_verified: user.is_verified ? 'Verified' : 'Not Verified', // Format for Ag Grid
      }));
  
      setRowData(formattedData);
      gridApi.setRowData(formattedData);
      updateCounts(formattedData); // Update counts on initial load
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createDonutChart = async () => {
    // Dispose of any existing root instance
    if (am5.registry.rootElements[0]) {
        am5.registry.rootElements[0].dispose();
    }

    let root = am5.Root.new("donutChartDiv");
    root.setThemes([am5themes_Animated.new(root)]);

    root._logo.dispose();

    // Create chart
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
        innerRadius: am5.percent(50),
        layout: root.verticalLayout
    }));

    // Create series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "bloodtype",
        alignLabels: false
    }));

    series.labels.template.setAll({
      forceHidden: true
    });

    series.ticks.template.setAll({
      forceHidden: true  // This hides the ticks connecting slices to labels
  });

    // Fetch and set data
    const bloodTypeData = await fetchBloodTypeData();
    const chartData = Object.keys(bloodTypeData).map(key => ({
        bloodtype: key,
        value: bloodTypeData[key] || 0
    }));

    series.data.setAll(chartData);

    series.slices.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2
    });

    series.slices.template.adapters.add("fill", (fill, target) => {
      const bloodtype = (target.dataItem.dataContext as { bloodtype: string }).bloodtype;
      switch (bloodtype) {
          case "A":
              return am5.color(0x347AE2);
          case "B":
              return am5.color(0xF8AC44);
          case "AB":
              return am5.color(0x3DC961);
          case "O":
              return am5.color(0x833ECA);
          default:
            return fill;
      }
  });

    // Create legend
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));

    legend.labels.template.setAll({
      text: "{category}" // Only shows the category (blood type) without any value or percentage
    });

    series.appear(1000, 100);

    return () => {
        root.dispose();
    };
};

const createChart = (data) => {
  let root = am5.Root.new("chartdiv");

  root.setThemes([
      am5themes_Animated.new(root)
  ]);

  root._logo.dispose();

  let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft: 5,
          paddingRight: 5
      })
  );

  // Set color based on dark mode
  const axisColor = isDarkMode() ? am5.color(0xFFFFFF) : am5.color(0x000000);

  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  
  cursor.lineX.setAll({
      stroke: axisColor
  });

  cursor.lineY.setAll({
      stroke: axisColor,
      visible: false // This hides the horizontal line if not needed
  });

  let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
      minorGridEnabled: true
  });

  let yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
  });

  xRenderer.labels.template.setAll({
      fill: axisColor,
  });
  xRenderer.grid.template.setAll({
      stroke: axisColor,
  });

  yRenderer.labels.template.setAll({
      fill: axisColor,
  });
  yRenderer.grid.template.setAll({
      stroke: axisColor,
  });

  let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.3,
          categoryField: "income",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
      })
  );

  let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
          maxDeviation: 0.3,
          renderer: yRenderer
      })
  );

  let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          sequencedInterpolation: true,
          categoryXField: "income"
      })
  );

  series.columns.template.setAll({
      width: am5.percent(50),
      fillOpacity: 0.9,
      strokeOpacity: 0
  });

  series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.set("draw", function (display, target) {
      let w = target.getPrivate("width", 0);
      let h = target.getPrivate("height", 0);
      display.moveTo(0, h);
      display.bezierCurveTo(w / 4, h, w / 4, 0, w / 2, 0);
      display.bezierCurveTo(w - w / 4, 0, w - w / 4, h, w, h);
  });

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear(1000);
  chart.appear(1000, 100);
};

const updateChartColors = (chart, series, xRenderer, yRenderer, cursor) => {
  const axisColor = isDarkMode() ? am5.color(0xFFFFFF) : am5.color(0x000000);

  // Update axis and grid colors
  xRenderer.labels.template.setAll({
    fill: axisColor,
  });
  xRenderer.grid.template.setAll({
    stroke: axisColor,
  });

  yRenderer.labels.template.setAll({
    fill: axisColor,
  });
  yRenderer.grid.template.setAll({
    stroke: axisColor,
  });

  // Update cursor line colors
  cursor.lineX.setAll({
    stroke: axisColor,
  });

  cursor.lineY.setAll({
    stroke: axisColor,
  });
};

  const handleEdit = (user) => {
    // Split fullname into firstName and lastName
    const [firstName, lastName] = user.fullname.split(' ');

    setEditingUser({
        ...user,
        firstName: firstName || '', // Set firstName and handle cases where there might be no last name
        lastName: lastName || '',
    });
};

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/users/hapus/${userToDelete().id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedUsers = rowData().filter((u) => u.id !== userToDelete().id); // Filter berdasarkan ID
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setRowData(updatedUsers);
        gridApi.setRowData(updatedUsers);
        setShowDeletePopup(false);
        setUserToDelete(null);
        updateCounts(updatedUsers); // Update counts after delete
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    const user = newUser();
    console.log("User data being sent:", user);
    const fullname = `${user.firstName} ${user.lastName}`; // Gabungkan firstname dan lastname
  
    // Buat objek user yang akan dikirim ke backend
    const userToAdd = {
      fullname,
      email: user.email,
      gender: user.gender,
      bloodtype: user.bloodType,
      age: user.age,
      income: user.income,
      status: user.status,
      provinsi: user.provinsi,
      kabupaten: user.kabupaten,
      kecamatan: user.kecamatan,
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8080/users/tambah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
      });
  
      if (response.ok) {
        const updatedUsers = [...rowData(), userToAdd];
        setRowData(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setShowAddUserPopup(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          gender: 'Laki laki',
          bloodType: 'Tidak ingin memberi tahu',
          age: 0,
          income: '< 1.000.000',
          status: 'Pelajar / mahasiswa',
          provinsi: Object.keys(data)[0],
          kabupaten: Object.keys(data[Object.keys(data)[0]])[0],
          kecamatan: data[Object.keys(data)[0]][Object.keys(data[Object.keys(data)[0]])[0]][0]
        });
        updateCounts(updatedUsers);
        createChart(updatedUsers);
      } else {
        console.error('Failed to add user:', await response.text());
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  const handleSave = async () => {
    const user = editingUser();
  
    // Combine firstName and lastName into fullname
    const fullname = `${user.firstName} ${user.lastName}`;

    // Create an object with the updated data
    const dataToSend = {
        id: user.id,
        fullname: fullname.trim(), // Trim to avoid extra spaces
        gender: user.gender,
        bloodtype: user.bloodtype,
        age: parseInt(user.age, 10), // Ensure age is an integer
        income: user.income,
        status: user.status,
        provinsi: user.provinsi,
        kabupaten: user.kabupaten,
        kecamatan: user.kecamatan
    };

    try {
        const response = await fetch('http://127.0.0.1:8080/users/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            const updatedUsers = rowData().map((existingUser) =>
                existingUser.email === user.email ? { ...existingUser, ...dataToSend } : existingUser
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setRowData(updatedUsers);
            gridApi.setRowData(updatedUsers);
            updateCounts(updatedUsers); // Update counts after save
            createChart(updatedUsers); // Update chart after save
            setEditingUser(false);
        } else {
            console.error('Failed to update user on the server');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

  const updateCounts = (data) => {
    const maleCount = data.filter(user => user.gender === 'Laki laki').length;
    const femaleCount = data.filter(user => user.gender === 'Perempuan').length;
    const pelajarCount = data.filter(user => user.status === 'Pelajar / mahasiswa').length;
    const pekerjaCount = data.filter(user => user.status === 'Pekerja / wirausaha').length;

    setJumlahLakiLaki(maleCount);
    setJumlahPerempuan(femaleCount);
    setJumlahPelajar(pelajarCount);
    setJumlahPekerja(pekerjaCount);
  };

  createEffect(() => {
    updateCounts(rowData());
  });

  onMount(async () => {
    fetchData();
    // Cek apakah elemen untuk chart ada
    const chartKiri = document.getElementById("chartKiri");
    const chartKanan = document.getElementById("chartKanan");
    
    if (!chartKiri || !chartKanan) {
      console.error("Elemen chart tidak ditemukan");
      return;
    }
  
    // Buat div untuk chart
    const chartDiv = document.createElement("div");
    chartDiv.id = "chartdiv";
    chartDiv.style.width = "645px";
    chartDiv.style.height = "255px";
    chartKiri.appendChild(chartDiv);
  
    // Buat div untuk Donut Chart
    const donutChartDiv = document.createElement("div");
    donutChartDiv.id = "donutChartDiv";
    donutChartDiv.style.width = "240px";
    donutChartDiv.style.height = "240px";
    chartKanan.appendChild(donutChartDiv);
  
    try {
      // Fetch dan update data
      const response = await fetch('http://127.0.0.1:8080/users/jumlahPengguna');
      const data = await response.json();
      setJumlahLakiLaki(data.total_lakilaki);
      setJumlahPerempuan(data.total_perempuan);
      setJumlahPelajar(data.total_pelajar);
      setJumlahPekerja(data.total_pekerja);
  
      // Update Donut Chart with blood type data
      await createDonutChart();

      // Membuat dan menampilkan grafik XY Chart
    const incomeData = await fetchIncomeData();
    createChart(incomeData);

    // Simpan referensi ke komponen grafik yang dibutuhkan
    const root = am5.registry.rootElements[0];
    const chart = root.container.children[0];
    const series = chart.series[0];
    const xRenderer = chart.xAxes[0].renderer;
    const yRenderer = chart.yAxes[0].renderer;
    const cursor = chart.cursor;

    // Gunakan createEffect untuk memantau perubahan isDarkMode
    createEffect(() => {
      updateChartColors(chart, series, xRenderer, yRenderer, cursor);
    });

    onCleanup(() => {
      root.dispose();
    });
  
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  });

    return (
      <div class={isDarkMode() ? `${styles.container} ${styles.darkMode}` : styles.container}>
        <div class={styles.sidebar}>
          <div class={styles.logo}>
            <img src={logoMonitor} alt="Logo" />
            <span class={styles.logoText}>Monitor</span>
          </div>
          <div class={styles.menuItem}>
            <img src={chartActive} alt="Dashboard" />
            <span class={styles.textDashboard}>Dashboard</span>
            <div class={styles.tandaBiru}></div>
          </div>
          <div class={styles.menuItem}>
            <img src={bag} alt="Bag" />
            <span class={styles.textSidebar}>Produk</span>
            <img src={arrow} alt="Arrow" class={styles.arrow1} />
          </div>
          <div class={styles.menuItem}>
            <img src={user} alt="Data User" />
            <span class={styles.textSidebar}>Data User</span>
            <img src={arrow} alt="Arrow" class={styles.arrow2} />
          </div>
          <div class={styles.menuItem}>
            <img src={checkout} alt="Riwayat" />
            <span class={styles.textSidebar}>Riwayat</span>
            <img src={indicator} alt="Indicator" class={styles.indicator} />
          </div>
          <div class={styles.menuItem}>
            <img src={settings} alt="Pengaturan" />
            <span class={styles.textSidebar}>Pengaturan</span>
          </div>
          <div class={styles.menu2}>
            <div class={styles.menuItem}>
              <img src={info} alt="Pusat Bantuan" />
              <span class={styles.textSidebar}>Pusat Bantuan</span>
            </div>
            <div class={styles.menuItem}>
              <img src={chat} alt="Hubungi Kami" />
              <span class={styles.textSidebar}>Hubungi Kami</span>
            </div>
            <div class={styles.menuItem} onClick={handleLogout}>
              <img src={logout} alt="Keluar" />
              <span class={styles.logoutText}>Keluar</span>
            </div>
          </div>
        </div>
      <div class={styles.content}>
        <div class={styles.content1}>
            <div class={styles.atas}>
              <h1 class={styles.judul}>Selamat Datang, Irfan</h1>
              <img src={search} alt="Icon Search" class={styles.search} />
              <img src={bell} alt="Icon Bell" class={styles.bell} />
              <img src={avatar} alt="Icon Avatar" class={styles.avatar} />
              <span class={styles.userName}>Irfan Satya</span>
              <div class={styles.arrowContainer} onClick={togglePopup}>
              <img
                src={arrow}
                alt="Icon Arrow"
                class={`${styles.arrowUser} ${isPopupVisible() ? styles.rotated : ''}`}
              />
            </div>
          </div>
          <div>
            <p class={styles.bawah}>Berikut adalah rincian informasi tentang datamu</p>
          </div>
        </div>
    <div class={styles.content2}>
      <div class={styles.boxLakilaki}>
        <span class={styles.jumlah1}>{jumlahLakiLaki()}</span>
        <div class={styles.male}>
          <img src={male} alt="Male" class={styles.iconMale} />
        </div>
        <p class={styles.total1}>Total laki laki</p>
        <img src={arrowHijau} alt="Icon Language" class={styles.language} />
        <span class={styles.terjemahan1}>Total male</span>
      </div>
      <div class={styles.pembatas}></div>
      <div class={styles.boxPerempuan}>
        <span class={styles.jumlah2}>{jumlahPerempuan()}</span>
        <div class={styles.female}>
          <img src={female} alt="Female" class={styles.iconFemale} />
        </div>
        <p class={styles.total2}>Total perempuan</p>
        <img src={arrowHijau} alt="Icon Language" class={styles.language} />
        <span class={styles.terjemahan2}>Total female</span>
      </div>
      <div class={styles.pembatas}></div>
      <div class={styles.boxPelajar}>
        <span class={styles.jumlah3}>{jumlahPelajar()}</span>
        <div class={styles.pelajar}>
          <img src={pelajar} alt="Pelajar" class={styles.iconPelajar} />
        </div>
        <p class={styles.total3}>Pelajar / mahasiswa</p>
        <img src={arrowHijau} alt="Icon Language" class={styles.language} />
        <span class={styles.terjemahan3}>Total students</span>
      </div>
      <div class={styles.pembatas}></div>
      <div class={styles.boxPekerja}>
        <span class={styles.jumlah4}>{jumlahPekerja()}</span>
        <div class={styles.pekerja}>
          <img src={pekerja} alt="Pekerja" class={styles.iconPekerja} />
        </div>
        <p class={styles.total4}>Pekerja / wirausaha</p>
        <img src={arrowHijau} alt="Icon Language" class={styles.language} />
        <span class={styles.terjemahan4}>Total workers</span>
      </div>
    </div>

    <div class={styles.content3}>
      <div class={styles.chartKiri}>
        <div class={styles.headerChart1}>
          <h1 class={styles.textPendapatan}>Pendapatan / bulan</h1>
          <div class={styles.lingkaran}></div>
          <p class={styles.ratarata}>Rata-rata pendapatan</p>
          <div class={styles.opsi}>
            <p class={styles.semua}>Semua</p>
            <img src={arrow} alt="Icon Arrow" class={styles.arrowSemua} />
          </div>
        </div>
        <div id="chartKiri" class={styles.chartPendapatan}></div>
      </div>
      <div class={styles.chartKanan}>
        <div class={styles.headerChart2}>
          <h1 class={styles.textGoldarah}>Gol. darah</h1>
          <div class={styles.totalOpsi}>
            <p class={styles.empat}>4</p>
          </div>
          <img src={more} alt="More" class={styles.more} />
        </div>
        <div id="chartKanan" class={styles.chartGoldarah}></div>
        <div class={styles.keterangan}>
          <div class={styles.warnaA}></div>
          <p class={styles.textA}>A</p>
          <div class={styles.warnaB}></div>
          <p class={styles.textB}>B</p>
          <div class={styles.warnaAB}></div>
          <p class={styles.textAB}>AB</p>
          <div class={styles.warnaO}></div>
          <p class={styles.textO}>O</p>
        </div>
      </div>
    </div>

    <div class={styles.content4}>
      <div class={styles.tableUser}>
        <div class={styles.data}>
          <h1 class={styles.dataPengguna}>Data Pengguna</h1>
          <button class={styles.tambah} onClick={() => setShowAddUserPopup(true)}>Tambah Data</button>
          <div class={styles.opsi2}>
            <p class={styles.semua2}>Semua</p>
            <img src={arrow} alt="Icon Arrow" class={styles.arrowSemua2} />
          </div>
        </div>
        <div style={{ height: '355px', width: '898px', "margin-top": '20px', "margin-left": '20px'}} class={isDarkMode() ? "ag-theme-alpine-dark" : "ag-theme-alpine"}>
          <AgGridSolid
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={rowData()}
            onGridReady={onGridReady}
            animateRows={true}
          />
        </div>
      </div>
    </div>
    <div class={styles.content5}>
      <div class={styles.petaLokasi}>
        <h1 class={styles.textPeta}>Peta Lokasi</h1>
        <div class={styles.letakPeta}><Petalokasi/></div>
      </div>
    </div>
  </div>

      {editingUser() && (
  <div class={styles.popupOverlay}>
    <div class={styles.popup}>
      <div class={styles.progressBarContainer}>
        <div class={styles.progressBar} style={{ width: progressWidth() }}></div>
      </div>
      <div class={styles.popupHeader}>
        <img src={edit} alt="Edit" class={styles.iconHeader}/>
        <h2 class={styles.titleHeader}>Edit Data</h2>
        <img src={close} alt="Close" class={styles.iconClose} onClick={handleCloseEdit} />
      </div>
      <div class={styles.contentContainer}>
        <div class={styles.popupContent} style={{ transform: `translateX(-${(currentPopupContent() - 1) * 100}%)` }}>
          <form class={styles.popupContent1}>
            <div class={styles.inputGroup}>
              <label>Nama depan</label>
              <input
                type="text"
                placeholder="John"
                value={editingUser().firstName}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), firstName: e.target.value })
                }
              />
            </div>
            {/* Input untuk Nama Akhir */}
            <div class={styles.inputGroup}>
              <label>Nama akhir</label>
              <input
                type="text"
                placeholder="Wilson"
                value={editingUser().lastName}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), lastName: e.target.value })
                }
              />
            </div>
            {/* Input untuk Email */}
            <div class={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Masukkan email.."
                value={editingUser().email}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), email: e.target.value })
                }
              />
            </div>
            {/* Input untuk Gender */}
            <div class={styles.inputGroup}>
              <label>Gender</label>
              <select
                value={editingUser().gender}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), gender: e.target.value })
                }
              >
                <option value="Laki laki">Laki laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            {/* Input untuk Golongan Darah */}
            <div class={styles.inputGroup}>
              <label>Gol. darah</label>
              <select
                value={editingUser().bloodtype}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), bloodtype: e.target.value })
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="Tidak ingin memberi tahu">Tidak ingin memberi tahu</option>
              </select>
            </div>
            {/* Input untuk Usia */}
            <div class={styles.inputGroup}>
              <label>Usia</label>
              <input
                type="number"
                placeholder="0"
                value={editingUser().age}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), age: parseInt(e.target.value, 10) })
                }
              />
            </div>
            {/* Input untuk Pendapatan */}
            <div class={styles.inputGroup}>
              <label>Pendapatan</label>
              <select
                value={editingUser().income}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), income: e.target.value })
                }
              >
                <option value="< 1.000.000">&lt; 1.000.000</option>
                <option value="1.000.000">1.000.000</option>
                <option value="2.000.000">2.000.000</option>
                <option value="3.000.000">3.000.000</option>
                <option value="4.000.000">4.000.000</option>
                <option value="5.000.000">5.000.000</option>
                <option value="> 5.000.000">&gt; 5.000.000</option>
              </select>
            </div>
            {/* Input untuk Status */}
            <div class={styles.inputGroup}>
              <label>Status</label>
              <select
                value={editingUser().status}
                class={styles.textInput}
                onInput={(e) =>
                  setEditingUser({ ...editingUser(), status: e.target.value })
                }
              >
                <option value="Pelajar / mahasiswa">Pelajar / mahasiswa</option>
                <option value="Pekerja / wirausaha">Pekerja / wirausaha</option>
              </select>
            </div>
          </form>
          <form class={styles.popupContent2}>
            <div class={styles.inputGroup}>
                <label>Provinsi</label>
                <select
                  class={styles.textInputProvinsi}
                  value={editingUser().provinsi}
                  onInput={(e) => setEditingUser({ ...editingUser(), provinsi: e.target.value })}
                >
                  {Object.keys(data).map((prov) => (
                    <option value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div class={styles.inputGroup}>
                <label>Kabupaten/Kota</label>
                <select
                  class={styles.textInputKabupaten}
                  value={editingUser().kabupaten}
                  onInput={(e) => setEditingUser({ ...editingUser(), kabupaten: e.target.value })}
                >
                  {Object.keys(data[editingUser().provinsi]).map((kab) => (
                    <option value={kab}>{kab}</option>
                  ))}
                </select>
              </div>
              <div class={styles.inputGroup}>
                <label>Kecamatan</label>
                <select
                  class={styles.textInputKecamatan}
                  value={editingUser().kecamatan}
                  onInput={(e) => setEditingUser({ ...editingUser(), kecamatan: e.target.value })}
                >
                  {data[editingUser().provinsi][editingUser().kabupaten].map((kec) => (
                    <option value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
          </form>
        </div>
      </div>
      <div class={styles.popupActions}>
        <button class={styles.cancelButton} onClick={handleCancelEdit}>
          Batalkan
        </button>
        {currentPopupContent() === 1 ? (
                <button onClick={handleNext} class={styles.saveButton}>
                  Berikutnya
                </button>
              ) : (
                <button onClick={handleSave} class={styles.saveButton}>
                  Simpan
                </button>
              )}
      </div>
    </div>
  </div>
)}

      {showDeletePopup() && (
        <div class={styles.popupOverlay}>
          <div class={styles.popupDelete}>
            <p class={styles.confirmText}>Apakah anda yakin ingin menghapus data ini?</p>
            <div class={styles.popupTombol}>
              <button onClick={closeDeletePopup} 
              class={styles.batalkanButton}
              >
                Batalkan
              </button>
              <button onClick={confirmDelete} 
              class={styles.hapusButton}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddUserPopup() && (
  <div class={styles.popupOverlay}>
    <div class={styles.popup}>
      <div class={styles.progressBarContainer}>
        <div class={styles.progressBar} style={{ width: progressWidth() }}></div>
      </div>
      <div class={styles.popupHeader}>
        <img src={tambah} alt="Tambah" class={styles.iconHeader}/>
        <h2 class={styles.titleHeader}>Tambah Data</h2>
        <img src={close} alt="Close" class={styles.iconClose} onClick={handleClose} />
      </div>
      <div class={styles.contentContainer}>
        <div class={styles.popupContent} style={{ transform: `translateX(-${(currentPopupContent() - 1) * 100}%)` }}>
          <form class={styles.popupContent1}>
            <div class={styles.inputGroup}>
              <label>Nama depan</label>
              <input
                type="text"
                placeholder="John"
                value={newUser().firstName}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), firstName: e.target.value })}
              />
            </div>
            <div class={styles.inputGroup}>
              <label>Nama akhir</label>
              <input
                type="text"
                placeholder="Wilson"
                value={newUser().lastName}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), lastName: e.target.value })}
              />
            </div>
            <div class={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Masukkan email.."
                value={newUser().email}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), email: e.target.value })}
              />
            </div>
            <div class={styles.inputGroup}>
              <label>Gender</label>
              <select
                value={newUser().gender}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), gender: e.target.value })}
              >
                <option value="Laki laki">Laki laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div class={styles.inputGroup}>
              <label>Gol. darah</label>
              <select
                value={newUser().bloodType}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), bloodType: e.target.value })}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="Tidak ingin memberi tahu">Tidak ingin memberi tahu</option>
              </select>
            </div>
            <div class={styles.inputGroup}>
              <label>Usia</label>
              <input
                type="number"
                placeholder="0"
                value={newUser().age}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), age: parseInt(e.target.value, 10) })}
              />
            </div>
            <div class={styles.inputGroup}>
              <label>Pendapatan</label>
              <select
                value={newUser().income}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), income: e.target.value })}
              >
                <option value="< 1.000.000">&lt; 1.000.000</option>
                <option value="1.000.000">1.000.000</option>
                <option value="2.000.000">2.000.000</option>
                <option value="3.000.000">3.000.000</option>
                <option value="4.000.000">4.000.000</option>
                <option value="5.000.000">5.000.000</option>
                <option value="> 5.000.000">&gt; 5.000.000</option>
              </select>
            </div>
            <div class={styles.inputGroup}>
              <label>Status</label>
              <select
                value={newUser().status}
                class={styles.textInput}
                onInput={(e) => setNewUser({ ...newUser(), status: e.target.value })}
              >
                <option value="Pelajar / mahasiswa">Pelajar / mahasiswa</option>
                <option value="Pekerja / wirausaha">Pekerja / wirausaha</option>
              </select>
            </div>
          </form>
          <form class={styles.popupContent2}>
            <div class={styles.inputGroup}>
                <label>Provinsi</label>
                <select class={styles.textInputProvinsi} value={provinsi()} onInput={handleProvinsiChange}>
                  {Object.keys(data).map((prov) => (
                  <option value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div class={styles.inputGroup}>
                <label>Kabupaten/Kota</label>
                <select class={styles.textInputKabupaten} value={kabupaten()} onInput={handleKabupatenChange}>
                  {Object.keys(data[provinsi()]).map((kab) => (
                  <option value={kab}>{kab}</option>
                  ))}
                </select>
              </div>
              <div class={styles.inputGroup}>
                <label>Kecamatan</label>
                <select class={styles.textInputKecamatan} value={kecamatan()} onInput={(e) => { setKecamatan(e.target.value); handleKecamatanChange(e); }}>
                  {data[provinsi()][kabupaten()].map((kec) => (
                  <option value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
          </form>
        </div>
      </div>
      <div class={styles.popupActions}>
      <button onClick={handleCancel} class={styles.cancelButton}>
                Batalkan
              </button>
              {currentPopupContent() === 1 ? (
                <button onClick={handleNext} class={styles.saveButton}>
                  Berikutnya
                </button>
              ) : (
                <button onClick={handleAddUser} class={styles.saveButton}>
                  Tambah
                </button>
              )}
      </div>
    </div>
  </div>
)}
{isPopupVisible() && (
        <div id="popup-menu" class={styles.detailPopup}>
          <div class={styles.posisiItem}>
            <div class={styles.popupItem}>
              <img src={editProfil} alt="Edit Profil" class={styles.popupIcon} />
              <span>Edit Profil</span>
            </div>
            <div class={styles.popupItem}>
              <img src={temaGelap} alt="Tema Gelap" class={styles.popupIcon} />
              <span>Tema Gelap</span>
              <label class={styles.toggleswitch}>
                <input type="checkbox" onChange={toggleDarkMode} checked={isDarkMode()} />
                <div class={styles.toggleswitchbackground}>
                  <div class={styles.toggleswitchhandle}></div>
                </div>
              </label>
            </div>
            <div class={styles.popupItem}>
              <img src={pengaturan} alt="Pengaturan" class={styles.popupIcon} />
              <span>Pengaturan</span>
            </div>
            <div class={styles.popupItem} onClick={handleLogout}>
              <img src={keluar} alt="Keluar" class={styles.popupIcon} />
              <span>Keluar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;