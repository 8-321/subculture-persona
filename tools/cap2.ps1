Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class WinCap2 {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
"@
$best = [IntPtr]::Zero; $bestArea = 0
$cb = [WinCap2+EnumProc]{ param($h,$l)
  if ([WinCap2]::IsWindowVisible($h)) {
    $sb = New-Object System.Text.StringBuilder 512
    [WinCap2]::GetWindowText($h, $sb, 512) | Out-Null
    if ($sb.ToString() -like '*miniprogram*') {
      $r = New-Object WinCap2+RECT
      [WinCap2]::GetWindowRect($h, [ref]$r) | Out-Null
      $a = ($r.Right-$r.Left)*($r.Bottom-$r.Top)
      if ($a -gt $script:bestArea) { $script:bestArea = $a; $script:best = $h }
    }
  }
  return $true
}
[WinCap2]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
$h = $best; $r = New-Object WinCap2+RECT
[WinCap2]::GetWindowRect($h, [ref]$r) | Out-Null
$w = $r.Right - $r.Left; $ht = $r.Bottom - $r.Top
Write-Output "handle=$h size=$w x $ht"
$bmp = New-Object System.Drawing.Bitmap $w, $ht
$g = [System.Drawing.Graphics]::FromImage($bmp)
$hdc = $g.GetHdc()
[WinCap2]::PrintWindow($h, $hdc, 2) | Out-Null
$g.ReleaseHdc($hdc); $g.Dispose()
$path = 'C:\Users\34137\AppData\Local\Temp\ide-current.png'
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
Write-Output $path
