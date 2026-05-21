import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 10;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoomBadge = styled.div`
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-family: monospace;
  letter-spacing: 0.04em;

  span {
    color: var(--accent);
    font-weight: 600;
  }
`;

const LiveDot = styled.div`
  width: 8px; height: 8px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--success);
  animation: pulse 1.5s ease infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const LiveLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--success);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CopyBtn = styled.button`
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 14px;
  color: var(--text-muted);
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const LeaveBtn = styled.button`
  background: rgba(255, 60, 60, 0.1);
  border: 1px solid rgba(255, 60, 60, 0.3);
  border-radius: 8px;
  padding: 6px 14px;
  color: #ff6060;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover { background: rgba(255, 60, 60, 0.2); }
`;

const RoomContainer = styled.div`
  flex: 1;
  animation: ${fadeIn} 0.4s ease both;

  .lk-video-conference { background: var(--bg) !important; }
`;

/* ── Loading / Error states ── */
const Center = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

const Spinner = styled.div`
  width: 48px; height: 48px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ErrorCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  max-width: 440px;
  text-align: center;

  h2 {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text);
  }
  p {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  code {
    background: var(--surface2);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--accent);
  }
`;

const BackBtn = styled.button`
  background: var(--accent);
  color: white;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const userName =
    sessionStorage.getItem("userName") ||
    "Guest-" + Math.floor(Math.random() * 1000);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/join-room`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: roomId, userName }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get token");
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchToken();
  }, [roomId, userName]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = useCallback(() => {
    sessionStorage.removeItem("userName");
    navigate("/");
  }, [navigate]);

  if (error) {
    return (
      <Center>
        <ErrorCard>
          <h2>⚠ Couldn't Connect</h2>
          <p>
            {error.includes("API keys") ? (
              <>
                LiveKit API keys are not configured.<br /><br />
                1. Sign up free at <strong>cloud.livekit.io</strong><br />
                2. Copy your API key & secret<br />
                3. Add them to <code>backend/.env</code><br />
                4. Restart the backend
              </>
            ) : (
              error
            )}
          </p>
          <BackBtn onClick={() => navigate("/")}>← Back to Home</BackBtn>
        </ErrorCard>
      </Center>
    );
  }

  if (!token || !serverUrl) {
    return (
      <Center>
        <Spinner />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Joining <strong style={{ color: "var(--text)" }}>{roomId}</strong>…
        </p>
      </Center>
    );
  }

  return (
    <Page>
      <TopBar>
        <RoomInfo>
          <LiveLabel>
            <LiveDot /> Live
          </LiveLabel>
          <RoomBadge>
            Room: <span>{roomId}</span>
          </RoomBadge>
        </RoomInfo>
        <Actions>
          <CopyBtn onClick={handleCopyLink}>
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </CopyBtn>
          <LeaveBtn onClick={handleLeave}>Leave ✕</LeaveBtn>
        </Actions>
      </TopBar>

      <RoomContainer>
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          onDisconnected={handleLeave}
          data-lk-theme="default"
          style={{ height: "calc(100vh - 53px)" }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </RoomContainer>
    </Page>
  );
}
