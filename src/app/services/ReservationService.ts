import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "";

export interface ReservationInput {
  dateTime: string;
  peopleCount: number;
  note?: string;
  email: string;
  name: string;
  phoneNumber: string;
}

export interface ReservationUpdateInput {
  _id: string;
  reservationStatus: string;
  cancelReason?: string;
}

class ReservationService {
  async createReservation(data: ReservationInput) {
    const res = await axios.post(`${API_BASE}/member/create/reservation`, data, { withCredentials: true });
    return res.data;
  }

  async getAllReservations() {
    const res = await axios.get(`${API_BASE}/getAll/reservations`, { withCredentials: true });
    return res.data;
  }

  async updateReservation(data: ReservationUpdateInput) {
    const res = await axios.post(`${API_BASE}/reservation/update`, data, { withCredentials: true });
    return res.data;
  }
}

export default ReservationService;
