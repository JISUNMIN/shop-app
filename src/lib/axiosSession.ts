import axios, { InternalAxiosRequestConfig } from "axios";

const SESSION_ID_KEY = "roboshop-session";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "anonymous";

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

const axiosSession = axios.create({
  baseURL: "/api",
});

axiosSession.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};

    (config.headers as Record<string, string>)["x-session-id"] = getSessionId();

    // GET이 아닌 요청이면 Content-Type 추가
    if (config.method && config.method.toLowerCase() !== "get") {
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSession;
