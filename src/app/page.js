"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Share2, Gift, Bell, Settings, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

function AdMobBannerPlaceholder() {
  return (
    <div className="bg-gray-100 h-48 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 mx-5 my-5 shadow-inner">
      <span className="text-gray-500 font-semibold text-center p-4">
        Banner Ad Placeholder (Medium Rectangle)
        <br />
        [إعلان هنا]
      </span>
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");

  // Load CVs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCvs = JSON.parse(localStorage.getItem("cvs") || "[]");
      setCvs(savedCvs);

      // Share data
      setShareUrl(window.location.href);
      setPageTitle(document.title);
    }
  }, []);

  const toggleLangMenu = () => setOpenLang(!openLang);

  const handleShare = async () => {
    if (!shareUrl || !pageTitle) return;

    const shareData = {
      title: pageTitle,
      text: pageTitle,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.debug("Share cancelled or failed:", err);
      }
    }

    setShowShareModal(true);
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert("فشل النسخ — حاول يدوياً");
    }
  };

  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(pageTitle);

  return (
    <div
      className={`min-h-screen bg-gray-50 font-sans transition-all duration-300 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <Navbar />

      {/* Icons Row */}
      <div className="flex justify-around bg-orange-50 py-4 px-2 shadow-md">
        <IconButton icon={<Share2 />} label={t.share} onClick={handleShare} />
        <IconButton icon={<Gift />} label={t.reward} onClick={() => console.log("Rewarded Ad")} />
        <IconButton icon={<Bell />} label={t.notifications} />
        <IconButton icon={<Settings />} label={t.settings} />
      </div>

      {/* Banner Ad Placeholder */}
      <AdMobBannerPlaceholder />

      {/* Main Content */}
      <main className="flex-1 py-3 px-5 md:py-6 md:px-20">
        <div className="mt-5">
          <h2
            className={`text-xl font-bold text-gray-800 mb-4 ${
              lang === "ar" ? "border-r-4 pr-2" : "border-l-4 pl-2"
            } border-teal-600`}
          >
            {t.resume_section}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {cvs.length > 0 ? (
              <Link
                href="/create"
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
                <span>{t.create}</span>
                <ArrowRight size={24} />
              </Link>
            ) : (
              <Link
                href="/create-new"
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
                <span>{t.create}</span>
                <ArrowRight size={24} />
              </Link>
            )}

            <Link
              href="/downloads"
              className="flex-1 bg-gray-600 hover:bg-gray-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
            >
              <span>{t.downloads}</span>
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/40 z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">مشاركة الرابط</h3>
            <div className="grid grid-cols-3 gap-4">
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                واتساب
              </a>
              <a
                href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                تيليجرام
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                فيسبوك
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                تويتر
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                لينكدإن
              </a>
              <a
                href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                إيميل
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                {copied ? "تم النسخ ✓" : "نسخ الرابط"}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold mb-3 tracking-wide">CV Builder</h2>
            <p className="text-gray-200 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              {t.footer_description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quick_links}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-yellow-300 transition-colors">
                  {t.about_us}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-yellow-300 transition-colors">
                  {t.privacy_policy}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/YOUR_NUMBER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 transition-colors"
                >
                  {t.contact_us}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-500 mt-10 pt-4 text-center text-xs text-gray-200">
          © {new Date().getFullYear()} <span className="font-semibold">CV Builder</span>. {t.all_rights_reserved}
        </div>
      </footer>
    </div>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer min-w-[70px] space-y-1 p-2 rounded-lg transition duration-200 hover:bg-orange-100 active:bg-orange-200"
    >
      <div className="text-teal-600">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}
