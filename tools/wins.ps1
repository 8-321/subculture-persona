Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class WEnum {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
"@
$cb = [WEnum+EnumProc]{ param($h,$l)
  if ([WEnum]::IsWindowVisible($h)) {
    $sb = New-Object System.Text.StringBuilder 512
    [WEnum]::GetWindowText($h, $sb, 512) | Out-Null
    $t = $sb.ToString()
    if ($t.Length -gt 0) {
      $r = New-Object WEnum+RECT
      [WEnum]::GetWindowRect($h, [ref]$r) | Out-Null
      $pid2 = 0; [WEnum]::GetWindowThreadProcessId($h, [ref]$pid2) | Out-Null
      $w = $r.Right-$r.Left; $ht = $r.Bottom-$r.Top
      if ($w -gt 300 -and $ht -gt 200) { Write-Output "$pid2`t$w x $ht`t$t" }
    }
  }
  return $true
}
[WEnum]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
