"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Check,
  Shield,
  ExternalLink,
  Cookie,
} from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  saveCookieConsent,
  type CookieConsentState,
  CONSENT_VERSION_CURRENT,
} from "../utils/cookieConsent";
import { cookieCategories } from "../data/cookieCategories";

type CategoryId = "essential" | "functional" | "analytics" | "marketing";

const STORAGE_KEY = "user_cookie_preferences";
const OPEN_EVENT = "opencookiepreferencecenter";

function readStoredChoices(): CookieConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState & {
      timestamp: string;
      version: string;
    };
    if (parsed.version !== CONSENT_VERSION_CURRENT) return null;
    return {
      essential: true,
      functional: parsed.functional,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
    };
  } catch {
    return null;
  }
}

const acceptAll: CookieConsentState = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const rejectAll: CookieConsentState = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function CookiePreferenceCenter() {
  const reducedMotion = useReducedMotion();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [choices, setChoices] = useState<CookieConsentState>(rejectAll);
  const [openCategory, setOpenCategory] = useState<CategoryId | null>(
    "essential",
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readStoredChoices();
    if (stored) {
      setChoices(stored);
    } else {
      setBannerVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const stored = readStoredChoices();
      if (stored) setChoices(stored);
      setModalOpen(true);
      setBannerVisible(false);
    };
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const container = modalRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKey);
    return () => container.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [modalOpen]);

  const handleAcceptAll = useCallback(() => {
    saveCookieConsent(acceptAll);
    setChoices(acceptAll);
    setBannerVisible(false);
    setModalOpen(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    saveCookieConsent(rejectAll);
    setChoices(rejectAll);
    setBannerVisible(false);
  }, []);

  const handleSaveChoices = useCallback(() => {
    saveCookieConsent(choices);
    setModalOpen(false);
    setBannerVisible(false);
  }, [choices]);

  const toggleCategory = (id: CategoryId) => {
    if (id === "essential") return;
    setChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <AnimatePresence>
        {bannerVisible && !modalOpen && (
          <motion.div
            ref={bannerRef}
            initial={reducedMotion ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-banner-title"
          >
            <div className="mx-auto max-w-3xl rounded-xl border border-border bg-white shadow-card-hover sm:rounded-xl">
              <div className="flex flex-col gap-3 p-3.5 sm:hidden">
                <p className="text-xs text-ink-soft leading-snug">
                  We use essential cookies to run this site. With your
                  permission, we'd also like optional analytics and marketing
                  cookies.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="btn-primary inline-flex items-center justify-center text-center !py-2 !text-xs px-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="btn-secondary inline-flex items-center justify-center text-center !py-2 !text-xs px-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      setBannerVisible(false);
                    }}
                    className="btn-dark inline-flex items-center justify-center text-center !py-2 !text-xs px-1 truncate"
                  >
                    Preferences
                  </button>
                </div>
              </div>

              <div className="hidden flex-col gap-3 p-4 sm:flex">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 id="cookie-banner-title" className="heading-4 text-ink">
                      We respect your privacy
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      We use essential cookies to keep our site running
                      smoothly. With your permission, we'd also like to use
                      optional cookies to analyze site traffic.
                    </p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-3 gap-2 border-t border-border pt-3">
                  <button
                    onClick={handleAcceptAll}
                    className="btn-primary justify-center !px-5 !py-2 !text-sm"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="btn-secondary justify-center !px-5 !py-2 !text-sm"
                  >
                    Reject Non-Essential
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      setBannerVisible(false);
                    }}
                    className="btn-dark justify-center !px-5 !py-2 !text-sm"
                  >
                    Customize Preferences
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/60 backdrop-blur-sm sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <motion.div
              ref={modalRef}
              initial={
                reducedMotion ? false : { y: 30, opacity: 0, scale: 0.98 }
              }
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={
                reducedMotion ? undefined : { y: 30, opacity: 0, scale: 0.98 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-card-hover sm:max-w-2xl sm:rounded-xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
                <div>
                  <h2 id="cookie-modal-title" className="heading-3 text-ink">
                    Cookie Preferences
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                    Control which cookies you allow. You can update these
                    settings anytime.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-ink"
                  aria-label="Close cookie preferences"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                <div className="divide-y divide-border border-y border-border">
                  {cookieCategories.map((cat) => {
                    const isOpen = openCategory === cat.id;
                    const isOn = choices[cat.id];
                    const isLocked = cat.alwaysActive === true;
                    return (
                      <div key={cat.id}>
                        <button
                          onClick={() =>
                            setOpenCategory(isOpen ? null : cat.id)
                          }
                          className="flex w-full items-center justify-between gap-3 py-4 text-left"
                          aria-expanded={isOpen}
                          aria-controls={`cookie-panel-${cat.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-heading font-semibold text-ink sm:text-base">
                              {cat.title}
                            </span>
                            {isLocked && (
                              <span className="badge bg-accent/10 text-accent !px-2 !py-0.5 !text-[10px] text-center">
                                Always Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <ToggleSwitch
                              isOn={isOn}
                              disabled={isLocked}
                              label={`Toggle ${cat.title}`}
                              onClick={() => toggleCategory(cat.id)}
                            />
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300 ${
                                isOpen ? "rotate-180 text-accent" : ""
                              }`}
                            />
                          </div>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`cookie-panel-${cat.id}`}
                              initial={
                                reducedMotion
                                  ? false
                                  : { height: 0, opacity: 0 }
                              }
                              animate={{ height: "auto", opacity: 1 }}
                              exit={
                                reducedMotion
                                  ? undefined
                                  : { height: 0, opacity: 0 }
                              }
                              transition={{
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5 pt-1 space-y-4">
                                <div>
                                  <p className="text-sm text-ink-soft leading-relaxed">
                                    {cat.purpose}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-border p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary w-full justify-center !py-2.5 !text-sm sm:w-auto"
                >
                  Accept All
                </button>
                <button
                  onClick={handleSaveChoices}
                  className="btn-secondary w-full justify-center !py-2.5 !text-sm sm:w-auto"
                >
                  Save My Choices
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!bannerVisible && !modalOpen && (
        <button
          onClick={() => {
            const stored = readStoredChoices();
            if (stored) setChoices(stored);
            setModalOpen(true);
          }}
          className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-card-hover border border-border transition-all duration-300 hover:bg-surface hover:text-accent"
          aria-label="Open cookie settings"
          title="Cookie Settings"
        >
          <Cookie className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

function ToggleSwitch({
  isOn,
  disabled,
  label,
  onClick,
}: {
  isOn: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${isOn ? "bg-primary" : "bg-ink/20"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
}
