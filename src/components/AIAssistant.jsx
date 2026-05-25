import { useState } from "react";
import { Client, Functions } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6968a600003060c6ce6b");

const functions = new Functions(client);
const FUNCTION_ID = "6a12e564003941db9a20";

export default function AIAssistant({ getTitle }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [hasAsked, setHasAsked] = useState(false);

  const fetchIdeas = async () => {
    const title = getTitle?.();
    if (!title?.trim()) {
      setError("Please enter a post title first.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setHasAsked(true);

    try {
      const res = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({ title }),
      );
      const parsed = JSON.parse(res.responseBody);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((p) => !p)}
        title="PinkPages AI"
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 50,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#f472b6",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(244,114,182,0.35)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="white"
          />
          <path
            d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z"
            fill="white"
            opacity="0.7"
          />
          <path
            d="M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z"
            fill="white"
            opacity="0.5"
          />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "32px",
            zIndex: 50,
            width: "360px",
            borderRadius: "16px",
            background: "#fff",
            border: "1px solid #fce7f3",
            boxShadow:
              "0 8px 40px rgba(244,114,182,0.15), 0 2px 12px rgba(0,0,0,0.06)",
            fontFamily: "inherit",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #fce7f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fff9fb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#fce7f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                    fill="#f472b6"
                  />
                  <path
                    d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z"
                    fill="#f472b6"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#be185d",
                  }}
                >
                  PinkPages AI
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#f9a8d4" }}>
                  Content Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f9a8d4",
                fontSize: "18px",
                lineHeight: 1,
                padding: "2px 6px",
                borderRadius: "6px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            style={{ padding: "18px", maxHeight: "420px", overflowY: "auto" }}
          >
            {/* Welcome */}
            {!hasAsked && !loading && (
              <div
                style={{
                  background: "#fff9fb",
                  border: "1px solid #fce7f3",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "16px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#9d174d",
                    lineHeight: 1.6,
                  }}
                >
                  Hi there! Type a title for your blog post above, then click
                  below and I'll suggest content and ideas for you.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "14px",
                }}
              >
                <p style={{ margin: 0, fontSize: "12px", color: "#e11d48" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#f9a8d4",
                        animation: "bounce 1s infinite",
                        animationDelay: `${i * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#f9a8d4" }}>
                  Thinking...
                </p>
                <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
              </div>
            )}

            {/* Result */}
            {result && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Content suggestion */}
                {result.content && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#f472b6",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Content suggestion
                    </p>
                    <div
                      style={{
                        background: "#fff9fb",
                        border: "1px solid #fce7f3",
                        borderRadius: "12px",
                        padding: "14px 16px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#4b1535",
                          lineHeight: 1.7,
                        }}
                      >
                        {result.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section ideas */}
                {result.ideas?.length > 0 && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#f472b6",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Suggested sections
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {result.ideas.map((idea, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#fff9fb",
                            border: "1px solid #fce7f3",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              minWidth: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: "#fce7f3",
                              color: "#be185d",
                              fontSize: "11px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "1px",
                            }}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <p
                              style={{
                                margin: "0 0 3px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#9d174d",
                              }}
                            >
                              {idea.heading}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#9ca3af",
                                lineHeight: 1.6,
                              }}
                            >
                              {idea.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "14px 18px",
              borderTop: "1px solid #fce7f3",
              background: "#fff9fb",
            }}
          >
            <button
              onClick={fetchIdeas}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: loading ? "#fce7f3" : "#f472b6",
                color: loading ? "#f9a8d4" : "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                letterSpacing: "0.2px",
              }}
            >
              {loading
                ? "Generating..."
                : hasAsked
                  ? "✨ Regenerate"
                  : "✨ Suggest Content"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
