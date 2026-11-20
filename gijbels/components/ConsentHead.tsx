/**
 * Google Consent Mode v2: alles wat niet strikt nodig is, staat standaard uit tot de bezoeker toestemming geeft.
 * Dit script staat in <head>, vóór elke tag, zodat ook later toegevoegde Google-tags (via NEXT_PUBLIC_GTM_ID) het respecteren.
 * Een eerder gegeven keuze (cookie cc_cookie) wordt meteen toegepast.
 */
const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', personalization_storage: 'denied',
  functionality_storage: 'granted', security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
try {
  var m = document.cookie.match(/(?:^|; )cc_cookie=([^;]*)/);
  if (m) {
    var c = JSON.parse(decodeURIComponent(m[1])).categories || [];
    var a = c.indexOf('analytics') > -1, k = c.indexOf('marketing') > -1;
    gtag('consent', 'update', {
      analytics_storage: a ? 'granted' : 'denied',
      ad_storage: k ? 'granted' : 'denied', ad_user_data: k ? 'granted' : 'denied',
      ad_personalization: k ? 'granted' : 'denied', personalization_storage: k ? 'granted' : 'denied'
    });
  }
} catch (e) {}
`;

const gtm = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;

export default function ConsentHead() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <>
      <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: consentDefaults }} />
      {id && /^GTM-[A-Z0-9]+$/.test(id) && <script id="gtm" dangerouslySetInnerHTML={{ __html: gtm(id) }} />}
    </>
  );
}
