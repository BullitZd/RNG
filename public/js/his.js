$(document).ready(function() {
  $('.btn-true').on('click', function() {
    const historyItem = $(this).closest('.history-item');
    const index = historyItem.data('index');
    console.log(`Tombol benar diklik untuk indeks: ${index}`);
    updateStatus(index, 'true', historyItem);
  });

  $('.btn-false').on('click', function() {
    const historyItem = $(this).closest('.history-item');
    const index = historyItem.data('index');
    console.log(`Tombol salah diklik untuk indeks: ${index}`);
    updateStatus(index, 'false', historyItem);
  });

  $('#btn-clear-history').on('click', function() {
    $.ajax({
      url: '/clear-history',
      type: 'DELETE',
      success: function(result) {
        window.location.reload();
      },
      error: function(err) {
        console.error('Error clearing history:', err);
      }
    });
  });

  function updateStatus(index, status, historyItem) {
    console.log(`Mengirim pembaruan untuk indeks: ${index}, status: ${status}`); // Logging
    $.ajax({
      url: '/update-status',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ index, status }),
      success: function(response) {
        console.log(response); // Logging
        if (status === 'true') {
          historyItem.css('background-color', 'green');
        } else if (status === 'false') {
          historyItem.css('background-color', 'red');
        }
        historyItem.find('.btn-container').remove();
      },
      error: function(err) {
        console.error('Error updating status:', err);
      }
    });
  }
});
