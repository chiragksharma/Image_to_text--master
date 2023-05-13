import React, { useState } from "react";
import Cropper from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import ReactCrop from 'react-easy-crop';
import Modal from 'react-modal';
import Button  from "@mui/material/Button";

function ImageCropDialog(props) {
  const { imageSrc, aspectRatio, onClose, onCrop } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels);
    onCrop(croppedImage);
    onClose();
  };

  const getCroppedImage = (imageSrc, croppedAreaPixels) => {
    const canvas = document.createElement("canvas");
    const scaleX = imageSrc.naturalWidth / imageSrc.width;
    const scaleY = imageSrc.naturalHeight / imageSrc.height;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageSrc,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    return base64Image;
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <Button onClick={handleSave}>Save</Button>
    </Dialog>
  );
}

export default ImageCropDialog;