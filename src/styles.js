import { BRAND } from './constants';

export const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${BRAND.gray50};
    color: ${BRAND.black};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${BRAND.gray100}; }
  ::-webkit-scrollbar-thumb { background: ${BRAND.gray300}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${BRAND.blue}; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 18px; border-radius:8px; font-family:'Poppins',sans-serif; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:all 0.18s ease; text-decoration:none; white-space:nowrap; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; pointer-events:none; }
  .btn-primary { background:${BRAND.blue}; color:#fff; }
  .btn-primary:hover { background:${BRAND.blueDark}; transform:translateY(-1px); box-shadow:0 4px 16px rgba(65,105,225,0.35); }
  .btn-red { background:${BRAND.red}; color:#fff; }
  .btn-red:hover { background:${BRAND.redDark}; }
  .btn-outline { background:transparent; border:2px solid ${BRAND.blue}; color:${BRAND.blue}; }
  .btn-outline:hover { background:${BRAND.blue}; color:#fff; }
  .btn-outline-red { background:transparent; border:2px solid ${BRAND.red}; color:${BRAND.red}; }
  .btn-outline-red:hover { background:${BRAND.red}; color:#fff; }
  .btn-ghost { background:transparent; color:${BRAND.gray500}; }
  .btn-ghost:hover { background:${BRAND.gray100}; color:${BRAND.blue}; }
  .btn-success { background:${BRAND.green}; color:#fff; }
  .btn-success:hover { background:#15803d; }
  .btn-sm { padding:5px 12px; font-size:12px; }
  .btn-lg { padding:13px 28px; font-size:15px; }
  .btn-icon { padding:8px; width:36px; height:36px; }

  /* Cards */
  .card { background:#fff; border-radius:14px; border:1px solid ${BRAND.gray200}; box-shadow:0 1px 6px rgba(65,105,225,0.05); }
  .card-hover { transition:all 0.2s; cursor:pointer; }
  .card-hover:hover { box-shadow:0 6px 24px rgba(65,105,225,0.15); transform:translateY(-2px); }

  /* Inputs */
  .input { width:100%; padding:9px 13px; border:2px solid ${BRAND.gray200}; border-radius:8px; font-family:'Poppins',sans-serif; font-size:13px; background:#fff; color:${BRAND.black}; outline:none; transition:border-color 0.18s; }
  .input:focus { border-color:${BRAND.blue}; box-shadow:0 0 0 3px rgba(65,105,225,0.1); }
  .input::placeholder { color:${BRAND.gray400}; }
  textarea.input { resize:vertical; min-height:80px; }
  select.input { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b95c4' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; padding-right:34px; cursor:pointer; }
  .label { font-size:12px; font-weight:600; color:${BRAND.gray600}; margin-bottom:5px; display:block; }

  /* Badges */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:2px 9px; border-radius:100px; font-size:11px; font-weight:600; }
  .badge-blue { background:${BRAND.blueBg}; color:${BRAND.blue}; }
  .badge-red { background:${BRAND.redLight}; color:${BRAND.red}; }
  .badge-green { background:${BRAND.greenBg}; color:${BRAND.green}; }
  .badge-orange { background:${BRAND.orangeBg}; color:${BRAND.orange}; }
  .badge-gray { background:${BRAND.gray100}; color:${BRAND.gray500}; }
  .badge-yellow { background:${BRAND.yellowBg}; color:${BRAND.yellow}; }
  .badge-purple { background:${BRAND.purpleBg}; color:${BRAND.purple}; }

  /* Progress */
  .progress { height:8px; background:${BRAND.gray200}; border-radius:100px; overflow:hidden; }
  .progress-bar { height:100%; background:linear-gradient(90deg, ${BRAND.blue}, ${BRAND.blueLight}); border-radius:100px; transition:width 0.5s ease; }
  .progress-red .progress-bar { background:linear-gradient(90deg,${BRAND.red},#ff6666); }
  .progress-green .progress-bar { background:linear-gradient(90deg,${BRAND.green},#4ade80); }

  /* Sidebar items */
  .nav-item { display:flex; align-items:center; gap:10px; padding:9px 14px; border-radius:9px; cursor:pointer; font-size:13px; font-weight:500; color:${BRAND.gray500}; transition:all 0.15s; border:none; background:transparent; font-family:'Poppins',sans-serif; width:100%; text-align:left; }
  .nav-item:hover { background:${BRAND.blueBg}; color:${BRAND.blue}; }
  .nav-item.active { background:${BRAND.blue}; color:#fff; font-weight:600; }

  /* Tables */
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; padding:11px 16px; font-size:11px; font-weight:700; color:${BRAND.gray400}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid ${BRAND.gray100}; background:${BRAND.gray50}; white-space:nowrap; }
  td { padding:13px 16px; font-size:13px; border-bottom:1px solid ${BRAND.gray100}; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:${BRAND.gray50}; }

  /* Tabs */
  .tab { padding:9px 18px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; border:none; background:transparent; font-family:'Poppins',sans-serif; transition:all 0.15s; color:${BRAND.gray500}; }
  .tab.active { background:${BRAND.blue}; color:#fff; font-weight:600; }
  .tab:hover:not(.active) { background:${BRAND.gray100}; color:${BRAND.blue}; }

  /* Modal */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.48); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(3px); }
  .modal { background:#fff; border-radius:18px; width:100%; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }

  /* Toast */
  .toast { position:fixed; bottom:22px; right:22px; z-index:9999; padding:13px 18px; border-radius:11px; font-size:13px; font-weight:600; box-shadow:0 8px 28px rgba(0,0,0,0.22); max-width:340px; display:flex; align-items:center; gap:9px; animation:slideUp 0.28s ease; }
  .toast-success { background:${BRAND.gray900}; color:#fff; border-left:4px solid ${BRAND.green}; }
  .toast-error { background:${BRAND.gray900}; color:#fff; border-left:4px solid ${BRAND.red}; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* Chat bubbles */
  .bubble-sent { background:${BRAND.blue}; color:#fff; border-radius:18px 18px 4px 18px; padding:9px 15px; font-size:13px; max-width:72%; align-self:flex-end; word-break:break-word; }
  .bubble-recv { background:${BRAND.gray100}; color:${BRAND.black}; border-radius:18px 18px 18px 4px; padding:9px 15px; font-size:13px; max-width:72%; align-self:flex-start; word-break:break-word; }

  /* Dot pattern (from brand manual) */
  .dot-pattern { background-image:radial-gradient(circle, ${BRAND.blue}25 1.5px, transparent 1.5px); background-size:18px 18px; }

  /* Notification dot */
  .notif-dot { width:8px; height:8px; background:${BRAND.red}; border-radius:50%; position:absolute; top:5px; right:5px; }

  /* Checkbox */
  input[type="checkbox"] { width:17px; height:17px; accent-color:${BRAND.blue}; cursor:pointer; }
  input[type="radio"] { width:16px; height:16px; accent-color:${BRAND.blue}; cursor:pointer; }

  /* Responsive */
  @media(max-width:768px) {
    .hide-mobile { display:none !important; }
  }
`;
