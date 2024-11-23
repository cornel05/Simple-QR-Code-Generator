$("#generateQR").click(function () {
  var url = $("#urlInput").val();
  if (url.trim() === "") {
    alert("Please enter URL!");
  } else {
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
  }
});

if ("showSaveFilePicker" in window) {
  console.log("Using File System Access API");
  saveDialog();
} else {
  blob();
}

// Function to fetch QR code image data and create a blob
async function fetchQRCodeBlob() {
  const qrImage = document.querySelector("#qrImage img");
  if (!qrImage) {
    throw new Error("QR code image not found");
  }

  const response = await fetch(qrImage.src);
  return await response.blob();
}

// Function to handle blob download
async function blob() {
  $("#downloadQR").click(async function (event) {
    event.preventDefault();

    try {
      const blob = await fetchQRCodeBlob();

      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr_img.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  });
}

// Function to handle file save dialog using File System Access API
async function saveDialog() {
  $("#downloadQR").click(async function (event) {
    event.preventDefault();

    try {
      const blob = await fetchQRCodeBlob();

      // Use the File System Access API to show a save file dialog
      const handle = await window.showSaveFilePicker({
        suggestedName: "qr_img.png",
        types: [
          {
            description: "PNG Image",
            accept: { "image/png": [".png"] },
          },
        ],
      });

      // Create a writable stream and write the blob to it
      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    } catch (error) {
      console.error("Error saving file:", error);
    }
  });
}