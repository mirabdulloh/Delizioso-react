import axios from "axios";
import { serverApi } from "../../lib/config";

export interface Notification {
  _id: string;
  type: "admin-reply" | "low-rating" | "update-requested" | "order-status";
  message: string;
  read: boolean;
  readAt?: Date;
  reviewId?: string;
  orderId?: string;
  createdAt: Date;
  timestamp?: Date;
}

class NotificationService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const url = `${this.path}/notification/unread`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getUnreadNotifications:", result.data);
      return result.data || [];
    } catch (err) {
      console.log("NotificationService - getUnreadNotifications error:", err);
      return [];
    }
  }

  public async getAllNotifications(
    limit: number = 50,
    skip: number = 0
  ): Promise<Notification[]> {
    try {
      const url = `${this.path}/notification/all?limit=${limit}&skip=${skip}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getAllNotifications:", result.data);
      return result.data || [];
    } catch (err) {
      console.log("NotificationService - getAllNotifications error:", err);
      return [];
    }
  }

  public async markAsRead(notificationId: string): Promise<Notification | null> {
    try {
      const url = `${this.path}/notification/${notificationId}/read`;
      const result = await axios.patch(url, {}, { withCredentials: true });
      console.log("markAsRead:", result.data);
      return result.data;
    } catch (err) {
      console.log("NotificationService - markAsRead error:", err);
      return null;
    }
  }

  public async markAllAsRead(): Promise<any> {
    try {
      const url = `${this.path}/notification/read-all`;
      const result = await axios.patch(url, {}, { withCredentials: true });
      console.log("markAllAsRead:", result.data);
      return result.data;
    } catch (err) {
      console.log("NotificationService - markAllAsRead error:", err);
      return null;
    }
  }

  public async deleteNotification(notificationId: string): Promise<any> {
    try {
      const url = `${this.path}/notification/${notificationId}`;
      const result = await axios.delete(url, { withCredentials: true });
      console.log("deleteNotification:", result.data);
      return result.data;
    } catch (err) {
      console.log("NotificationService - deleteNotification error:", err);
      return null;
    }
  }
}

export default NotificationService;
