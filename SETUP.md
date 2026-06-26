# Practice Lab — Setup (5–10 min, one time)

Everything lives in a single file: **`index.html`**. You only need to set up
the bits you want. The **AI key is required**; email and Drive sync are optional.

---

## 0. Just open it

Double-click `index.html` (or drag it into Chrome/Safari/Edge). It works from a
local file for everything except Google Drive sync (Drive needs the app hosted
on a web address — see section 3).

---

## 1. AI key — REQUIRED (Google Gemini, free)

This is what writes the questions.

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with a Google account → **Create API key** → copy it.
3. In Practice Lab: **⚙️ Settings → AI model**
   - Provider: **Google Gemini**
   - Model: `gemini-2.0-flash` (already filled in — free tier)
   - Paste the key → **🧪 Test connection**. You should see ✅.
4. **Save settings.**

> Free Gemini limits are generous for daily home use (questions are small
> requests). If a model name ever stops working, try `gemini-2.5-flash` or
> `gemini-1.5-flash` in the Model box.

### Share the key with all devices (so kids never type it) — parent only

Once your login (section 4) is set up, you (the parent) can store the key
**encrypted** so every device unlocks it automatically — no key typing per
device, and the key is never in the public file as plain text.

1. Sign in as the parent → **⚙️ Settings → AI** → set the provider/key/model →
   expand **🔑 Share this key with all devices**.
2. Paste the AI key, type each family member's password (once, so it can be
   encrypted for them), tap **🔐 Build shared-key block**. It copies a
   `const KEYVAULT = {…}` block to your clipboard.
3. In `index.html`, replace the existing `const KEYVAULT = {…};` block (near the
   top, just below the LOGIN block) with the copied one. Save and re-publish
   (or ask me to push).
4. Now when anyone logs in, the app decrypts the key from their password and uses
   it everywhere. Kids see *"AI key is set by a parent ✓"* and can't change it.

> Security: each grant is AES-256-GCM encrypted under that person's password, so
> the plaintext key never appears in the repo. Safe for a public GitHub Pages
> site.

**Using your own paid account instead?**
- **OpenAI**: provider = OpenAI, model `gpt-4o-mini` (cheap) or `gpt-4o`, key from
  platform.openai.com.
- **Claude**: provider = Anthropic Claude, model `claude-3-5-haiku-latest`
  (cheap) or `claude-sonnet-4-6`, key from console.anthropic.com.
- **OpenRouter / other**: provider = Custom, set Base URL to the provider's
  `/v1` endpoint.

---

## 2. Email summaries — OPTIONAL (EmailJS, free)

Sends a recap to **zcsstar.nz@gmail.com** every time a practice finishes.

1. Sign up free at **https://www.emailjs.com/** and verify your email.
2. **Email Services → Add New Service** → pick Gmail (connect the account that
   will *send* the mail) → note the **Service ID**.
3. **Email Templates → Create New Template**. In the template, set:
   - **To email**: `{{to_email}}`
   - **Subject**: `{{subject}}`
   - **Content**: switch the body to HTML and put just: `{{{summary_html}}}`
     (triple braces = raw HTML). If your plan only allows plain text, use
     `{{summary_text}}` instead.
   - Save → note the **Template ID**.
4. **Account → General** → copy your **Public Key**.
5. In Practice Lab: **⚙️ Settings → 📧 Email summaries**
   - Turn it on, confirm the “Send to” address.
   - Open “EmailJS keys” and paste **Public Key**, **Service ID**, **Template ID**.
   - **Send a test email** to confirm it arrives. Save.

---

## 3. Google Drive sync — OPTIONAL (cross-device history)

Keeps the wrong/unsure question history in sync between the iPad and laptop.
**Requires the app to be hosted at an https address** (see section 4) — it does
NOT work from a double-clicked local file. If you skip this, history still
saves on each device, and you can use **Export/Import** (History screen) to move
it manually.

1. Go to **https://console.cloud.google.com/** → create a project.
2. **APIs & Services → Library** → enable **Google Drive API**.
3. **APIs & Services → OAuth consent screen** → External → fill app name + your
   email → add your Google account under **Test users**.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Type: **Web application**
   - **Authorised JavaScript origins**: add your hosting URL, e.g.
     `https://YOURNAME.github.io`
   - Create → copy the **Client ID** (`...apps.googleusercontent.com`).
5. In Practice Lab (hosted): **⚙️ Settings → ☁️ Google Drive sync** → turn on,
   paste Client ID → **Connect & sync now** → approve. Data is stored in a
   private app folder in your Drive (not visible among your normal files).

---

## 4. Login / access control (set this BEFORE publishing)

The app has a built-in password gate so only you and the kids can use it. To
turn it on:

**Easiest (no console):** open the app, go to **⚙️ Settings → Access & sync →
Login / passwords**. Type a name + password (tick *parent* for yourself) →
**Generate login line** — it copies a ready-to-paste line. Do this per person,
then jump to step 3 below.

**Or via console:**

1. Open `index.html` in a browser. Press **F12 → Console**.
2. For each person, run (type a password of your choice):
   ```js
   await plHash('mias-password')
   ```
   Copy the long hex string it prints.
3. Open `index.html` in a text editor, find the **🔒 LOGIN** block near the top
   of the `<script>`, and add a line per person:
   ```js
   const AUTH = {
     enabled: true,
     users: [
       {name:'Parent', hash:'paste-parent-hash', parent:true},
       {name:'Mia',    hash:'paste-mia-hash'},
       {name:'Leo',    hash:'paste-leo-hash'},
     ]
   };
   ```
   Each person’s `name` is matched to a student profile (created automatically),
   so logging in with Mia’s password lands on Mia’s profile.
4. Save the file. Now the app asks for a password before it opens. Sign out from
   **⚙️ Settings → Students → Sign out**.

**How secure is this?** It keeps the public out and is fine for a family app. It
is *not* bank-grade: because GitHub Pages serves the file publicly, a technical
person could read the page source. **But there is no real secret in the file** —
your AI key is stored only in each device’s browser, never in the repo. The
password is stored as a one-way SHA-256 hash, not plain text.

**Want genuinely private access?** Put the site behind **Cloudflare Access**
(free): point a Cloudflare-proxied subdomain at the Pages site and require an
email/PIN login. That enforces auth at the network edge so the page is never
served to strangers. Ask and I’ll walk you through it.

---

## 5. Host it on GitHub Pages (so kids open it from any device)

1. Create a repo under your account (e.g. `github.com/zcsstar/practice-lab`) and
   upload everything (`index.html`, `SETUP.md`, `CLAUDE.md`, `design/`).
2. Repo **Settings → Pages → Build from branch → `main` / root → Save**.
3. After a minute it’s live at `https://zcsstar.github.io/practice-lab/`.
   Bookmark / add-to-home-screen on the iPad.
4. Put that URL into the Drive OAuth origins (section 3, step 4) if using sync.

> GitHub Pages free hosting requires a **public** repo. That’s OK here: keys live
> only in each browser’s localStorage (not in the file), so it’s safe to publish
> `index.html`. The login gate (section 4) keeps casual visitors out.

---

## Multiple kids

Tap the **name chip** (top-right) → **Add student**. Each child has their own
practices, mistakes and progress. Switch any time from the chip. (Use the same
student names on every device if you turn on Drive sync. If the login gate is on,
each child’s password lands them on their own profile automatically.)

**Parents vs students.** Anyone marked `parent:true` in the login can manage
everything (all students, AI key, email, sync) but isn’t a student themselves.
The students are the non-parent login users (e.g. Howard, Brendan) — their
profiles are created automatically. A parent logs in and lands on a student,
switching between them via the name chip.

**Students are sandboxed.** A child’s password logs them straight into their own
profile and **only** their profile — they can’t switch to siblings, add or delete
students, or change the email/AI/sync settings. They can manage their own
practice defaults and do practices.

**Saved defaults per student** — two ways to set them:
- On the practice setup screen, configure the exam/year/topics/etc. and tap
  **💾 Save as &lt;name&gt;’s defaults**, or
- Go to the name chip → **Manage students → ⚙️ Defaults** next to a student to
  edit their defaults directly (without starting a practice).

Either way, next time that student starts a practice the form is pre-filled —
and they can still change anything before generating.

## Reference papers (more realistic questions)

Home → **Reference papers** → **Upload past papers** (PDF, image or text of real
past exams). When you start a practice you can tick which papers to use — the AI
then matches their style, wording, format and difficulty (it writes *fresh*
questions, never copies). PDFs/text are read as text for any AI; images and PDFs
are also sent directly when using **Gemini**.

If you have **no** past papers, leave the **“Let the AI search for real exam
info”** toggle on (Gemini only) and it will draw on its knowledge of real ICAS /
Rangitoto / NCEA papers to match the style.

The **“Extra context to improve accuracy”** box on the setup screen is saved per
exam — put anything that helps, e.g. *“ICAS Paper C = Year 5, ~35 questions,
increasing difficulty, no calculator.”*

## Daily use

Home → **Start a practice** → choose **country, subject, exam** (ICAS / Rangitoto
extension / NCEA / general), **year level**, topics, question count, timer,
optionally attach past papers → **Generate**. Kid answers, flags 🚩 anything
unsure, **Submit**. They get marks, correct answers, and step-by-step
explanations; wrong/unsure questions are saved to **Review mistakes** (a question
is “mastered” and drops off after two correct re-answers). A summary emails out
automatically to a parent (if set up).

## Backup

History screen → **Export data** saves a JSON backup. Keep one occasionally if
you’re not using Drive sync.
