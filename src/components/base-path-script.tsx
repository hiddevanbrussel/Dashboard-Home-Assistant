import Script from "next/script";

/**
 * Patches window.fetch / XHR so absolute `/api/...` calls respect Next.js basePath.
 * Runs before hydration when NEXT_PUBLIC_BASE_PATH is set.
 * Under HA ingress, nginx rewrites the `/__ha_ingress__` placeholder to X-Ingress-Path
 * inside this script and other JS bundles.
 */
export function BasePathScript() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base) return null;

  const code = `
(function(){
  var base=${JSON.stringify(base)};
  if(!base)return;
  function prefix(url){
    if(typeof url!=="string")return url;
    if(url.startsWith(base+"/")||url===base)return url;
    if(url.startsWith("/")&&!url.startsWith("//"))return base+url;
    return url;
  }
  var origFetch=window.fetch;
  window.fetch=function(input,init){
    if(typeof input==="string"){
      input=prefix(input);
    }else if(typeof Request!=="undefined"&&input instanceof Request){
      var abs=input.url;
      var origin=location.origin;
      if(abs.indexOf(origin)===0){
        var path=abs.slice(origin.length);
        if(path.startsWith("/")&&!path.startsWith(base+"/")){
          input=new Request(origin+prefix(path),input);
        }
      }
    }
    return origFetch.call(this,input,init);
  };
  var origOpen=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(method,url){
    if(typeof url==="string")arguments[1]=prefix(url);
    return origOpen.apply(this,arguments);
  };
})();`.replace(/\n\s*/g, "");

  return (
    <Script id="ha-base-path-fetch" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
