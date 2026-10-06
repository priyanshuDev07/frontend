Cyber Awareness Hub - Full UI/UX upgrade (matches the PDF blueprint)

1) Copy the whole "src" folder from this ZIP over your project's frontend/src
   (do NOT overwrite api.js, main.jsx, admin/ProtectedRoute.jsx, pages/admin/AdminContent.jsx - they are not in this ZIP).
2) Delete these old files (no longer used):
     src/pages/FraudAlerts.jsx
     src/pages/CyberGuide.jsx
3) Run:  cd frontend  &&  npm.cmd run dev
4) In Admin > Pages & Settings > Home, set Title to:  Learn. Protect. Stay Secure.
5) Add your real social links in src/data/site.js (empty ones stay hidden).

Pages: Home, About, Cyber Awareness (+ live fraud alerts), Learning, Projects, Tools (4), Services, Contact, Login/Register.
Admin: Login, Dashboard, Pages & settings, Fraud alerts, Projects, Services, Cyber guide, Messages.
