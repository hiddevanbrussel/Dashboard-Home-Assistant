import Script from "next/script";

/**
 * Patches fetch/XHR and media/CSS URL assignment so absolute `/…` paths respect
 * Next.js basePath. Under HA ingress, nginx rewrites `/__ha_ingress__` in this
 * script to the real `X-Ingress-Path`.
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
    if(url.startsWith("http://")||url.startsWith("https://")||url.startsWith("data:")||url.startsWith("blob:")||url.startsWith("//"))return url;
    if(url.startsWith(base+"/")||url===base)return url;
    if(url.startsWith("/")&&!url.startsWith("//"))return base+url;
    return url;
  }
  function rewriteCssUrls(v){
    if(typeof v!=="string"||v.indexOf("url(")<0)return v;
    return v.replace(/url\\(\\s*(['\"]?)(\\/[^)'\"]*)\\1\\s*\\)/g,function(_m,q,path){
      if(path.startsWith("//"))return "url("+q+path+q+")";
      return "url("+q+prefix(path)+q+")";
    });
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
  function patchSrc(Ctor){
    if(!Ctor||!Ctor.prototype)return;
    var desc=Object.getOwnPropertyDescriptor(Ctor.prototype,"src");
    if(!desc||!desc.set)return;
    Object.defineProperty(Ctor.prototype,"src",{
      configurable:true,
      enumerable:desc.enumerable,
      get:desc.get,
      set:function(v){desc.set.call(this,prefix(v));}
    });
  }
  patchSrc(window.HTMLImageElement);
  patchSrc(window.HTMLVideoElement);
  patchSrc(window.HTMLSourceElement);
  if(window.HTMLVideoElement){
    var posterDesc=Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype,"poster");
    if(posterDesc&&posterDesc.set){
      Object.defineProperty(HTMLVideoElement.prototype,"poster",{
        configurable:true,
        enumerable:posterDesc.enumerable,
        get:posterDesc.get,
        set:function(v){posterDesc.set.call(this,prefix(v));}
      });
    }
  }
  var origSetAttribute=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(name,value){
    if(typeof value==="string"){
      var n=String(name).toLowerCase();
      if(n==="src"||n==="poster")value=prefix(value);
      else if(n==="style")value=rewriteCssUrls(value);
    }
    return origSetAttribute.call(this,name,value);
  };
  if(window.CSSStyleDeclaration){
    var bgDesc=Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype,"backgroundImage");
    if(bgDesc&&bgDesc.set){
      Object.defineProperty(CSSStyleDeclaration.prototype,"backgroundImage",{
        configurable:true,
        enumerable:bgDesc.enumerable,
        get:bgDesc.get,
        set:function(v){bgDesc.set.call(this,rewriteCssUrls(v));}
      });
    }
    var origSetProperty=CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty=function(name,value,priority){
      if(typeof value==="string"&&(name==="background-image"||name==="backgroundImage")){
        value=rewriteCssUrls(value);
      }
      return origSetProperty.call(this,name,value,priority);
    };
  }
  function fixEl(el){
    if(!el||el.nodeType!==1)return;
    if(el.hasAttribute("src")){
      var s=el.getAttribute("src");
      var p=prefix(s);
      if(p!==s)origSetAttribute.call(el,"src",p);
    }
    if(el.hasAttribute("poster")){
      var po=el.getAttribute("poster");
      var pp=prefix(po);
      if(pp!==po)origSetAttribute.call(el,"poster",pp);
    }
    if(el.hasAttribute("style")){
      var st=el.getAttribute("style");
      var ns=rewriteCssUrls(st);
      if(ns!==st)origSetAttribute.call(el,"style",ns);
    }
  }
  function scan(root){
    if(!root||!root.querySelectorAll)return;
    root.querySelectorAll("img[src],video[src],source[src],video[poster],[style*=\\"url(\\"]").forEach(fixEl);
  }
  scan(document);
  document.addEventListener("DOMContentLoaded",function(){scan(document);});
  if(window.MutationObserver){
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m=muts[i];
        if(m.type==="attributes")fixEl(m.target);
        for(var j=0;j<m.addedNodes.length;j++){
          var n=m.addedNodes[j];
          if(n.nodeType===1){fixEl(n);scan(n);}
        }
      }
    }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src","poster","style"]});
  }
})();`.replace(/\n\s*/g, "");

  return (
    <Script id="ha-base-path-fetch" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
