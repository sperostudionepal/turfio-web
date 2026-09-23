import { Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Main Grid with Vertical Dividers on Desktop */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:divide-x lg:divide-slate-100">
          {/* Column 1: Brand Logo, Tagline, Social Icons (3 cols) */}
          <div className="flex flex-col justify-between lg:col-span-3 lg:pr-4">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5">
                <picture>
                  <source srcSet="/logo.webp" type="image/webp" />
                  <img
                    src="/logo.png"
                    alt="Turfio Logo"
                    className="h-9 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                    width="36"
                    height="36"
                  />
                </picture>
                <span className="leading-tight">
                  <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                    TURFIO
                  </span>
                  <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                    Futsal, your way
                  </span>
                </span>
              </div>

              {/* Tagline */}
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 max-w-xs">
                The easiest way to discover and book premium futsal turfs in your city.
              </p>
            </div>

            {/* Social Icons (Facebook, Instagram, TikTok, YouTube) */}
            <div className="mt-6 flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-lime-400 hover:text-slate-900"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-lime-400 hover:text-slate-900"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-lime-400 hover:text-slate-900"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.32 1.54-1.35 2.53-.04.9.41 1.83 1.15 2.37.95.73 2.27.84 3.3.36.93-.42 1.56-1.34 1.67-2.35.03-1.64.01-3.28.02-4.92 0-3.95-.01-7.89.01-11.84z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-lime-400 hover:text-slate-900"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Explore (2 cols) */}
          <div className="lg:col-span-2 lg:pl-6">
            <h4 className="text-[15px] font-extrabold text-slate-900">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600">
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Find Turfs
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support (2 cols) */}
          <div className="lg:col-span-2 lg:pl-6">
            <h4 className="text-[15px] font-extrabold text-slate-900">Support</h4>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600">
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="lg:col-span-2 lg:pl-6">
            <h4 className="text-[15px] font-extrabold text-slate-900">Company</h4>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600">
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-slate-900">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter (3 cols) */}
          <div className="lg:col-span-3 lg:pl-6">
            <h4 className="text-[15px] font-extrabold text-slate-900">Newsletter</h4>
            <p className="mt-4 text-sm font-medium text-slate-500 leading-relaxed">
              Stay updated with the latest offers and court updates.
            </p>

            {/* Email Input Field */}
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 w-full">
              <div className="relative flex w-full items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-slate-900 transition-transform hover:bg-lime-500 active:scale-95"
                >
                  <Send className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Centered Copyright */}
        <div className="mt-14 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-400">
          © 2024 Turfio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
