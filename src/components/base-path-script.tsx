import Script from "next/script";

/**
 * Patches fetch / XHR so absolute `/api/...` calls respect Next.js basePath.
 * Media URLs should use `withBasePath` / `cssUrl` at render time — do not patch
 * DOM prototypes here (that breaks React hydration and blanks the page).
 */
export function BasePathScript() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base) return null;

  const code = [
    "(function(){",
    "try{",
    `var base=${JSON.stringify(base)};`,
    "if(!base)return;",
    "function prefix(url){",
    "if(typeof url!=='string')return url;",
    "if(url.startsWith('http://')||url.startsWith('https://')||url.startsWith('data:')||url.startsWith('blob:')||url.startsWith('//'))return url;",
    "if(url.startsWith(base+'/')||url===base)return url;",
    "if(url.startsWith('/')&&!url.startsWith('//'))return base+url;",
    "return url;",
    "}",
    "var origFetch=window.fetch;",
    "window.fetch=function(input,init){",
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
