/** SweetAlertHandling - Enhanced Version **/
import Swal from "sweetalert2";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Messages } from "./config";

// Common styling configuration
const swalConfig = {
  customClass: {
    container: "swal-container",
    popup: "swal-popup",
    htmlContainer: "swal-html-container",
    title: "swal-title",
    closeButton: "swal-close-button",
  },
};

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    showConfirmButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Got it",
    allowOutsideClick: false,
    allowEscapeKey: true,
    ...swalConfig,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    toast: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    ...swalConfig,
  });
};

export const sweetTopSmallSuccessAlert = async (
  productName: string,
  duration: number = 2000
) => {
  await Swal.fire({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: false,
    background: "#f3fbf6",
    customClass: {
      popup: "custom-toast-success",
      title: "custom-toast-title",
      closeButton: "custom-toast-close",
    },
    html: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 2rem; color: #217a3c; display: flex; align-items: center;">
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='#eafaf1'/><path d='M17.5 9.5l-5.25 5.25L8 10.5' stroke='#217a3c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>
        </span>
        <span style="font-size: 1.2rem; color: #217a3c;"><b>${productName}</b> added to cart!</span>
      </div>
    `,
    showCloseButton: true,
  });
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text: msg,
    showConfirmButton: show_button,
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
    allowOutsideClick: false,
    allowEscapeKey: true,
    ...swalConfig,
  }).then((result) => {
    if (result.isConfirmed && forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};

// Additional useful alert functions
export const sweetSuccessAlert = async (
  title: string,
  text: string = ""
) => {
  await Swal.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
    ...swalConfig,
  });
};

export const sweetWarningAlert = async (
  title: string,
  text: string = ""
) => {
  const result = await Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    ...swalConfig,
  });
  return result.isConfirmed;
};

export const sweetInfoAlert = async (
  title: string,
  text: string = ""
) => {
  await Swal.fire({
    icon: "info",
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
    ...swalConfig,
  });
};

export const sweetLoadingAlert = async (
  title: string = "Loading...",
  text: string = "Please wait"
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: undefined,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: async () => {
      Swal.showLoading();
    },
    ...swalConfig,
  });
};

export const sweetCloseLoading = () => {
  Swal.close();
};
