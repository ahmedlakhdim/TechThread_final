import { Article } from '../types';

export const defaultArticles: Article[] = [
  {
    id: "1",
    title: "How to Fix a Very Slow Computer",
    description: "Learn step-by-step methods to optimize startup, clear cached system files, and get your operating system running fast again.",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop",
    source: "local",
    content: `
      <h2>Optimize System Speed and Startup Tasks</h2>
      <p>If your computer is taking too long to register commands or freezing intermittently, it typically points to bloated resource consumption. Follow these critical methods to speed up performance dramatically.</p>
      
      <h3>1. Identify Resourec-Heavy Background Applications</h3>
      <p>Background programs can quietly consume RAM and processor cycles. Open <strong>Task Manager</strong> (Ctrl + Shift + Esc on Windows) or <strong>Activity Monitor</strong> (Cmd + Space, type Activity Monitor on macOS) and click on the **CPU** or **Memory** column headers to sort by resource usage. If a non-system application has leaked memory or is using extreme CPU, click **End Task**.</p>
      
      <h3>2. Disable Startup Bottlenecks</h3>
      <p>Many programs automatically configure themselves to launch during system launch. This increases cold-boot times significantly:</p>
      <ol>
        <li>Inside <strong>Task Manager</strong>, click the <strong>Startup Apps</strong> tab (Windows 11) or the <strong>Startup</strong> tab (Windows 10).</li>
        <li>Review the list and locate applications you do not need immediately upon boot (such as communication tools, updating utilities, or gaming platforms).</li>
        <li>Select the application and click <strong>Disable</strong> in the top-right menu or right-click and options.</li>
      </ol>
      
      <h3>3. Run Disk Cleanup and Delete Temporary Files</h3>
      <p>Temporary logging and browser cache files can clog hardware performance. Use the built-in system utility:</p>
      <ol>
        <li>Press <strong>Windows Key + R</strong>, type <code>cleanmgr</code> and hit Enter.</li>
        <li>Select your primary drive (usually C:) and scan.</li>
        <li>Select fields like 'Temporary Files', 'DirectX Shader Cache', and 'Recycle Bin', then click <strong>OK</strong> to purge safely.</li>
      </ol>
    `
  },
  {
    id: "2",
    title: "Guide: Trouble Installing New Software?",
    description: "Resolve administrator privilege blocks, clear installer corruption, and fix registry configuration settings.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
    source: "local",
    content: `
      <h2>Troubleshooting Software Installer Interruptions</h2>
      <p>Unresponsive installers or instant exit codes can happen when security parameters, directory configurations, or privileges are corrupted. Here are the core methods for self-correction.</p>
      
      <h3>1. Elevate to Administrator Privileges</h3>
      <p>Modern applications require explicit write access to core system files. Double-clicking an executable might run it as a standard user, causing silent failures.</p>
      <p><strong>Solution:</strong> Right-click the '.exe' or '.msi' installation bundle and click <strong>Run as administrator</strong>. Select 'Yes' on the User Account Control (UAC) prompt.</p>
      
      <h3>2. Check Temporary Folder Path Corruptions</h3>
      <p>Installers unpack their runtime resources to temporary directories. Overly full temp directories or space restricts can halt this unpacking process.</p>
      <ol>
        <li>Press <strong>Windows Key + R</strong>, type <code>%temp%</code> and press Enter. This will launch your user's localized temp folder.</li>
        <li>Select all folders and press **Delete**. If some files are locked, click 'Skip'. Clear the Recycle Bin and relaunch installation.</li>
      </ol>
      
      <h3>3. Resolve Antivirus and Firewall Interception</h3>
      <p>Unrecognized developer certificates can cause third-party utilities or custom tools to be caught in firewall or sandbox blocks.</p>
      <p><strong>Procedure:</strong> Temporarily pause active scanner protection in Windows Security or third-party software (Malwarebytes, Norton, etc.) for a 10-minute window, install, and restore shields.</p>
    `
  },
  {
    id: "3",
    title: "Solving Device Driver Warnings (Yellow Warning Sign)",
    description: "How to safely reinstall, update, or roll back corrupted devices via the Device Manager interface.",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop",
    source: "local",
    content: `
      <h2>Troubleshooting Hardware Code errors (Code 10, Code 43)</h2>
      <p>The yellow warning icon (⚠️) in your system’s network, display, or peripheral sections indicates that a device driver failed to load or reported an internal configuration failure.</p>
      
      <h3>1. Access system Device Explorer</h3>
      <p>Press the <strong>Windows Key + X</strong> combination on your keyboard and choose <strong>Device Manager</strong> from the power user list. Alternatively, search 'devmgmt.msc' in the Run window.</p>
      
      <h3>2. Reinstall Driver Hardware Modules</h3>
      <p>Many corrupted drivers can be fixed by forcing the kernel to re-detect the hardware layers:</p>
      <ol>
        <li>Expand the section pointing to the warning device (e.g., Network adapters or Universal Serial Bus controllers).</li>
        <li>Right-click the problematic device and choose <strong>Uninstall Device</strong>. Yes: Check the 'Attempt to remove the driver for this device' box only if you have downloaded a replacement driver first!</li>
        <li>Click <strong>Uninstall</strong>. Your keyboard or screen might blink.</li>
        <li>Click <strong>Action</strong> on the top primary navbar menu, and select <strong>Scan for hardware changes</strong>. The kernel will locate the hardware and load a fresh default driver.</li>
      </ol>

      <h3>3. System Automatic Update Query</h3>
      <p>If Code 43 continues to persist, right-click, choose **Update Driver**, then click **Search automatically for drivers**. This queries the Windows Update database for validated matching hardware layers.</p>
    `
  }
];
