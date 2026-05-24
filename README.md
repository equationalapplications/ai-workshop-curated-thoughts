Here are the step-by-step instructions for downloading and installing the prebuilt version of **[Curated Thoughts](https://github.com/equationalapplications/curated-thoughts)** on your machine. Since this is a Tauri-based application hosted on GitHub, you will be grabbing the compiled installers directly from the project's Releases page.

### General First Step: Go to the Releases Page

For all operating systems, start by navigating to the official GitHub repository's release section:

* **[Curated Thoughts Releases](https://github.com/equationalapplications/curated-thoughts/releases)**
* Always look for the tag labeled **Latest** to ensure you get the most up-to-date version.

---

### Windows Installation

1. On the Releases page, look for the file ending in **`.msi`** or **`.exe`** (e.g., `CuratedThoughts_x64-setup.exe` or `CuratedThoughts_x64.msi`) under the "Assets" dropdown.
2. Download the file to your computer.
3. Double-click the downloaded installer.
4. Follow the standard Windows installation wizard prompts.
5. Once installed, you can launch Curated Thoughts from your Start Menu.

> **Note:** If Windows Defender SmartScreen displays a "Windows protected your PC" warning (common for indie/open-source apps), click **More info**, then click **Run anyway**.

---

### macOS Installation

1. On the Releases page, look for the file ending in **`.dmg`** under the "Assets" dropdown.
* *Make sure to pick the right architecture if multiple are listed: `aarch64` for Apple Silicon (M1/M2/M3) or `x64` for older Intel Macs.*


2. Download the `.dmg` file to your computer.
3. Double-click the file to mount the disk image.
4. Drag and drop the **Curated Thoughts** application icon into the **Applications** folder shortcut provided in the window.
5. Open your Applications folder and double-click Curated Thoughts to launch it.

> **Note:** Because the app might not be signed with an Apple Developer certificate, macOS may block it with an "Unidentified Developer" warning. If this happens, click **OK**, open your Mac's **System Settings > Privacy & Security**, scroll down, and click **Open Anyway** next to the Curated Thoughts prompt.

---

### Linux Installation

Tauri typically outputs two primary formats for Linux: Debian packages (`.deb`) and AppImages (`.AppImage`).

#### Option A: Using the `.AppImage` (Universal/Portable)

1. Download the **`.AppImage`** file from the Releases page.
2. Open your terminal and navigate to your download folder.
3. Make the file executable by running:
```bash
chmod +x CuratedThoughts_x86_64.AppImage

```


4. Run the application directly:
```bash
./CuratedThoughts_x86_64.AppImage

```



#### Option B: Using the `.deb` file (Debian/Ubuntu-based distributions)

1. Download the **`.deb`** file from the Releases page.
2. Open your terminal and navigate to your download folder.
3. Install the package using `dpkg`:
```bash
sudo dpkg -i curated-thoughts_amd64.deb

```


4. If there are any missing dependencies, resolve them by running `sudo apt-get install -f`.
5. You can now launch Curated Thoughts from your desktop environment's application launcher.

---

Once installed, you can begin dropping your documents into the watched vault and let the local LLM Active Librarian start building your wiki!