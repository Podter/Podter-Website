import githubIcon from "@iconify/icons-fa6-brands/github";
import discordIcon from "@iconify/icons-fa6-brands/discord";
import icon90RingWithBg from "@iconify/icons-svg-spinners/90-ring-with-bg";
import { Icon } from "@iconify/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Send, LogOut, XCircle, Edit, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import getUsername, { UserData } from "@/lib/getUsername";

type ActionsProps = {
  userMessage: GuestbookUser | null;
  parentLoading?: boolean;
};

export default function Actions({
  userMessage,
  parentLoading = false,
}: ActionsProps) {
  const session = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    text: "Loading...",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    try {
      if (editing) {
        await axios.put("/api/guestbook", {
          message: message,
        });
      } else {
        await axios.post("/api/guestbook", {
          message: message,
        });
      }

      router.reload();
    } catch {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  }

  async function deleteMessage() {
    setLoading(true);
    try {
      await axios.delete("/api/guestbook");

      router.reload();
    } catch {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userMessage) {
      setEditing(true);
      setMessage(userMessage.message);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 w-60 pt-3">
      {(loading || parentLoading) && !message ? (
        <>
          <div className="btn btn-active no-animation w-full gap-3 duration-75 transition-colors animate-pulse cursor-not-allowed" />
          <div className="btn btn-active no-animation w-full gap-3 duration-75 transition-colors animate-pulse cursor-not-allowed" />
          <div>
            <Icon icon={icon90RingWithBg} className="h-6 w-6" scale={24} />
          </div>
        </>
      ) : session.status === "unauthenticated" ? (
        <>
          <button
            className="btn w-full gap-3 duration-75 transition-colors"
            onClick={() => signIn("github")}
          >
            Sign in with GitHub
            <Icon icon={githubIcon} className="h-6 w-6" scale={24} />
          </button>
          <button
            className="btn w-full gap-3 duration-75 transition-colors"
            onClick={() => signIn("discord")}
          >
            Sign in with Discord
            <Icon icon={discordIcon} className="h-6 w-6" scale={24} />
          </button>
        </>
      ) : session.status === "authenticated" ? (
        <div className="form-control">
          <label className="label">
            <span className="label-text-alt">
              Signed in as{" "}
              <a
                className="tooltip tooltip-top cursor-pointer"
                data-tip={userData.text}
                onMouseEnter={() => {
                  if (!userData.url) {
                    getUsername(
                      session?.data?.user.providerAccountId || "",
                      setUserData
                    );
                  }
                }}
                href={userData.url}
              >
                <span className="font-semibold">
                  {session.data?.user?.name}
                </span>
              </a>
            </span>
          </label>
          <form className="input-group" onSubmit={submit}>
            <input
              type="text"
              placeholder="your message"
              className={`input input-bordered ${error ? "input-error" : ""}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required={true}
              disabled={loading}
            />
            <button
              className="btn btn-square tooltip tooltip-top inline-flex font-normal normal-case duration-100"
              data-tip={editing ? "Edit" : "Send"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Icon icon={icon90RingWithBg} className="h-6 w-6" scale={24} />
              ) : editing ? (
                <Edit className="h-6 w-6" size={24} />
              ) : (
                <Send className="h-6 w-6" size={24} />
              )}
            </button>
          </form>
          <label className="label">
            <span
              className="label-text-alt link link-hover"
              onClick={() => signOut()}
            >
              <LogOut
                className="inline mr-1 align-[-0.125em] h-3 w-3"
                size={12}
              />
              Sign out
            </span>
            {editing ? (
              <span
                className="label-text-alt link link-hover link-error"
                onClick={deleteMessage}
              >
                <Trash2
                  className="inline mr-1 align-[-0.125em] h-3 w-3"
                  size={12}
                />
                Delete
              </span>
            ) : undefined}
          </label>
        </div>
      ) : (
        ""
      )}
      {error ? (
        <div className="toast">
          <div className="alert alert-error">
            <div>
              <XCircle size={24} className="h-6 w-6" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
}