$(document).ready(function() {
  let formattedNum;

  $('#inp-seed').keypress(function(event) {
    if (event.which === 13) { // 13 adalah kode tombol Enter
      $('#btn-seed').click();
    }
  });

  $('#btn-seed').click(function() {
    const seed = $('#inp-seed').val();
    
    if (seed === '') {
      alert('Masukkan Angka');
      return;
    }
    
    const rng = new Math.seedrandom(seed);
    const randomNum = rng();
    formattedNum = randomNum.toString().split('.')[1] || ''; // Mengambil bagian setelah titik desimal
    
    $('#seed').text(seed);
    $('#result-seed').text(formattedNum);
    $('#inp-seed').val('');
    $('#jml-2d').text('--');
    $('#jml-1d').text('--');

    // Menghasilkan 2 digit angka setelah mendapatkan formattedNum
    const res2d = generate2d(formattedNum);
    const res1d = generate1d(formattedNum);
    
    // Memasukkan angka 2 digit ke dalam elemen ball
    $('.2d').each(function(index) {
      if (index < res2d.length) {
        $(this).text(res2d[index]);
        $('#jml-2d').text(res2d.length);
      } else {
        $(this).text(''); // Mengosongkan elemen jika tidak ada nilai lagi
      }
    });
    
    // Memasukkan angka 1 digit ke dalam elemen ball
    $('.1d').each(function(index) {
      if (index < res1d.length) {
        $(this).text(res1d[index]);
        $('#jml-1d').text(res1d.length);
      } else {
        $(this).text(''); // Mengosongkan elemen jika tidak ada nilai lagi
      }
    });
  });
  
  //Menyimpan data ball
  $('#save-ball').click(function() {
    const seed = $('#seed').text();
    const date = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayNames[date.getDay()];
    
    const data2D = [];
    $('.2d').each(function() {
        const value = $(this).text();
        if (value) {
            data2D.push(value);
        }
    });
    const data1D = [];
    $('.1d').each(function() {
        const value = $(this).text();
        if (value) {
            data1D.push(value);
        }
    });
    
    if (seed === '----') {
        alert('Masukkan data');
        return;
    }
    
    let data = {
      seed: seed,
      date: formattedDate,
      data2D: data2D,
      data1D: data1D,
      status: 'neutral'
    };
    
    $.ajax({
        type: 'POST',
        url: '/save-ball',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            alert(response);
        },
        error: function(error) {
            alert('Error:' + error.responseText);
        }
    });
  });
  
  // Menampilkan halaman histori
  $('#history').click(function() {
    window.location.href = '/history';
  });
  
  //Menambahkan data kedalam tabel
  $('#inp-table').keypress(function(event) {
    if (event.which === 13) { // 13 adalah kode tombol Enter
      $('#btn-table').click();
    }
  });
  
  $('#btn-table').click(function() {
    const seedTable = $('#inp-table').val();
    if (seedTable === '') {
      alert('Masukkan Angka Keluaran');
      return;
    }
    
    const date = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayNames[date.getDay()];
    
    const newRow = {
      // no: 0, // No akan diatur saat mengambil data dari server
      tanggal: formattedDate,
      hari: dayName,
      pasaran: "HK",
      result: seedTable
    };
    
    // Kirim data ke server untuk disimpan
    $.ajax({
      url: '/add-data-table',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newRow),
      success: function(data) {
        //Menampilkan data ke tabel setelah disimpan
        addRowToTable(data);
        alert('Data berhasil di simpan.');
        $('#inp-table').val('');
      },
      error: function(err) {
        console.error(err);
      }
    });
  });

  // Menghasilkan 2 digit angka
  function generate2d(inpNum2d) {
    let numbers2d = [];
    
    for (let i = 0; i < inpNum2d.length - 1; i++) {
      let number2d = inpNum2d.substring(i, i + 2);
      numbers2d.push(number2d);
    }
    
    numbers2d.sort((a, b) => parseInt(a) - parseInt(b)); // Mengurutkan sebagai angka
    return numbers2d;
  }
  
  // Menghasilkan 1 digit angka
  function generate1d(inpNum1d) {
    const allNumbers = [...Array(10).keys()].map(String); // Membuat array string "0" sampai "9"
    const missingNumbers = allNumbers.filter(number => !inpNum1d.includes(number));
    return missingNumbers;
  }

  // Menampilkan data kedalam tabel
  function addRowToTable(row) {
    const rowHtml = `
      <tr>
        <td style="color:green;border-bottom:1px solid black;">${row.tanggal}</td>
        <td style="color:green;border-bottom:1px solid black;">${row.hari}</td>
        <td style="color:#080090;border-bottom:1px solid black;">${row.pasaran}</td>
        <th style="border-bottom:1px solid black;">${row.result}</th>
      </tr>
    `;
    $('#result-table #tb-result').append(rowHtml);
  }

  // Memuat data tabel saat halaman dimuat
  function loadTableData() {
    $.ajax({
      url: '/data-table',
      method: 'GET',
      success: function(data) {
        data.forEach(row => addRowToTable(row));
      },
      error: function(err) {
        console.error(err);
      }
    });
  }

  // Panggil fungsi loadTableData saat dokumen siap
  loadTableData();
});
