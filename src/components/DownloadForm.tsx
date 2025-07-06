"use client";

import { useState } from "react";
import { validateTikTokUrl } from "@/lib/utils";

interface DownloadFormProps {
  onDownload: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  downloadUrls: any;
  videoInfo: any;
  debug?: any;
}

export default function DownloadForm({
  onDownload,
  isLoading,
  error,
  downloadUrls,
  videoInfo,
  debug,
}: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);

    if (value && !validateTikTokUrl(value)) {
      setIsValidUrl(false);
    } else {
      setIsValidUrl(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !isValidUrl) return;
    await onDownload(url);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const downloadFile = async (url: string, filename: string, type: string) => {
    try {
      // For mobile Safari, use a direct download approach
      const response = await fetch("/api/proxy-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, filename, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      // For mobile Safari, create a direct download link
      const downloadUrl = `/api/proxy-download?url=${encodeURIComponent(
        url
      )}&filename=${encodeURIComponent(filename)}&type=${type}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handleVideoDownload = (url: string, type: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const username = videoInfo?.author?.username || "tiktok";
    const filename = `${username}_${type}_${timestamp}.mp4`;
    downloadFile(url, filename, "video");
  };

  const handleMusicDownload = (url: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const musicTitle = videoInfo?.music?.title || "music";
    const cleanTitle = musicTitle.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${cleanTitle}_${timestamp}.mp3`;
    downloadFile(url, filename, "audio");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <label
            htmlFor="tiktok-url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            TikTok Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="tiktok-url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.tiktok.com/@username/video/1234567890"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                url && !isValidUrl ? "border-red-300" : "border-gray-300"
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
          </div>
          {url && !isValidUrl && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid TikTok video URL
            </p>
          )}
        </div>

        {/* Download Button */}
        <button
          type="submit"
          disabled={!url || !isValidUrl || isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Video</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Video Information Card */}
        {videoInfo && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            {/* Download Links - Moved to top */}
            {downloadUrls &&
              (downloadUrls.videoNoWatermark ||
                downloadUrls.videoWithWatermark ||
                downloadUrls.music) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Download Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {downloadUrls.videoNoWatermark && (
                      <button
                        onClick={() =>
                          handleVideoDownload(
                            downloadUrls.videoNoWatermark,
                            "HD_NoWatermark"
                          )
                        }
                        className="inline-flex items-center justify-center space-x-2 text-green-600 hover:text-green-800 transition-colors bg-green-100 hover:bg-green-200 px-3 py-2 rounded-lg font-medium text-sm"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>HD Video</span>
                      </button>
                    )}

                    {downloadUrls.videoWithWatermark && (
                      <button
                        onClick={() =>
                          handleVideoDownload(
                            downloadUrls.videoWithWatermark,
                            "WithWatermark"
                          )
                        }
                        className="inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg font-medium text-sm"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Video (Watermark)</span>
                      </button>
                    )}

                    {downloadUrls.music && (
                      <button
                        onClick={() => handleMusicDownload(downloadUrls.music)}
                        className="inline-flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-lg font-medium text-sm"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Audio</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            {/* Video Cover and Title */}
            <div className="flex space-x-6 mb-6">
              {videoInfo.video?.cover && (
                <div className="flex-shrink-0">
                  <img
                    src={videoInfo.video.cover}
                    alt="Video thumbnail"
                    className="w-48 h-48 rounded-xl object-cover shadow-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-3">
                  {videoInfo.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <span>
                    Duration: {formatDuration(videoInfo.video?.duration || 0)}
                  </span>
                  {videoInfo.video?.ratio && (
                    <>
                      <span>•</span>
                      <span>{videoInfo.video.ratio}</span>
                    </>
                  )}
                </div>

                {/* Author Information */}
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  {videoInfo.author?.avatarMedium && (
                    <img
                      src={videoInfo.author.avatarMedium}
                      alt="Author avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        @{videoInfo.author?.username}
                      </span>
                      {videoInfo.author?.region && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {videoInfo.author.region}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {videoInfo.author?.nickname}
                    </p>
                    {videoInfo.author?.signature && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {videoInfo.author.signature}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Music Information */}
            {videoInfo.music && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {videoInfo.music.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      by {videoInfo.music.author}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDuration(videoInfo.music.duration || 0)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Download Links Found */}
        {videoInfo &&
          downloadUrls &&
          !downloadUrls.videoNoWatermark &&
          !downloadUrls.videoWithWatermark &&
          !downloadUrls.music && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="font-medium text-orange-800">
                  Video info found but no download links available
                </span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                This might be due to TikTok's restrictions. Try with a different
                video or add a cookie for better results.
              </p>
            </div>
          )}
      </form>
    </div>
  );
}
