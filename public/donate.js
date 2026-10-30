// Copy buttons on the donate page. Loaded as an external file because the
// donate pages allow no third-party or unhashed inline script (scripts/csp.mjs).
(function () {
  function fallbackCopy(value) {
    var area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {}
    document.body.removeChild(area);
    return copied ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  function copy(value) {
    if (window.isSecureContext && navigator.clipboard) {
      return navigator.clipboard.writeText(value).catch(function () {
        return fallbackCopy(value);
      });
    }
    return fallbackCopy(value);
  }

  document.querySelectorAll('button[data-copy]').forEach(function (button) {
    var label = button.querySelector('[data-copy-text]');
    var reset = 0;
    button.hidden = false;
    button.addEventListener('click', function () {
      copy(button.dataset.copy || '').then(
        function () {
          if (label) label.textContent = button.dataset.copiedLabel || 'Copied';
          clearTimeout(reset);
          reset = setTimeout(function () {
            if (label) label.textContent = button.dataset.copyLabel || 'Copy';
          }, 1800);
        },
        function () {},
      );
    });
  });
})();
