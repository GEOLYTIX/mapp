/**
## Cookie Consent
This plugin is used to get the 3rd party cookie consent if a user hasn't accepted them.

It adds an local storage entry that will have the item name 'mapp-third-party-cookies' with a true or false.

This storage item will then be used by other plugins to ensure we have consent from the user.

The plugin key must be added to the syncPlugins array with other syncPlugins which should be loaded. eg. `"syncPlugins": ["cookie_consent", "admin", "login"]`

@module cookie_consent
*/

console.log('cookie_consent v4.8');

const css = `
.cookies-toast {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 100001;
  background: var(--color-light-secondary);
  border-top: 1px solid var(--color-primary-light);
  box-sizing: border-box;
  color: var(--color-off-black);
  font-size: 14px;
  line-height: 1.4;
  padding: 1em 2em;
  text-align: center;
  transform: translateY(100%);
}

.cookies-toast[style*="display: block"] {
  animation: 1s ease-in-out 1s forwards showCookieToast;
}

.cookies-toast.before-remove {
  animation: 1s ease-in-out forwards hideCookieToast;
}

.cookies-toast .actions {
  padding: 0.5em;
}

.cookies-toast .cookies-logo {
  height: 1em;
  margin-bottom: 0.5em;

  & img {
    height: 100%;
  }
}
  
.cookies-toast button {
  cursor: pointer;
  padding: 0.25em 0.5em 0.2em;
  transition: 300ms all;
  font-size: 100%;
}

.cookies-toast .cookies-reject {
  background: none;
  border: 1px solid var(--color-off-black);
  color: var(--color-off-black);

  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

}
  
.cookies-toast .cookies-accept {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: var(--color-light);
  
  &:hover {
    background: var(--color-on);
    color: var(--color-light-secondary);
    border: 1px solid var(--color-on);
  }
}
  
@keyframes showCookieToast {
    from { 
      transform: translateY(100%);
    }
    to {
      transform: translateY(0%);
    }

}
  
@keyframes hideCookieToast {
    from {
      transform: translateY(0%);
    }
    to {
      transform: translateY(100%);
    }
}`;

document.head.prepend(mapp.utils.html.node`<style>${css}`);

mapp.plugins.cookie_consent = cookie_consent;

mapp.utils.merge(mapp.dictionaries, {
  en: {
    // use new line \n to split lines of this text
    cookies_consent:
      'We use non-essential third party cookies in MAPP to help us improve the platform \nand give you the best user experience. Please let us know if you agree to ',
    cookies_consent_href_label: 'our use of these cookies',
    cookies_docs_url: 'https://geolytix.github.io/public/mapp/cookies.html',
    accept: 'Accept',
    reject: 'Reject',
  },
});

/**
@function cookie_consent
*/
async function cookie_consent() {
  // If mapp.utils.versionCheck doesn't exist, the codebase is too old to run this
  if (!mapp?.utils?.versionCheck) {
    console.warn(
      `Mapp needs a minimum version of v4.12.x to use this plugin. Your version: ${mapp.version}`,
    );
    return;
  }

  //Get consent from local storage
  const consent = localStorage.getItem('mapp-third-party-cookies');

  // *** not asking again if cookies were rejected
  if (consent == null || consent === 'false') {
    const ask_consent = await toast_element();

    localStorage.setItem('mapp-third-party-cookies', ask_consent);
  }
}

async function toast_element() {
  return new Promise((resolve, reject) => {
    const el_toast = mapp.utils.html.node`<div 
      class="cookies-toast" style="display: none">
      <div class="cookies-logo">
        <img src="https://geolytix.github.io/public/geolytix_mapp.svg">
      </div>
      <span style="white-space: pre-line">${mapp.dictionary.cookies_consent}</span>
      <a href="${mapp.dictionary.cookies_docs_url}" target="_blank">${mapp.dictionary.cookies_consent_href_label}</a>
      <div class="actions">
      <button class="cookies-accept" value="true"
        onclick=${hide_toast}>${mapp.dictionary.accept}
      </button>
      <button class="cookies-reject" value="false"
        onclick=${hide_toast}>${mapp.dictionary.reject}
      </button>
      `;

    document.body.append(el_toast);

    // display flag set later to allow smooth animation
    el_toast.style.display = 'block';

    function hide_toast(e) {
      el_toast.classList.add('before-remove');

      // element removed in a timeout so that hide smooth animation can complete
      setTimeout(function () {
        el_toast.remove();
      }, 1200);

      resolve(e.target.value);
    }
  });
}
