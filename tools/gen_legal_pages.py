import os

BASE = "/home/claude/style-hub"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Style Hub</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#000000">
<link rel="icon" href="assets/icons/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="manifest.json">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/animations.css">
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
<div class="announce-bar" data-announcement hidden></div>

<header class="navbar">
  <div class="container">
    <a href="index.html" class="brand"><img src="assets/logo.svg" alt="Style Hub logo" width="34" height="34"><span>Style Hub</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="gallery.html">Haircuts</a>
      <a href="services.html">Services</a>
      <a href="booking.html">Book Now</a>
      <a href="favorites.html">Favorites</a>
      <a href="contact.html">Contact</a>
      <a href="about.html">About</a>
    </nav>
    <div class="nav-actions">
      <button class="theme-toggle" aria-label="Switch to light mode"></button>
      <a href="favorites.html" class="icon-btn" aria-label="View favorites" id="nav-fav-btn"></a>
      <a href="booking.html" class="btn btn-primary btn-sm">Book Appointment</a>
      <button class="nav-burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-panel">
  <a href="index.html">Home</a>
  <a href="gallery.html">Haircuts</a>
  <a href="services.html">Services</a>
  <a href="booking.html">Book Now</a>
  <a href="favorites.html">Favorites</a>
  <a href="contact.html">Contact</a>
  <a href="about.html">About</a>
  <a href="admin/login.html" style="font-size:1rem;color:var(--text-muted)">Admin Login</a>
</div>

<main id="main">
  <section class="section" style="padding-top:calc(var(--nav-h) + 48px)">
    <div class="container">
      <div class="section-head section-head--center" data-reveal="up">
        <span class="eyebrow">Legal</span>
        <h1 class="h2">{title}</h1>
        <span class="razor"></span>
      </div>
      <div class="prose" data-reveal="up">
        <p class="updated-note">Last updated: July 2026. This page is managed through the Admin Panel and may be updated at any time.</p>
        {body}
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0;">
      <span>© <span data-year></span> Style Hub. All rights reserved.</span>
      <span><a href="privacy-policy.html">Privacy</a> &middot; <a href="terms.html">Terms</a> &middot; <a href="disclaimer.html">Disclaimer</a> &middot; <a href="cancellation-policy.html">Cancellations</a> &middot; <a href="refund-policy.html">Refunds</a> &middot; <a href="cookie-policy.html">Cookies</a></span>
    </div>
  </div>
</footer>
<button class="back-to-top" aria-label="Back to top"></button>

<script type="module">
  import {{ initLayout }} from "./js/main.js";
  initLayout();
</script>
</body>
</html>
"""

PAGES = {
  "privacy-policy.html": {
    "title": "Privacy Policy",
    "desc": "How Style Hub collects, uses, and protects your personal information.",
    "body": """
      <h2>1. Information We Collect</h2>
      <p>When you book an appointment or create an account, we collect your name, phone number, email address, and booking preferences such as haircut style and preferred barber.</p>
      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To confirm and manage your appointments</li>
        <li>To send booking reminders and service updates</li>
        <li>To personalise your experience, including saved favorites and booking history</li>
        <li>To improve our services based on aggregate, anonymised trends</li>
      </ul>
      <h2>3. Data Storage</h2>
      <p>Your information is stored securely using Firebase (Google Cloud) infrastructure, with access restricted to authorised Style Hub staff through role-based permissions.</p>
      <h2>4. Sharing of Information</h2>
      <p>We do not sell your personal information. Data is only shared with service providers strictly necessary to operate the booking system (such as our hosting and database provider).</p>
      <h2>5. Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us through the Contact page.</p>
      <h2>6. Contact</h2>
      <p>Questions about this policy can be sent to our support email listed on the Contact page.</p>
    """
  },
  "terms.html": {
    "title": "Terms & Conditions",
    "desc": "The terms that govern your use of Style Hub's website and booking services.",
    "body": """
      <h2>1. Acceptance of Terms</h2>
      <p>By using this website or booking an appointment with Style Hub, you agree to these Terms &amp; Conditions.</p>
      <h2>2. Bookings</h2>
      <p>Appointments booked online are subject to availability and confirmation. A verified account is required before your first booking is finalised.</p>
      <h2>3. Pricing</h2>
      <p>All prices displayed are in Indian Rupees (₹) and are subject to change without prior notice. The final price is confirmed at the time of service.</p>
      <h2>4. Conduct</h2>
      <p>We reserve the right to refuse service to anyone behaving disrespectfully toward our staff or other customers.</p>
      <h2>5. Intellectual Property</h2>
      <p>All content on this website, including images, logos, and text, is the property of Style Hub unless otherwise stated.</p>
      <h2>6. Changes to These Terms</h2>
      <p>We may update these terms periodically. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
    """
  },
  "disclaimer.html": {
    "title": "Hairstyle Disclaimer",
    "desc": "Important information about the accuracy of haircut style photos shown on Style Hub.",
    "body": """
      <h2>Reference Images Only</h2>
      <p data-field="disclaimer">The hairstyle photos displayed on Style Hub are for inspiration and reference only. The final haircut may vary depending on your hair type, hair density, hair length, face shape, natural hair growth pattern, styling method, and consultation with the barber. While our barbers strive to achieve a similar look, an exact match cannot be guaranteed. The displayed images are intended to help customers communicate their preferred style and should not be considered a guarantee of identical results.</p>
      <h2>Consultation</h2>
      <p>Every booking includes a short consultation with your barber to discuss what's realistic and best-suited for your hair before any cutting begins.</p>
      <h2>Acceptance</h2>
      <p>You are asked to review and accept this disclaimer before confirming your first appointment. Your acceptance, along with a timestamp, is recorded against your booking.</p>
    """
  },
  "cancellation-policy.html": {
    "title": "Cancellation & Rescheduling Policy",
    "desc": "How to cancel or reschedule your Style Hub appointment.",
    "body": """
      <h2>Cancelling an Appointment</h2>
      <p>You may cancel your appointment from your account dashboard up to 2 hours before your scheduled time at no charge.</p>
      <h2>Rescheduling</h2>
      <p>Appointments can be rescheduled to another available slot, subject to barber availability, up to 2 hours before the original time.</p>
      <h2>Late Cancellations</h2>
      <p>Cancellations made less than 2 hours before the appointment, or repeated no-shows, may affect your ability to book online in the future.</p>
      <h2>Salon-Initiated Changes</h2>
      <p>If we need to cancel or reschedule your appointment (for example, due to barber unavailability), we will contact you as early as possible to arrange a new time.</p>
    """
  },
  "refund-policy.html": {
    "title": "Refund Policy",
    "desc": "Style Hub's policy on refunds for services and online payments.",
    "body": """
      <h2>Services Already Rendered</h2>
      <p>As grooming services are performed in person, refunds are not applicable once a service has been completed to the agreed style.</p>
      <h2>Booking Deposits (where applicable)</h2>
      <p>If a deposit was collected online and the appointment is cancelled within the allowed cancellation window, the deposit will be refunded to the original payment method within 5–7 business days.</p>
      <h2>Service Dissatisfaction</h2>
      <p>If you're not satisfied with a completed service, please let us know within 24 hours so we can make it right — including a complimentary touch-up where reasonable.</p>
      <h2>Online Payments</h2>
      <p>Online payment support is planned for a future update. This policy will be expanded with payment-specific terms at that time.</p>
    """
  },
  "cookie-policy.html": {
    "title": "Cookie Policy",
    "desc": "How Style Hub uses cookies and local storage on this website.",
    "body": """
      <h2>What We Use</h2>
      <p>Style Hub uses local browser storage (not third-party tracking cookies) to remember your theme preference (dark/light mode) and your saved favorite haircuts on this device.</p>
      <h2>Authentication</h2>
      <p>When accounts are enabled, secure session cookies/tokens are used to keep you signed in between visits.</p>
      <h2>No Advertising Trackers</h2>
      <p>We do not use advertising or cross-site tracking cookies on this website.</p>
      <h2>Managing Storage</h2>
      <p>You can clear your browser's local storage at any time through your browser settings; this will reset your saved theme and favorites on this device.</p>
    """
  }
}

for filename, data in PAGES.items():
    html = HEAD.format(title=data["title"], desc=data["desc"], body=data["body"])
    path = os.path.join(BASE, filename)
    with open(path, "w") as f:
        f.write(html)
    print("wrote", path)
