export function isLegacyBrowser() {
    const ua = window.navigator.userAgent;
    return (
      ua.includes("MSIE") || ua.includes("Trident") || // Internet Explorer
      ua.includes("Android 4.") || // Android antiguo
      ua.includes("Opera Mini")
    );
}  