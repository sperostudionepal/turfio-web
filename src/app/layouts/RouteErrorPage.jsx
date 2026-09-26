import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

export default function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message;

  // A stale tab after a deploy fails to fetch old chunk files; a reload picks up the new build.
  const isChunkError = /dynamically imported module|Loading chunk|Importing a module script failed/i.test(detail || '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-sm">
        !
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        {isChunkError ? 'A new version is available' : 'Something went wrong'}
      </h1>
      <p className="text-slate-600 max-w-md mb-2">
        {isChunkError
          ? 'Reload the page to get the latest version of Turfio.'
          : 'This page hit an unexpected error. You can try again or head back home.'}
      </p>
      {import.meta.env.DEV && detail && (
        <p className="text-xs font-mono text-rose-600 max-w-xl mb-6 break-words">{detail}</p>
      )}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => navigate('/', { replace: true })}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
