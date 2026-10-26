(() => {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
  const hostname = window.location.hostname.toLowerCase();

  if (localHosts.has(hostname)) {
    document.documentElement.classList.remove("prelaunch");
  }
})();
