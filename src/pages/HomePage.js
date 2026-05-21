import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-18px) rotate(2deg); }
  66% { transform: translateY(-8px) rotate(-1deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(108,99,255,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,107,157,0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Orb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${float} ${p => p.dur || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.delay || '0s'};

  &:nth-child(1) {
    width: 400px; height: 400px;
    background: rgba(108, 99, 255, 0.08);
    top: -100px; left: -100px;
  }
  &:nth-child(2) {
    width: 300px; height: 300px;
    background: rgba(255, 107, 157, 0.06);
    bottom: -50px; right: -50px;
  }
  &:nth-child(3) {
    width: 200px; height: 200px;
    background: rgba(108, 99, 255, 0.05);
    top: 50%; left: 60%;
  }
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  animation: ${fadeUp} 0.6s ease both;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, rgba(108,99,255,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2.5rem;
`;

const LogoMark = styled.div`
  width: 44px; height: 44px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 8px 24px var(--accent-glow);
`;

const LogoText = styled.span`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f0eeff 30%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Headline = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.5rem;
  color: var(--text);
`;

const Sub = styled.p`
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  font-weight: 300;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 1.5rem 0;
  color: var(--text-muted);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.85rem 1rem;
  color: var(--text);
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: var(--text-muted); }

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, var(--accent), #8b7cf6);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 8px 24px var(--accent-glow);
  letter-spacing: 0.02em;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px var(--accent-glow);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: var(--surface2);
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: border-color 0.2s, background 0.2s;
  margin-top: 0.5rem;

  &:hover { border-color: var(--accent); background: rgba(108,99,255,0.06); }
`;

const ErrorMsg = styled.div`
  background: rgba(255, 80, 80, 0.1);
  border: 1px solid rgba(255, 80, 80, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ff8080;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

function generateRoomId() {
  const words = ['ocean','spark','nova','drift','echo','prism','wave','orbit','forge','bloom'];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${pick()}-${pick()}-${num}`;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!userName.trim()) { setError("Enter your name first"); return; }
    setError(""); setLoading(true);
    const roomId = generateRoomId();
    sessionStorage.setItem("userName", userName.trim());
    navigate(`/room/${roomId}`);
  };

  const handleJoin = async () => {
    if (!userName.trim()) { setError("Enter your name first"); return; }
    if (!joinRoomId.trim()) { setError("Enter a room ID"); return; }
    setError("");
    sessionStorage.setItem("userName", userName.trim());
    navigate(`/room/${joinRoomId.trim()}`);
  };

  return (
    <Page>
      <Orb dur="9s" delay="0s" />
      <Orb dur="11s" delay="-3s" />
      <Orb dur="7s" delay="-5s" />

      <Card>
        <Logo>
          <LogoMark>📡</LogoMark>
          <LogoText>MeetSpace</LogoText>
        </Logo>

        <Headline>Video calls,<br />no friction.</Headline>
        <Sub>Create or join a meeting in seconds. No account needed.</Sub>

        <InputGroup>
          <Label>Your Name</Label>
          <Input
            placeholder="e.g. Alex Johnson"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
        </InputGroup>

        <PrimaryBtn onClick={handleCreate} disabled={loading}>
          {loading ? "Creating…" : "✦ Start New Meeting"}
        </PrimaryBtn>

        <Divider>or join existing</Divider>

        <InputGroup>
          <Label>Room ID</Label>
          <Input
            placeholder="e.g. ocean-spark-342"
            value={joinRoomId}
            onChange={e => setJoinRoomId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </InputGroup>

        <SecondaryBtn onClick={handleJoin}>Join Meeting →</SecondaryBtn>

        {error && <ErrorMsg>⚠ {error}</ErrorMsg>}
      </Card>
    </Page>
  );
}
