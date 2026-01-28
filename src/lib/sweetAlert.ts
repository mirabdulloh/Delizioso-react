/** SweetAlertHandling - Enhanced Version **/
import Swal from "sweetalert2";
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
  msg: string,
  duration: number = 2000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    ...swalConfig,
  });

  await Toast.fire({
    icon: "success",
    title: msg,
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
