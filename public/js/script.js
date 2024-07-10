$(document).ready(function() {
  // Seedrandom
  $('#btn-seed').click(function() {
    const seed = $('#seed').val();
    if (seed === '') {
      alert('Masukkan Angka');
      return;
    }
    const rng = new Math.seedrandom(seed);
    const randomNum = rng();
    const formattedNum = randomNum.toString().slice(2);
    const decimalLength = formattedNum.length;
    // Memasukkan hasil seed ke dalam Tabel
    const emptyRow = $('#table-body tr').filter(function() {
      return $(this).children('td').eq(0).text() === '';
    }).first();
    if (emptyRow.length > 0) {
      emptyRow.children('td').eq(0).text(seed);
      emptyRow.children('td').eq(1).text(formattedNum);
      emptyRow.children('td').eq(2).text(decimalLength);
    } else {
      alert('Tabel Sudah Penuh.');
    }
    $('#seed').val('');
    // Memasukkan hasil seed ke dalam elemen Prediksi
    $('#inp-seed').text(seed);
    $('#res-seed').text(formattedNum);
    $('.2d, .1d').val('');
  });

  $('#table-body').on('click', 'td:last-child', function() {
    $(this).siblings('td').text('');
    // $('#inp-seed').text('----');
    // $('#res-seed').text('-----------------');
  });

  // Menghitung jumlah Ball yang di isi (2D)
  $('.2d').on('input', function() {
    let count = 0;
    $('.2d').each(function() {
      if ($(this).val() !== '') {
        count++;
      }
    });
    $('#jml-2d').text(count);
  });

  // Menghitung jumlah Ball yang di isi (1D)
  $('.1d').on('input', function() {
    let count2 = 0;
    $('.1d').each(function() {
      if ($(this).val() !== '') {
        count2++;
      }
    });
    $('#jml-1d').text(count2);
  });

  // Maxlength 2D
  $('.ball').on('input', function() {
    const maxLength = 2;
    const value = $(this).val();

    if (value.length > maxLength) {
      $(this).val(value.slice(0, maxLength));
    }
  });

  // Maxlength 1D
  $('.maxlength1').on('input', function() {
    const maxLength = 1;
    const value = $(this).val();

    if (value.length > maxLength) {
      $(this).val(value.slice(0, maxLength));
    }
  });

  // Tombol Reset
  $('#btn-reset').click(function() {
    $('.2d, .1d').val(''); // Reset semua input dengan class 2d dan 1d
    $('#jml-2d, #jml-1d').text('--'); // Reset teks jumlah
    // $('#inp-seed').text('----'); // Reset seed prediksi
    // $('#res-seed').text('-----------------'); // Reset hasil prediksi
  });

  // Tombol Simpan
$('#btn-save').click(function() {
    const seed = $('#inp-seed').text();
    const data2D = [];
    $('.2d').each(function() {
        const value = $(this).val();
        if (value) {
            data2D.push(value);
        }
    });
    const data1D = [];
    $('.1d').each(function() {
        const value = $(this).val();
        if (value) {
            data1D.push(value);
        }
    });

    // Validasi untuk memastikan data tidak kosong
    if (data2D.length === 0 || data1D.length === 0) {
        alert('Masukkan data ke dalam semua ball sebelum menyimpan.');
        return;
    }

    const data = {
        seed: seed,
        data2D: data2D,
        data1D: data1D,
        timestamp: new Date().toISOString(),
        status: "neutral"
    };

    $.ajax({
        type: 'POST',
        url: '/save',
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

  // Tombol Histori
  $('#btn-his').click(function() {
    window.location.href = '/history';
  });
});