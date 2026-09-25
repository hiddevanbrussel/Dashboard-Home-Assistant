import Script from "next/script";

/**
 * Patches fetch / XHR so absolute `/api/...` calls stay under the addon basePath.
 *
 * Under HA Ingress the document is served from `/api/hassio_ingress/<token>/...`.
 * Unprefixed `/api/...` would hit Home Assistant Core (404) instead of this app.
 * Prefer the live ingress prefix from `location.pathname` over the build-time
 * placeholder so fetch works even if a script string rewrite was missed.
 */
export function BasePathScript() {
  const baked = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!baked) return null;

  const code = [
    "(function(){",
    "try{",
    `var baked=${JSON.stringify(baked)};`,
    "function detectBase(){",
    "var m=location.pathname.match(/^(\\/api\\/hassio_ingress\\/[^\\/]+)/);",
    "if(m)return m[1];",
    "return baked;",
    "}",
    "var base=detectBase();",
    "if(!base)return;",
    "function prefix(url){",
    "if(typeof url!=='string')return url;",
    "if(url.startsWith('http://')||url.startsWith('https://')||url.startsWith('data:')||url.startsWith('blob:')||url.startsWith('//'))return url;",
    "if(url.startsWith(base+'/')||url===base)return url;",
    "if(url.startsWith(baked+'/')||url===baked){",
    "return base+url.slice(baked.length);",
    "}",
    "if(url.startsWith('/')&&!url.startsWith('//'))return base+url;",
    "return url;",
    "}",
    "var origFetch=window.fetch;",
    "window.fetch=function(input,init){",
    "base=detectBase()||base;",
    "if(typeof input==='string'){input=prefix(input);}",
    "else if(typeof Request!=='undefined'&&input instanceof Request){",
    "var abs=input.url;var origin=location.origin;",
    "if(abs.indexOf(origin)===0){",
    "var path=abs.slice(origin.length);",
    "if(path.startsWith('/')&&!path.startsWith(base+'/')){",
    "input=new Request(origin+prefix(path),input);",
    "}}}",
    "return origFetch.call(this,input,init);",
    "};",
    "var origOpen=XMLHttpRequest.prototype.open;",
    "XMLHttpRequest.prototype.open=function(method,url){",
    "base=detectBase()||base;",
    "if(typeof url==='string')arguments[1]=prefix(url);",
    "return origOpen.apply(this,arguments);",
    "};",
    "}catch(e){console.error('[base-path]',e);}",
    "})();",
  ].join("");

  return (
    <Script id="ha-base-path-fetch" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
