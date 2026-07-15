"use client";

import { useState } from "react";

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShareButtons({
  title,
  url,
  description,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Encode text for URLs
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description ?? title);

  // Share URLs for different platforms
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform];
    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-gray-700 font-medium">Bagikan:</span>

        {/* Facebook */}
        <button
          onClick={() => handleShare("facebook")}
          className="text-blue-600 hover:bg-blue-50 rounded-full p-2 transition-colors"
          aria-label="Bagikan ke Facebook"
          title="Bagikan ke Facebook"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare("twitter")}
          className="text-blue-400 hover:bg-blue-50 rounded-full p-2 transition-colors"
          aria-label="Bagikan ke Twitter"
          title="Bagikan ke Twitter"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare("whatsapp")}
          className="text-green-600 hover:bg-green-50 rounded-full p-2 transition-colors"
          aria-label="Bagikan ke WhatsApp"
          title="Bagikan ke WhatsApp"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M21.105 4.893c-1.827-1.827-4.25-2.833-6.837-2.833-5.327 0-9.67 4.343-9.67 9.67 0 1.707.45 3.375 1.304 4.842L4 22l5.628-1.476c1.414.77 3.013 1.176 4.64 1.176h.003c5.325 0 9.67-4.343 9.67-9.67 0-2.587-1.007-5.01-2.835-6.837zM14.268 19.7h-.003c-1.44 0-2.856-.387-4.093-1.118l-.292-.173-3.048.8.814-2.975-.19-.303c-.81-1.287-1.24-2.777-1.24-4.3 0-4.457 3.627-8.085 8.087-8.085 2.158 0 4.186.84 5.71 2.366 1.525 1.527 2.365 3.555 2.364 5.715 0 4.457-3.627 8.085-8.087 8.085zm4.442-6.054c-.244-.122-1.437-.71-1.66-.79-.223-.08-.385-.122-.547.122-.162.243-.627.79-.768.95-.142.162-.283.182-.527.06-.244-.12-1.03-.38-1.96-1.208-.725-.648-1.214-1.447-1.356-1.69-.142-.244-.015-.375.106-.497.11-.11.244-.284.365-.426.122-.142.162-.243.243-.405.08-.162.04-.304-.02-.426-.062-.122-.548-1.32-.75-1.807-.197-.47-.398-.405-.548-.413-.142-.008-.304-.01-.467-.01-.162 0-.425.06-.648.304-.223.243-.85.832-.85 2.028 0 1.196.873 2.352.994 2.514.122.162 1.7 2.596 4.12 3.642.575.248 1.025.397 1.377.508.58.184 1.107.158 1.524.096.465-.07 1.436-.586 1.64-1.152.202-.566.202-1.05.14-1.152-.06-.102-.223-.162-.466-.284z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare("linkedin")}
          className="text-blue-700 hover:bg-blue-50 rounded-full p-2 transition-colors"
          aria-label="Bagikan ke LinkedIn"
          title="Bagikan ke LinkedIn"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 00-1.68 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Telegram */}
        <button
          onClick={() => handleShare("telegram")}
          className="text-blue-500 hover:bg-blue-50 rounded-full p-2 transition-colors"
          aria-label="Bagikan ke Telegram"
          title="Bagikan ke Telegram"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="text-gray-600 hover:bg-gray-50 rounded-full p-2 transition-colors relative"
          aria-label="Salin link"
          title={copied ? "Link disalin!" : "Salin link"}
        >
          {copied ? (
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        {/* Native Share (if supported) */}
        {typeof window !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="text-gray-600 hover:bg-gray-50 rounded-full p-2 transition-colors"
            aria-label="Bagikan"
            title="Bagikan"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        )}
      </div>

      {copied && (
        <div className="mt-2 text-sm text-green-600 font-medium">
          Link berhasil disalin ke clipboard!
        </div>
      )}
    </div>
  );
}
