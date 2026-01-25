import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/chat.css";

type Msg = {
  id: string;
  from: "user" | "admin" | "ai" | "system";
  text: string;
  time: number;
};

function ChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"ai" | "admin">("ai");
  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const addSystem = (t: string) => {
    setMsgs((m) => [
      ...m,
      { id: `sys-${Date.now()}`, from: "system", text: t, time: Date.now() },
    ]);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, open]);

  useEffect(() => {
    if (!open) return;

    const url = (window as any).__CS_SOCKET_URL__ as string | undefined;
    if (!url) {
      // demo welcome messages
      setTimeout(() => {
        setMsgs((m) => [
          ...m,
          {
            id: "m-welcome-ai",
            from: "ai",
            text: "Hi — I can help with Italian food and menu questions.",
            time: Date.now(),
          },
          {
            id: "m-welcome-admin",
            from: "admin",
            text: "Hello — support is available during opening hours.",
            time: Date.now(),
          },
        ]);
      }, 300);
      return;
    }

    // connect WebSocket
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.addEventListener("open", () => {
        setMsgs((m) => [
          ...m,
          {
            id: `sys-${Date.now()}`,
            from: "admin",
            text: "Connected to support.",
            time: Date.now(),
          },
        ]);
      });

      ws.addEventListener("message", (ev) => {
        let payload = ev.data;
        try {
          const parsed = JSON.parse(ev.data);
          payload = parsed.text ?? ev.data;
        } catch {}
        setMsgs((m) => [
          ...m,
          {
            id: `s-${Date.now()}`,
            from: "admin",
            text: String(payload),
            time: Date.now(),
          },
        ]);
      });

      ws.addEventListener("close", () => {
        setMsgs((m) => [
          ...m,
          {
            id: `sys-${Date.now()}`,
            from: "admin",
            text: "Support disconnected.",
            time: Date.now(),
          },
        ]);
      });

      return () => {
        ws.close();
        wsRef.current = null;
      };
    } catch (e) {
      // ignore
    }
  }, [open]);

  const send = () => {
    if (!text.trim()) return;

    const myMsg: Msg = {
      id: `u-${Date.now()}`,
      from: "user",
      text: text.trim(),
      time: Date.now(),
    };

    setMsgs((m) => [...m, myMsg]);

    if (mode === "admin") {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "message", text: myMsg.text }));
        } catch {}
      } else {
        setMsgs((m) => [
          ...m,
          {
            id: `sys-${Date.now()}`,
            from: "system",
            text: "Admin is not connected right now.",
            time: Date.now(),
          },
        ]);
      }
    } else {
      // ✅ AI mode: call YOUR backend (no window.__AI_API_KEY__ anymore)
      const typingId = `ai-typing-${Date.now()}`;
      setMsgs((m) => [
        ...m,
        { id: typingId, from: "ai", text: "...", time: Date.now() },
      ]);

      (async () => {
        try {
          // If you have React proxy to backend, you can change this to "/ai/chat"
          const resp = await fetch("http://localhost:3009/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: myMsg.text }),
          });

          if (!resp.ok) {
            const txt = await resp.text();
            console.error("AI backend error:", resp.status, txt);
            setMsgs((m) => [
              ...m.filter((x) => x.id !== typingId),
              {
                id: `ai-${Date.now()}`,
                from: "ai",
                text: "AI service returned an error.",
                time: Date.now(),
              },
            ]);
            addSystem(`AI backend error: ${resp.status}`);
            return;
          }

          const data = await resp.json();
          const aiText = data?.reply ?? "Sorry, no reply.";

          setMsgs((m) => [
            ...m.filter((x) => x.id !== typingId),
            {
              id: `ai-${Date.now()}`,
              from: "ai",
              text: String(aiText),
              time: Date.now(),
            },
          ]);
        } catch (e) {
          console.error("AI request failed:", e);
          setMsgs((m) => [
            ...m.filter((x) => x.id !== typingId),
            {
              id: `ai-${Date.now()}`,
              from: "ai",
              text: "AI server error.",
              time: Date.now(),
            },
          ]);
          addSystem("AI request failed — check console.");
        }
      })();
    }

    setText("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={mode === "ai" ? "contained" : "text"}
            size="small"
            onClick={() => setMode("ai")}
          >
            AI Help
          </Button>
          <Button
            variant={mode === "admin" ? "contained" : "text"}
            size="small"
            onClick={() => setMode("admin")}
          >
            Admin
          </Button>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="chat-list" ref={listRef}>
          {msgs.map((m) => (
            <Box
              key={m.id}
              className={`chat-msg ${m.from === "user" ? "me" : "them"}`}
            >
              <div className="chat-text">{m.text}</div>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <Button variant="contained" onClick={send} color="secondary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChatModal;
