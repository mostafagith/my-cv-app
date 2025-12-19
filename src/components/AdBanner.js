"use client";
;
import { useEffect, useRef } from "react";

export default function AdBanner({ adKey }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // 1. مسح أي محتوى قديم داخل الحاوية
      containerRef.current.innerHTML = "";

      // 2. إنشاء iframe لعزل الإعلان
      const iframe = document.createElement("iframe");
      iframe.style.width = "300px";
      iframe.style.height = "250px";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.scrolling = "no";
      
      containerRef.current.appendChild(iframe);

      // 3. بناء محتوى الـ iframe برمجياً
      const adContent = `
        <html>
          <head>
            <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }</style>
          </head>
          <body>
            <div id="ad-target"></div>
            <script type="text/javascript">
              atOptions = {
                'key' : '${adKey}',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>
          </body>
        </html>
      `;

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(adContent);
      doc.close();
    }
  }, [adKey]);

  return (
    <div className="flex flex-col items-center my-12 w-full">
      {/* نص صغير فوق الإعلان ليكون الموقع قانوني (أدسنس يحب ذلك) */}
      <span className="text-[10px] text-gray-400 mb-2 uppercase tracking-[3px]">Advertisement</span>
      
      <div 
        ref={containerRef} 
        className="min-h-[250px] min-w-[300px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        {/* الإعلان سيظهر هنا */}
      </div>
    </div>
  );
}