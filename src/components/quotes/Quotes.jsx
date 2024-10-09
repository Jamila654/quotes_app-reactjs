import React from "react";
import { categories } from "../category";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ImQuotesLeft } from "react-icons/im";
import { MdContentCopy } from "react-icons/md";

export default function Quotes() {
  const [category, setCategory] = useState("age");
  const [isLoading, setisLoading] = useState(false);
  const [quote, setQuote] = useState();
  const [error, setError] = useState("");
  const [displayGet, setDisplayGet] = useState(true);

  const handleQuoteBtn = async function () {
    setDisplayGet(false);
    setisLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/quotes?category=${category}`,
        { headers: { "X-Api-Key": "lKtqOcitXKlPdf5kvf1ysg==AguhIHwYblypgdyF" } }
      );
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setQuote(data[0]);
    } catch (error) {
      setError("Unable to fetch data", error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleCopyBtn = async function () {
    if (!quote || !quote.quote || !quote.author) {
      alert("Quote or author not available for copying");
      return;
    }
  
    try {
      const textToCopy = `"${quote.quote}" - ${quote.author}`;
      await navigator.clipboard.writeText(textToCopy);
      alert("Quote and Author Copied Successfully!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy the quote and author.");
    }
  }

  return (
    <div className="container w-auto p-2 border-[3px] border-sky-500 flex items-center justify-center">
      {displayGet ? (
        <div className="w-[100%] md:w-[500px] h-auto bg-slate-300 p-4 flex flex-col items-center justify-between gap-5">
          <div className="heading w-full flex flex-col items-center">
            <div className="title font-bold text-xl sm:text-2xl md:text-3xl">
              Quotes App
            </div>
            <div className="sub-title text-gray-600 text-balance text-center">
              Select a category and generate a quote related to it.
            </div>
          </div>
          <div className="select-category w-full flex flex-col gap-4">
            <div className="select flex items-center justify-center gap-4">
              <label htmlFor="categories">Choose a category:</label>
              <select
                name="categories"
                id="categories"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className=" p-2 rounded-md bg-slate-100 border-2 border-gray-300 focus:border-black cursor-pointer outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="button w-full">
              <button
                className=" w-full bg-sky-500 p-2 text-white font-bold rounded-lg text-xl hover:opacity-70"
                onClick={handleQuoteBtn}
              >
                Get
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] md:w-[500px] h-auto bg-slate-300 p-4 flex flex-col items-center justify-between gap-5">
          {error && (
            <div className="err w-full text-red-600 font-bold text-center">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="loading w-full flex items-center justify-center">
              <ClipLoader />
            </div>
          ) : (
            ""
          )}
          {quote && (
            <div className="quote w-full">
              <div className="author">
                <div className="quote text-sky-500"><ImQuotesLeft className=" size-10"/></div>
                <h1>{quote.quote}</h1>
              </div>
              <div className="author w-full flex items-center justify-between mt-3">
                <button onClick={handleCopyBtn} className=" bg-sky-500 p-2 rounded-lg text-white hover:opacity-70"><MdContentCopy/></button>
                <h3 className=" underline underline-offset-8 decoration-sky-500">{quote.author}</h3>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
