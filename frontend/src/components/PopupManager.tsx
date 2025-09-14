import React, { useState, useEffect } from 'react';
import PopupForm from './PopupForm';

const PopupManager = () => {
  // DISABLED: Popup is now hidden by default
  // const [showPopup, setShowPopup] = useState(false);
  // const [hasSubmitted, setHasSubmitted] = useState(false);

  // useEffect(() => {
  //   // Check if user has already submitted the form
  //   const formSubmitted = localStorage.getItem('amberGlobalFormSubmitted');
  //   const sessionSubmitted = sessionStorage.getItem('amberGlobalFormSubmitted');
    
  //   if (formSubmitted === 'true' || sessionSubmitted === 'true') {
  //     setHasSubmitted(true);
  //     return;
  //   }

  //   // Show popup after 12 seconds if not submitted
  //   const timer = setTimeout(() => {
  //     if (!hasSubmitted) {
  //       setShowPopup(true);
  //     }
  //   }, 12000);

  //   return () => clearTimeout(timer);
  // }, [hasSubmitted]);

  // const handleFormSubmit = () => {
  //   // Mark as submitted in both session and local storage
  //   sessionStorage.setItem('amberGlobalFormSubmitted', 'true');
  //   localStorage.setItem('amberGlobalFormSubmitted', 'true');
  //   setHasSubmitted(true);
  //   setShowPopup(false);
  // };

  // const handleClose = () => {
  //   setShowPopup(false);
    
  //   // Show again after 20 seconds if not permanently submitted
  //   if (!hasSubmitted) {
  //     setTimeout(() => {
  //       const formSubmitted = localStorage.getItem('amberGlobalFormSubmitted');
  //       if (formSubmitted !== 'true') {
  //         setShowPopup(true);
  //       }
  //     }, 20000);
  //   }
  // };

  // // Don't render popup if user has submitted before
  // if (hasSubmitted) {
  //   return null;
  // }

  // return (
  //   <PopupForm
  //     isVisible={showPopup}
  //     onClose={handleClose}
  //     onSubmit={handleFormSubmit}
  //   />
  // );

  // Return null to hide the popup completely
  return null;
};

export default PopupManager;