/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from "inquirer";
import fs from "fs";
import qr from "qr-image";

// inquirer.prompt([
//   {
//     type: 'password',
//     name: 'order',
//     message: 'What do you want to order?'
//   }
// ]).then(answers => {
//   console.log(`You ordered: ${answers.order}`);
// });
inquirer
  .prompt([
    /* Pass your questions in here */
    {
      name: "inputURL",
      message: "Please enter your link to generate a QR code:",
    },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    fs.writeFile("URL.txt", answers.inputURL, (err) => {
      if (err) {
        console.error("Error writing to file", err);
      } else {
      }
    });
    const url = answers.inputURL;
    
    const qr_image = qr.image(url, {type: 'png'});
    qr_image.pipe(fs.createWriteStream('qr_img.png'));
    
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("Could not process your order. Please try again.");
    } else {
      // Something else went wrong
      console.log("Try again!");
    }
  });