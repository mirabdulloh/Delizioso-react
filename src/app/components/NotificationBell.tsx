import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSocket } from "../context/SocketContext";

interface Notification {
  id: string;
  type: "admin-reply" | "low-rating" | "update-requested";
  message: string;
  timestamp: Date;
  read: boolean;
  reviewId?: string;
}

const NotificationBell: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!socket || !isConnected) return;

    // ✅ 1) one handler (so off() works correctly)
    const onAdminReply = (data: {
      reviewId: string;
      message: string;
      timestamp: Date;
    }) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "admin-reply",
        message: `Admin replied to your review: "${data.message.substring(0, 50)}${data.message.length > 50 ? "..." : ""}"`,
        timestamp: new Date(data.timestamp),
        read: false,
        reviewId: data.reviewId,
      };

      setNotifications((prev) => [notification, ...prev]);
      setCurrentNotification(notification.message);
      setSnackbarOpen(true);
    };

    const onLowRating = (data: {
      reviewId: string;
      memberNick: string;
      productName: string;
      rating: number;
      comment?: string;
      timestamp: Date;
    }) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "low-rating",
        message: `⚠️ Low rating (${data.rating}⭐) from ${data.memberNick} on ${data.productName}`,
        timestamp: new Date(data.timestamp),
        read: false,
        reviewId: data.reviewId,
      };

      setNotifications((prev) => [notification, ...prev]);
      setCurrentNotification(notification.message);
      setSnackbarOpen(true);
    };

    const onUpdateRequested = (data: {
      reviewId: string;
      message: string;
      timestamp: Date;
    }) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "update-requested",
        message: data.message,
        timestamp: new Date(data.timestamp),
        read: false,
        reviewId: data.reviewId,
      };

      setNotifications((prev) => [notification, ...prev]);
      setCurrentNotification(notification.message);
      setSnackbarOpen(true);
    };

    // ✅ 2) listen to multiple possible event names (backend mismatch fix)
    socket.on("review:admin-reply", onAdminReply);
    socket.on("review:adminReply", onAdminReply);
    socket.on("review:admin_reply", onAdminReply);

    socket.on("review:low-rating", onLowRating);
    socket.on("review:lowRating", onLowRating);
    socket.on("review:low_rating", onLowRating);

    socket.on("review:update-requested", onUpdateRequested);
    socket.on("review:updateRequested", onUpdateRequested);
    socket.on("review:update_requested", onUpdateRequested);

    return () => {
      socket.off("review:admin-reply", onAdminReply);
      socket.off("review:adminReply", onAdminReply);
      socket.off("review:admin_reply", onAdminReply);

      socket.off("review:low-rating", onLowRating);
      socket.off("review:lowRating", onLowRating);
      socket.off("review:low_rating", onLowRating);

      socket.off("review:update-requested", onUpdateRequested);
      socket.off("review:updateRequested", onUpdateRequested);
      socket.off("review:update_requested", onUpdateRequested);
    };
  }, [socket, isConnected]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications([]); // Clear all notifications
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 350, maxHeight: 400, overflow: "auto" }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={markAllAsRead}
              >
                Mark all as read
              </Typography>
            )}
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read
                        ? "transparent"
                        : "action.hover",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(
                        notification.timestamp,
                      ).toLocaleString()}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: notification.read ? 400 : 600,
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {currentNotification}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationBell;
