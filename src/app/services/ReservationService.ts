import axios from "axios";
import { serverApi } from "../../lib/config";

export interface ReservationInput {
  date: string;
  time: string;
  partySize: string;
}

export interface Reservation {
  _id: string;
  date: string;
  time: string;
  partySize: string;
  createdAt: string;
  // add more fields as needed
}

class ReservationService {
  async createReservation(input: ReservationInput) {
    const res = await axios.post(`${serverApi}/reservation/create`, input, {
      withCredentials: true,
    });
    return res.data;
  }

  async getMyReservations() {
    const res = await axios.get(`${serverApi}/reservation/my`, {
      withCredentials: true,
    });
    return res.data;
  }

  // Add more methods as needed (cancel, update, etc)
}

export default ReservationService;
