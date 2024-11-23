$("#generateQR").click(function () {
  var url = $("#urlInput").val();
  if (url.trim() === "")
      alert("Please enter URL!");
  if (url.trim() !== "") {
    // Clear previous QR code
    $("#qrImage").empty();

    // Generate the QR code
    new QRCode(document.getElementById("qrImage"), {
      text: url,
      width: 100,
      height: 100,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Display the QR code
    $("#qrImage").show();
    $("#downloadQR").show();
  } else {
    console.log("Please enter a URL.");
  }
});

$("#downloadQR").click(async function (event) {
  event.preventDefault();

  try {
    // Create a file handle
    const fileHandle = await window.showSaveFilePicker({
      startIn: "downloads",
      suggestedName: 'qr_img.png',
      types: [{
        description: 'PNG Image',
        accept: {'image/png': ['.png']}
      }]
    });

    // Create a writable stream
    const writableStream = await fileHandle.createWritable();

    // Get the QR code image data
    const qrImage = document.getElementById('qrImage').querySelector('img');
    const response = await fetch(qrImage.src);
    const blob = await response.blob();

    // Write the QR code image data to the file
    await writableStream.write(blob);

    // Close the writable stream
    await writableStream.close();
  } catch (error) {
    console.error('Error saving file:', error);
  }
});