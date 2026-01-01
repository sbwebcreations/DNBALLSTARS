# DNBallstars Thailand Rebuild

This repository contains the rebuilt homepage for DNBallstars Thailand. It is a clean, static website built with HTML, CSS, and Vanilla JavaScript.

## 📂 Project Structure

- **`index.html`**: The main homepage.
- **`assets/`**: Contains all static resources.
  - `css/`: Stylesheets (`style.css`).
  - `img/`: Images (logos, backgrounds, hotel photos).
  - `fonts/`: Local font files.
  - `js/`: Scripts (`script.js`).

## 🚀 How to View on GitHub

1.  Navigate to the repository code tab.
2.  You will see `index.html` at the root, which is the entry point.
3.  Click on `assets/` to explore the styles and images.

## 🌐 How to Deploy to Vercel

Since this is a static site, deployment is extremely simple.

1.  **Log in to Vercel:** Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2.  **Add New Project:** Click "Add New..." -> "Project".
3.  **Import Repository:** Find this repository (`temp_collective_hub` or your renamed repo) in the list and click "Import".
4.  **Configure Project:**
    - **Framework Preset:** Vercel should automatically detect "Other" or "Static". If not, select "Other".
    - **Root Directory:** Leave as `./` (default).
    - **Build Command:** Leave empty.
    - **Output Directory:** Leave empty (or `public` if you move files there, but for this structure, default is fine).
5.  **Deploy:** Click "Deploy".

Vercel will detect the `index.html` and serve it immediately.

## 🛠️ Local Development

To run this locally:

1.  Clone the repository.
2.  Open the folder in VS Code.
3.  Use an extension like "Live Server" to serve `index.html`.
    - OR run a simple python server: `python3 -m http.server 8080`
4.  Open `http://localhost:8080` in your browser.
