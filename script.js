jQuery(document).ready(function ($) {
  $("form").submit((e) => {
    e.preventDefault();
    let imagesInputFiles = $("#images")[0].files;
    let backgroundsInputFiles = $("#backgrounds")[0].files;
    let imageFiles = [];
    let backgroundFiles = [];

    for (let i = 0; i < imagesInputFiles.length; i++) {
      const image = imagesInputFiles[i];

      imageFiles.push(image);
    }

    for (let i = 0; i < backgroundsInputFiles.length; i++) {
      const background = backgroundsInputFiles[i];

      backgroundFiles.push(background);
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      let imgReader = new FileReader();

      imgReader.onload = ((imgFile) => {
        return (e) => {
          let imgFileUrl = e.target.result;

          for (let j = 0; j < backgroundFiles.length; j++) {
            const backgroundFile = backgroundFiles[j];
            const imgName =
              backgroundFile.name.replace(".jpg", "").replace(".png", "") +
              "-" +
              imageFile.name.replace(".png", "") +
              "-" +
              (j + 1) +
              ".png";
            let bgReader = new FileReader();

            bgReader.onload = ((bgFile) => {
              return (e) => {
                let bgFileUrl = e.target.result;

                changeImageBackground(imgFileUrl, bgFileUrl, imgName);
              };
            })(backgroundFile);
            bgReader.readAsDataURL(backgroundFile);
          }
        };
      })(imageFile);
      imgReader.readAsDataURL(imageFile);
    }
  });

  const changeImageBackground = (imgFileUrl, bgFileUrl, imgName) => {
    let background = new Image();
    background.onload = function () {
      // Create a canvas element
      let canvas = document.createElement("canvas");
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;

      let ratioX = canvas.width / background.naturalWidth;
      let ratioY = canvas.height / background.naturalHeight;
      let ratio = Math.min(ratioX, ratioY);

      // Get the context of the canvas
      let context = canvas.getContext("2d");

      let image = new Image();
      image.onload = function () {
        // Set the canvas background to the loaded background image
        context.drawImage(
          background,
          0,
          0,
          background.naturalWidth * ratio,
          background.naturalHeight * ratio
        );

        let imageRatioX = canvas.width / image.naturalWidth;
        let imageRatioY = canvas.height / image.naturalHeight;
        let imageRatio = Math.min(imageRatioX, imageRatioY);

        // Draw the PNG image on the canvas
        context.drawImage(
          image,
          (background.naturalWidth * ratio - image.naturalWidth * imageRatio) /
            2,
          (background.naturalHeight * ratio -
            image.naturalHeight * imageRatio) /
            2,
          image.naturalWidth * imageRatio,
          image.naturalHeight * imageRatio
        );

        let imgUrl = canvas.toDataURL();

        // Draw the canvas on the page
        $(".generated-images").append(`<img src="${imgUrl}">`);

        // Download the canvas as png
        let link = document.createElement("a");
        link.download = imgName;
        link.href = imgUrl;
        link.click();
      };
      image.src = imgFileUrl;
    };
    background.src = bgFileUrl;
  };
});
