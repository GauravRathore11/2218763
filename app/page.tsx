// app/page.tsx
"use client";
import { useState } from "react";
import { Log } from "@/app/utils/logger";
import api from "@/app/utils/axios";

type UrlInput = {
  longUrl: string;
  validityMinutes?: number;
  shortcode?: string;
};

type ShortUrlResponse = {
  shortUrl: string;
  expiryTime: string;
};

export default function HomePage() {
  const [urlData, setUrlData] = useState<UrlInput>({ longUrl: "" });
  const [results, setResults] = useState<ShortUrlResponse[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlData({ ...urlData, [e.target.name]: e.target.value });
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

      const handleSubmit = async () => {
        if (!validateUrl(urlData.longUrl)) {
          await Log("frontend", "error", "handler", "Invalid URL format");
          alert("Please enter a valid URL.");
          return;
        }

        const body = {
          longUrl: urlData.longUrl,
          validityMinutes: Number(urlData.validityMinutes) || 30,
          shortcode: urlData.shortcode || undefined,
        };

        try {
          await Log("frontend", "info", "network", "Sending URL to shorten");

          const res = await api.post("/shorten", body);
          const data = res.data;

          setResults([...results, data]);
          await Log("frontend", "info", "ui", `Short URL created: ${data.shortUrl}`);
        } catch (err: any) {
          await Log("frontend", "fatal", "network", err.message || "Unknown error");
          alert("Failed to shorten URL");
        }
      };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔗 URL Shortener
          </h1>
          <p className="text-gray-600">Transform long URLs into short, manageable links</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Long URL Input */}
          <div>
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Long URL
            </label>
            <input
              type="url"
              id="longUrl"
              name="longUrl"
              value={urlData.longUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/very-long-url"
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Validity and Shortcode Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="validityMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                Validity (minutes)
              </label>
              <input
                type="number"
                id="validityMinutes"
                name="validityMinutes"
                onChange={handleChange}
                placeholder="30"
                min="1"
                className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="shortcode" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Shortcode
              </label>
              <input
                type="text"
                id="shortcode"
                name="shortcode"
                onChange={handleChange}
                placeholder="my-custom-code"
                className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Shorten URL
          </button>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8">
            <hr className="border-gray-200 mb-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Generated Short URLs
            </h2>
            <div className="space-y-4">
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">🔗 Short URL:</span>
                    <div className="mt-1">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-mono text-sm">
                        {res.shortUrl}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">⏳ Expires:</span>
                    <span className="text-sm text-gray-600 ml-2">{res.expiryTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}